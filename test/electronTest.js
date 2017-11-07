var electron = require("electron");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on("ready", function () {

    mainWindow = new BrowserWindow({
        //useContentSize: true,
        title: "JSCommand Test",
        autoHideMenuBar: true,
        acceptFirstMouse: true
    });

    mainWindow.webContents.openDevTools();
    mainWindow.loadURL("file://" + __dirname + "/index.html");
});