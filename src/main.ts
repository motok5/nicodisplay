/* eslint-disable @typescript-eslint/no-explicit-any */
import electron, {
  BrowserWindow,
  app,
  Menu,
  Tray,
  nativeImage,
} from 'electron';
const mainURL = `file://${__dirname}/../assets/index.html`;
const settingsURL = `file://${__dirname}/../assets/settings.html`;

let mainWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;
let tray: any = null;

const createWindow = (): void => {
  if (mainWindow === null) {
    const { screen } = electron;
    const size = screen.getPrimaryDisplay().size;
    mainWindow = new BrowserWindow({
      x: 0,
      y: 0,
      width: size.width,
      height: Math.round(size.height*0.95),
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
    mainWindow.setIgnoreMouseEvents(true);

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
    nativeImage.createFromPath(`${__dirname}/../assets/show.png`)
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
        //ここに入れる
        tray.setImage(`${__dirname}/../assets/show.png`);
      },
    },
    {
      label: 'Hide',
      click: function () {
        mainWindow?.hide();
        //ここに入れる
        tray.setImage(`${__dirname}/../assets/hide.png`);
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
      label: 'Relaunch',
      click: function () {
        app.relaunch();
        app.exit();
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
