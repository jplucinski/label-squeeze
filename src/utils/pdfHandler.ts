import { PDFDocument } from "pdf-lib";

interface FileItem {
  id: string;
  file: File;
  preview?: string;
  buffer: ArrayBuffer;
}

let files: FileItem[] = [];

export async function initPdfHandler() {
  // Set up event listeners and initialize the handler
  setupFileUpload();
  setupFileList();
  updatePreview();
}

function setupFileUpload() {
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");

  if (!dropZone || !fileInput) return;

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("border-blue-500");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("border-blue-500");
  });

  dropZone.addEventListener("drop", async (e) => {
    e.preventDefault();
    dropZone.classList.remove("border-blue-500");

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
  let hasMultiPagePdf = false;

  for (const file of fileList) {
    if (file.type === "application/pdf") {
      const id = crypto.randomUUID();
      const buffer = await file.arrayBuffer();

      // Check if PDF has multiple pages
      try {
        const pdfDoc = await PDFDocument.load(buffer);
        const pageCount = pdfDoc.getPageCount();

        if (pageCount > 1) {
          hasMultiPagePdf = true;
        }
      } catch (error) {
        console.error("Error checking PDF page count:", error);
      }

      files.push({ id, file, buffer });
      showNotification("File added successfully");
    }
  }

  // Show modal if any PDF has multiple pages
  if (hasMultiPagePdf) {
    showModal(
      "Multi-page PDF Detected",
      "One or more uploaded PDFs contain multiple pages. Please note that only the first page of each document will be used for merging.",
    );
  }

  updateFileList();

  // Dispatch event with file buffers for preview
  const fileBuffers = files.map((f) => ({
    name: f.file.name,
    buffer: f.buffer,
  }));
  window.dispatchEvent(
    new CustomEvent("fileListUpdated", {
      detail: { files: fileBuffers },
    }),
  );

  updatePreview();
}

function setupFileList() {
  const fileList = document.getElementById("file-list");
  if (!fileList) return;

  // Handle file removal
  fileList.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.matches("button[data-id]")) {
      const id = target.dataset.id;
      files = files.filter((f) => f.id !== id);
      updateFileList();

      // Update preview with new file list
      const fileBuffers = files.map((f) => ({
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

      // Update preview with new order
      const fileBuffers = files.map((f) => ({
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

  files.forEach((file, index) => {
    const fileItem = document.createElement("div");
    fileItem.className =
      "file-item flex items-center justify-between p-2 bg-white rounded border border-gray-200";
    fileItem.draggable = true;
    fileItem.dataset.id = file.id;

    fileItem.innerHTML = `
      <span class="flex items-center gap-2">
        <span class="text-gray-500">${index + 1}.</span>
        <span class="truncate">${file.file.name}</span>
      </span>
      <button 
        class="text-red-500 hover:text-red-700"
        data-id="${file.id}"
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
    "bg-green-500 text-white px-4 py-2 rounded-lg mb-2 transition-opacity duration-300";
  notification.textContent = message;

  notifications.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function showModal(title: string, message: string) {
  window.dispatchEvent(
    new CustomEvent("showModal", {
      detail: { title, message },
    }),
  );
}
