"use strict";
var electron = require("electron");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
app.on('ready', function () {
    const { screen } = electron;
    const size = screen.getPrimaryDisplay().size;
    var mainWindow = new BrowserWindow({
        // left: 0,
        // top: 0,
        // width: size.width,
        // height: size.height,
        // frame: false,
        // show: true,
        // transparent: true,
        // resizable: false,
        // 'always-on-top': true
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: true,
        hasShadow: false,
        skipTaskbar: true,
        show: false,
        webPreferences: {
          nodeIntegration: true,
        },
    });
    mainWindow.setIgnoreMouseEvents(true);
    // mainWindow.maximize();
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.showInactive();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});
