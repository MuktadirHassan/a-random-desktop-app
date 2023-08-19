import * as path from "path";
import { format } from "url";
import { app, BrowserWindow } from "electron";
import { is } from "electron-util";
import windowStateKeeper from "electron-window-state";

let win: BrowserWindow | null = null;

async function createWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 820,
  });

  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,

    minHeight: 600,
    minWidth: 650,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindowState.manage(win);

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
