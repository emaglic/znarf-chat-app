const {
	app,
	BrowserWindow,
	shell,
	webContents,
	ipcMain,
	Menu,
} = require('electron');

const storage = require('electron-json-storage');
const menuTemplate = require('./menu');
const path = require('path');

let version = app.getVersion();
console.log('version: ', version);

//require("electron-reload")(__dirname);

// Require electron-reload package.
//require("electron-reload")(process.cwd());

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

const {
	FETCH_TEXT_FROM_STORAGE,
	SAVE_TEXT_IN_STORAGE,
	HANDLE_FETCH_TEXT_FROM_STORAGE,
	HANDLE_SAVE_TEXT_IN_STORAGE,
} = require('./util/constants');

ipcMain.on('notification-shim', (evt, msg) => {
	console.log(`Title: ${msg.title}, Body: ${msg.options.body}`);
});

// Get Saved Text From Storage
// ===================================================================
ipcMain.on(FETCH_TEXT_FROM_STORAGE, (evt, data) => {
	console.log('FETCH TEXT FROM STORAGE!!!!!!');
	storage.get('application', (error, data) => {
		let savedText = data.savedText;
		if (!savedText) savedText = '';

		win.webContents.send(HANDLE_FETCH_TEXT_FROM_STORAGE, {
			success: true,
			message: 'Text Returned',
			json: data,
		});
	});
});
// ===================================================================

// Put Text From Storage
// ===================================================================
ipcMain.on(SAVE_TEXT_IN_STORAGE, (evt, data) => {
	storage.clear(function (error) {
		if (error) throw error;
		storage.set('application', data, (error) => {
			win.webContents.send(HANDLE_SAVE_TEXT_IN_STORAGE, {
				success: true,
				message: 'Saved',
				text: data,
			});
		});
	});
});
// ===================================================================

// Listen for New Application Event from Renderer
// ===================================================================
ipcMain.on('addNewApplication', (event, arg) => {
	//console.log('You added new app url: ', arg);
});
// ===================================================================

// Create New Window
// ===================================================================
function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({
		width: 1280,
		height: 720,
		webPreferences: {
			webviewTag: true,
			devTools: true,
			nodeIntegration: true,
			spellcheck: true,
			preload: path.join(__dirname, 'notifications-shim.js'),
		},
	});

	win.webContents.once('dom-ready', () => {
		win.webContents.send('get-app-version', version.toString());
	});

	//win.webContents.openDevTools();

	/* win.webContents.on("new-window", (evt, url) => {
    console.log("hello!");
    evt.preventDefault();
    shell.openExternal(url);
  }); */

	// Hides the window's menu bar. We don't need it.
	win.setMenu(null);

	win.loadFile('index.html');

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null;
	});

	const menu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menu);
}
// ===================================================================

// Opens links with target="_blank" in new default browser window.
// Listen for web contents being created
app.on('web-contents-created', (e, contents) => {
	// Check for a webview
	if (contents.getType() == 'webview') {
		// Listen for any new window events
		contents.on('new-window', (e, url) => {
			e.preventDefault();

			// Sends external URL from Main process back to Renderer process, so it can open URL in the same webview window.
			/* explanation: When Electron detects the webview is trying to open a link in a new window, it sends the URL back to an event listener
		   in the renderer process which forces it to open in the same webview browser. 
		   Essentially this bypasses window.open() and <a href target="_blank" by forcing the URL to open in the same window.
		*/
			win.webContents.send('openExternalUrl', url);

			// If you want to instead load external links in the OS's default browser, comment out the win.webContents line above and uncomment the lines below.
			//  e.preventDefault()
			//shell.openExternal(url)
		});
	}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// ====================================================================================

// Quit when all windows are closed.
app.on('windows-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// ====================================================================================

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow();
	}
});
