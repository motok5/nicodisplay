/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserWindow, app, Menu, Tray, nativeImage } from 'electron';
const mainURL = `file://${__dirname}/../assets/index.html`;
const settingsURL = `file://${__dirname}/../assets/settings.html`;

let mainWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;
let tray = null;

const createWindow = (): void => {
  if (mainWindow === null) {
    mainWindow = new BrowserWindow({
      width: 720,
      height: 200,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      resizable: true,
      hasShadow: false,
      skipTaskbar: true,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    mainWindow.loadURL(mainURL);

    // // for debug
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
      settingsWindow = null;
      mainWindow = null;
    });
  }

  if (settingsWindow === null) {
    settingsWindow = new BrowserWindow({
      width: 720,
      height: 500,
      show: false,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    settingsWindow.setMenu(null);
    settingsWindow.loadURL(settingsURL);

    // // for debug
    // settingsWindow.webContents.openDevTools();

    settingsWindow.on('closed', () => {
      settingsWindow = null;
    });
  }
};

app.on('ready', createWindow);
app.whenReady().then(() => {
  tray = new Tray(
    nativeImage.createFromPath(`${__dirname}/../assets/icon.png`)
  );
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: function () {
        if (mainWindow === null) {
          createWindow();
        }
        mainWindow?.show();
        mainWindow?.focus();
      },
    },
    {
      label: 'Hide',
      click: function () {
        mainWindow?.hide();
      },
    },
    {
      label: 'Settings',
      click: function () {
        if (settingsWindow === null) {
          createWindow();
        }
        settingsWindow?.show();
        settingsWindow?.focus();
      },
    },
    {
      label: 'Close',
      click: function () {
        settingsWindow?.close();
        mainWindow?.close();
      },
    },
  ]);
  tray.setToolTip(app.getName());
  tray.setContextMenu(contextMenu);
});
app.on('window-all-closed', () => {
  app.quit();
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
