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
  for (const file of fileList) {
    if (file.type === "application/pdf") {
      const id = crypto.randomUUID();
      const buffer = await file.arrayBuffer();
      files.push({ id, file, buffer });
      showNotification("File added successfully");
    }
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
    fileItem.className = "file-item flex items-center justify-between gap-3";
    fileItem.draggable = true;
    fileItem.dataset.id = file.id;

    fileItem.innerHTML = `
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">${index + 1}</span>
            <span class="truncate text-gray-700 font-medium text-sm">${file.file.name}</span>
          </div>
        </div>
        <svg class="w-5 h-5 text-gray-400 cursor-move flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
        </svg>
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
