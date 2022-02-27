const {app, BrowserWindow} = require('electron');
const spawn = require('./app/lib/spawn_server');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 400,
  });
  win.maximize();

  win.loadURL(`file://${__dirname}/index.html`);

  const webServer = spawn();

  win.on('closed', () => {
    win = null;
    webServer.kill();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit(); }
});

app.on('activate', () => {
  if (win === null) { createWindow(); }
});
