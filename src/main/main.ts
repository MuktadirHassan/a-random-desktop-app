import * as path from "path";
import { format } from "url";
import { app, BrowserWindow, dialog, ipcMain, Menu } from "electron";
import { is } from "electron-util";

let win: BrowserWindow | null = null;

async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 820,
    minHeight: 600,
    minWidth: 650,
    // autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => win.webContents.send("update-counter", 1),
          label: "Increment",
        },
        {
          click: () => win.webContents.send("update-counter", -1),
          label: "Decrement",
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);

  const isDev = is.development;

  if (isDev) {
    // this is the default port electron-esbuild is using
    win.loadURL("http://localhost:9080");
  } else {
    win.loadURL(
      format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
      })
    );
  }

  win.on("closed", () => {
    win = null;
  });

  win.webContents.on("devtools-opened", () => {
    win!.focus();
  });

  win.on("ready-to-show", () => {
    win!.show();
    win!.focus();

    if (isDev) {
      win!.webContents.openDevTools({ mode: "bottom" });
    }
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (!is.macos) {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null && app.isReady()) {
    createWindow();
  }
});

ipcMain.on("message", (event, arg) => {
  console.log(arg); // prints "ping"
});

ipcMain.on("set-title", (event, title) => {
  win.setTitle(title);
});

ipcMain.handle("dialog:openFile", handleFileOpen);

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [
      { name: "Markdown", extensions: ["md", "markdown", "txt"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (!canceled) {
    return filePaths[0];
  }
}
