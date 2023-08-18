const { contextBridge, ipcRenderer } = require("electron");

const api = {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  sendMessage: (msg: string) => ipcRenderer.send("message", msg),
  setTitle: (title: string) => ipcRenderer.send("set-title", title),
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  onUpdateCounter: (callback) => ipcRenderer.on("update-counter", callback),
};

contextBridge.exposeInMainWorld("api", api);

export type Api = typeof api;
