const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path  = require('path')
const url = require("url")
let win;
const env = process.env.NODE_ENV || 'development'; 

// If development environment 
if (env === 'development') { 
	try { 
		require('electron-reloader')(module, { 
			debug: true, 
			watchRenderer: true
		}); 
	} catch (_) { console.log('Error'); }	 
} 

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon:__dirname+'/favicon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })
  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})