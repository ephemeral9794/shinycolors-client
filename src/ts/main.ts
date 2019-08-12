import { BrowserWindow, app, App, ipcMain, IpcMainEvent, Rectangle, NativeImage, shell, } from 'electron'
import { writeFileSync, mkdirSync, exists, existsSync } from 'fs'
import { join } from 'path'

class MainApp {
    private mainWindow: BrowserWindow | null = null;
    private app: App;
    private entry: string = `html/index.html`
    private screenshot: string;

    constructor(app: App) {
        this.app = app;
        this.app.on('window-all-closed', this.onWindowAllClosed.bind(this))
        this.app.on('ready', this.onReady.bind(this));
        this.app.on('activate', this.onActivated.bind(this));
        this.screenshot = join(this.app.getAppPath(), 'Screenshots')
    }

    private onWindowAllClosed() {
        this.app.quit();
    }

    private create() {
        this.mainWindow = new BrowserWindow({
            width: 1136, 
            height: 672, 
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

        if (!existsSync(this.screenshot)) {
            mkdirSync(this.screenshot)
        }

        ipcMain.on("picture", (e: IpcMainEvent) => {
            shell.showItemInFolder(join(this.screenshot, "/*"))
        })
        ipcMain.on("screenshot", (e: IpcMainEvent, r: Rectangle) => {
            this.mainWindow!.webContents.capturePage(r)
            .then((image: NativeImage) => {
                const now = new Date()
                const format = 'Screenshot_YYYYMMDD-hhmmss.png'
                const file = join(this.screenshot, DateToString(now, format))
                //console.log(r)
                //console.log(file)
                writeFileSync(file, image.toPNG())
            })
        })
        ipcMain.on("reload", (e: IpcMainEvent) => {
            this.mainWindow!.reload()
        })
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

function DateToString(now: Date, format: string) {
    format = format.replace(/YYYY/g, '' + now.getFullYear());
    format = format.replace(/MM/g, ('0' + (now.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + now.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + now.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + now.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + now.getSeconds()).slice(-2));
    return format;
}

const mApp: MainApp = new MainApp(app)