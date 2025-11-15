import { PDFDocument } from "pdf-lib";

interface FileItem {
  id: string;
  file: File;
  preview?: string;
  buffer: ArrayBuffer;
  status: "pending" | "success" | "error";
  errorMessage?: string;
  selectedPages?: number[]; // Array of page indices (0-based)
  totalPages?: number;
}

let files: FileItem[] = [];

export async function initPdfHandler() {
  // Set up event listeners and initialize the handler
  setupFileUpload();
  setupFileList();
  updatePreview();

  // Listen for error notifications from PageSelectorModal
  window.addEventListener("showErrorNotification", (e: Event) => {
    const customEvent = e as CustomEvent<{ message: string }>;
    if (customEvent.detail?.message) {
      showErrorNotification(customEvent.detail.message);
    }
  });
}

function setupFileUpload() {
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");

  if (!dropZone || !fileInput) return;

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("border-primary-500", "bg-primary-50");
    dropZone.classList.remove("border-gray-300");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("border-primary-500", "bg-primary-50");
    dropZone.classList.add("border-gray-300");
  });

  dropZone.addEventListener("drop", async (e) => {
    e.preventDefault();
    dropZone.classList.remove("border-primary-500", "bg-primary-50");
    dropZone.classList.add("border-gray-300");

    const droppedFiles = e.dataTransfer?.files;
    if (droppedFiles) {
      await handleFiles(droppedFiles);
    }
  });

  fileInput.addEventListener("change", async (e) => {
    const selectedFiles = (e.target as HTMLInputElement).files;
    if (selectedFiles) {
      await handleFiles(selectedFiles);
    }
  });
}

async function handleFiles(fileList: FileList) {
  const failedFiles: string[] = [];
  let successCount = 0;

  for (const file of fileList) {
    if (file.type !== "application/pdf") {
      failedFiles.push(file.name);
      showErrorNotification(`${file.name} is not a PDF file`);
      continue;
    }

    const id = crypto.randomUUID();
    let buffer: ArrayBuffer;
    let status: "success" | "error" = "success";
    let errorMessage: string | undefined;

    try {
      buffer = await file.arrayBuffer();

      // Validate PDF
      try {
        const pdfDoc = await PDFDocument.load(buffer);
        const pageCount = pdfDoc.getPageCount();

        if (pageCount === 0) {
          throw new Error("PDF has no pages");
        }

        // Validate page dimensions
        const firstPage = pdfDoc.getPage(0);
        const { width, height } = firstPage.getSize();

        if (width <= 0 || height <= 0) {
          throw new Error("Invalid page dimensions");
        }

        // If multipage, show page selector modal
        if (pageCount > 1) {
          const added = await showPageSelector(file, buffer, id, pageCount);
          if (added) {
            successCount++;
          }
        } else {
          // Single page - add directly
          files.push({
            id,
            file,
            buffer,
            status: "success",
            selectedPages: [0],
            totalPages: 1,
          });
          successCount++;
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Invalid or corrupted PDF file";
        status = "error";
        errorMessage = errorMsg;
        failedFiles.push(file.name);
        showErrorNotification(`Failed to load ${file.name}: ${errorMsg}`);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to read file";
      failedFiles.push(file.name);
      showErrorNotification(`Failed to read ${file.name}: ${errorMsg}`);
    }
  }

  // Show error summary if any files failed
  if (failedFiles.length > 0) {
    const message =
      successCount > 0
        ? `${successCount} file(s) added successfully. ${failedFiles.length} file(s) failed to load.`
        : `All ${failedFiles.length} file(s) failed to load.`;

    showModalWithRetry("Some Files Failed to Load", message, failedFiles);
  } else if (successCount > 0) {
    showNotification(
      successCount === 1
        ? "File added successfully"
        : `${successCount} files added successfully`,
    );
  }

  updateFileList();

  // Dispatch event with file buffers for preview (only successful files)
  const fileBuffers = files
    .filter((f) => f.status === "success")
    .map((f) => ({
      name: f.file.name,
      buffer: f.buffer,
      selectedPages: f.selectedPages || [0],
    }));
  window.dispatchEvent(
    new CustomEvent("fileListUpdated", {
      detail: { files: fileBuffers },
    }),
  );

  updatePreview();
}

async function showPageSelector(
  file: File,
  buffer: ArrayBuffer,
  id: string,
  totalPages: number,
): Promise<boolean> {
  return new Promise((resolve) => {
    window.dispatchEvent(
      new CustomEvent("showPageSelector", {
        detail: {
          file,
          buffer,
          onConfirm: (selectedPages: number[]) => {
            files.push({
              id,
              file,
              buffer,
              status: "success",
              selectedPages,
              totalPages,
            });
            showNotification(
              `Added ${selectedPages.length} page(s) from ${file.name}`,
            );
            updateFileList();

            // Update preview
            const fileBuffers = files
              .filter((f) => f.status === "success")
              .map((f) => ({
                name: f.file.name,
                buffer: f.buffer,
                selectedPages: f.selectedPages || [0],
              }));
            window.dispatchEvent(
              new CustomEvent("fileListUpdated", {
                detail: { files: fileBuffers },
              }),
            );
            resolve(true);
          },
          onCancel: () => {
            showNotification(`Skipped ${file.name}`);
            resolve(false);
          },
        },
      }),
    );
  });
}

async function showPageSelectorForEdit(fileItem: FileItem): Promise<void> {
  if (!fileItem.buffer || !fileItem.totalPages) return;

  window.dispatchEvent(
    new CustomEvent("showPageSelector", {
      detail: {
        file: fileItem.file,
        buffer: fileItem.buffer,
        initialSelectedPages: fileItem.selectedPages || [],
        onConfirm: (selectedPages: number[]) => {
          fileItem.selectedPages = selectedPages;
          showNotification(
            `Updated to ${selectedPages.length} page(s) from ${fileItem.file.name}`,
          );
          updateFileList();

          // Update preview
          const fileBuffers = files
            .filter((f) => f.status === "success")
            .map((f) => ({
              name: f.file.name,
              buffer: f.buffer,
              selectedPages: f.selectedPages || [0],
            }));
          window.dispatchEvent(
            new CustomEvent("fileListUpdated", {
              detail: { files: fileBuffers },
            }),
          );
        },
        onCancel: () => {
          // Do nothing, keep current selection
        },
      },
    }),
  );
}

function setupFileList() {
  const fileList = document.getElementById("file-list");
  if (!fileList) return;

  // Handle file removal
  fileList.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.matches("button[data-id]")) {
      const id = target.dataset.id;
      const action = target.dataset.action;

      if (action === "edit-pages") {
        // Show page selector for re-selection
        const fileItem = files.find((f) => f.id === id);
        if (fileItem && fileItem.buffer) {
          showPageSelectorForEdit(fileItem);
        }
      } else {
        // Remove file
        files = files.filter((f) => f.id !== id);
        updateFileList();

        // Update preview with new file list (only successful files)
        const fileBuffers = files
          .filter((f) => f.status === "success")
          .map((f) => ({
            name: f.file.name,
            buffer: f.buffer,
            selectedPages: f.selectedPages || [0],
          }));
        window.dispatchEvent(
          new CustomEvent("fileListUpdated", {
            detail: { files: fileBuffers },
          }),
        );
      }
    }
  });

  // Enable drag and drop reordering
  fileList.addEventListener("dragstart", (e) => {
    const item = e.target as HTMLElement;
    if (item.matches(".file-item")) {
      item.classList.add("dragging");
    }
  });

  fileList.addEventListener("dragend", (e) => {
    const item = e.target as HTMLElement;
    if (item.matches(".file-item")) {
      item.classList.remove("dragging");

      // Reorder files array based on DOM order
      const newFiles: FileItem[] = [];
      fileList.querySelectorAll(".file-item").forEach((el) => {
        const id = el.getAttribute("data-id");
        const file = files.find((f) => f.id === id);
        if (file) newFiles.push(file);
      });
      files = newFiles;

      // Update preview with new order (only successful files)
      const fileBuffers = files
        .filter((f) => f.status === "success")
        .map((f) => ({
          name: f.file.name,
          buffer: f.buffer,
        }));
      window.dispatchEvent(
        new CustomEvent("fileListUpdated", {
          detail: { files: fileBuffers },
        }),
      );
    }
  });

  fileList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const draggingElement = fileList.querySelector(".dragging");
    if (!draggingElement) return;

    const siblings = [
      ...fileList.querySelectorAll(".file-item:not(.dragging)"),
    ];
    const nextSibling = siblings.find((sibling) => {
      const rect = sibling.getBoundingClientRect();
      return e.clientY <= rect.top + rect.height / 2;
    });

    fileList.insertBefore(draggingElement, nextSibling);
  });
}

function updateFileList() {
  const fileList = document.getElementById("file-list");
  if (!fileList) return;

  fileList.innerHTML = "";

  if (files.length === 0) {
    fileList.innerHTML = `
      <div class="text-center text-gray-400 py-8">
        <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p class="text-sm">No files uploaded yet</p>
      </div>
    `;
    return;
  }

  files.forEach((file, index) => {
    const fileItem = document.createElement("div");
    const isError = file.status === "error";
    fileItem.className = `file-item flex items-center justify-between gap-3 ${isError ? "border-red-200 bg-red-50" : ""}`;
    fileItem.draggable = !isError;
    fileItem.dataset.id = file.id;

    const statusIndicator = isError
      ? `<div class="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center" title="${file.errorMessage || "Failed to load"}">
          <svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>`
      : `<div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>`;

    // Page info for multipage documents
    const pageInfo =
      !isError && file.totalPages && file.totalPages > 1
        ? `<span class="text-xs text-gray-500">(${file.selectedPages?.length || 0} of ${file.totalPages} pages)</span>`
        : "";

    // Edit pages button for multipage documents
    const editPagesButton =
      !isError && file.totalPages && file.totalPages > 1
        ? `<button 
            class="flex-shrink-0 px-2 py-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
            data-id="${file.id}"
            data-action="edit-pages"
            title="Select different pages"
            aria-label="Edit page selection for ${file.file.name}"
          >
            Edit Pages
          </button>`
        : "";

    fileItem.innerHTML = `
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            ${!isError ? `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">${index + 1}</span>` : ""}
            <span class="truncate ${isError ? "text-red-700" : "text-gray-700"} font-medium text-sm">${file.file.name}</span>
            ${isError ? `<span class="text-xs text-red-600 font-medium">(Failed)</span>` : ""}
            ${pageInfo}
          </div>
          ${isError && file.errorMessage ? `<p class="text-xs text-red-600 mt-1 truncate">${file.errorMessage}</p>` : ""}
        </div>
        ${statusIndicator}
        ${editPagesButton}
        ${
          !isError
            ? `<svg class="w-5 h-5 text-gray-400 cursor-move flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
        </svg>`
            : ""
        }
      </div>
      <button 
        class="flex-shrink-0 w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors flex items-center justify-center font-bold"
        data-id="${file.id}"
        title="Remove file"
      >
        ✕
      </button>
    `;

    fileList.appendChild(fileItem);
  });
}

async function updatePreview() {
  const preview = document.getElementById("preview");
  if (!preview) return;

  // Update the preview
}

function showNotification(message: string) {
  const notifications = document.getElementById("notifications");
  if (!notifications) return;

  const notification = document.createElement("div");
  notification.className =
    "bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-3 rounded-xl mb-3 shadow-lg transition-all duration-300 flex items-center gap-3 animate-slide-up";
  notification.innerHTML = `
    <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
    </svg>
    <span class="font-medium">${message}</span>
  `;

  notifications.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100px)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function showErrorNotification(message: string) {
  const notifications = document.getElementById("notifications");
  if (!notifications) return;

  const notification = document.createElement("div");
  notification.className =
    "bg-gradient-to-r from-red-500 to-rose-500 text-white px-5 py-3 rounded-xl mb-3 shadow-lg transition-all duration-300 flex items-center gap-3 animate-slide-up";
  notification.innerHTML = `
    <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
    </svg>
    <span class="font-medium">${message}</span>
  `;

  notifications.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100px)";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function showModal(
  title: string,
  message: string,
  type: "info" | "error" | "warning" | "success" = "info",
) {
  window.dispatchEvent(
    new CustomEvent("showModal", {
      detail: { title, message, type },
    }),
  );
}

function showModalWithRetry(
  title: string,
  message: string,
  failedFiles: string[],
) {
  window.dispatchEvent(
    new CustomEvent("showModal", {
      detail: {
        title,
        message,
        type: "error",
        failedFiles,
        actions: [
          {
            label: "Try Different Files",
            onClick: () => {
              const fileInput = document.getElementById(
                "file-input",
              ) as HTMLInputElement;
              if (fileInput) {
                fileInput.click();
              }
            },
            primary: true,
          },
          {
            label: "Close",
            onClick: () => {},
            primary: false,
          },
        ],
      },
    }),
  );
}
