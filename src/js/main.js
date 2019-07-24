const { BrowserWindow, app } = require('electron')

let window = null;
const mainFile = "./src/html/index.html"

app.on('ready', () => {
	window = new BrowserWindow({
		width: 1136, 
		height: 670, 
		resizable: true, 
		useContentSize: true, 
		frame: false, 
		webPreferences: {
			webviewTag: true
		}
	});

	window.loadFile(mainFile);
	window.setMenu(null);
	/*window.webContents.on('did-finish-load', () => {
		window.webContents.send('iframe', "https://shinycolors.enza.fun/");
	})*/
	window.webContents.openDevTools()

	window.on('closed', () => {
		window = null;
	});
})

app.on('window-all-closed', () => {
	app.quit()
});