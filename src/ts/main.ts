import { BrowserWindow, app, App, ipcMain, IpcMainEvent, } from 'electron'

class MainApp {
    private mainWindow: BrowserWindow | null = null;
    private app: App;
    private entry: string = `html/index.html`

    constructor(app: App) {
        this.app = app;
        this.app.on('window-all-closed', this.onWindowAllClosed.bind(this))
        this.app.on('ready', this.onReady.bind(this));
        this.app.on('activate', this.onActivated.bind(this));
    }

    private onWindowAllClosed() {
        this.app.quit();
    }

    private create() {
        this.mainWindow = new BrowserWindow({
            width: 1136, 
            height: 670, 
            frame: false, 
            resizable: false, 
            useContentSize: true, 
            icon: 'assets/icon.ico',
            webPreferences: {
                nodeIntegration: true
            }
        });

        this.mainWindow.loadFile(this.entry);
        //this.mainWindow.setMenu(null);
        //this.mainWindow.webContents.openDevTools();
        ipcMain.on("close", (e: IpcMainEvent) => {
            this.mainWindow!.close();
        });
        ipcMain.on("maximize", (e: IpcMainEvent, maximize: boolean) => {
            if (!maximize) {
                this.mainWindow!.maximize();
            } else {
                this.mainWindow!.unmaximize();
            }
        })
        ipcMain.on("minimize", (e: IpcMainEvent) => {
            this.mainWindow!.minimize()
        })

        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
    }

    private onReady() {
        this.create();
    }

    private onActivated() {
        if (this.mainWindow === null) {
            this.create();
        }
    }
}

const mApp: MainApp = new MainApp(app)