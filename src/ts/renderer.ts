import { ipcRenderer } from "electron"
const iframe = document.getElementById("iframe") as HTMLIFrameElement | null
iframe!.onload = (e: Event) => {
	console.log(e.type)
}
document.getElementById("close")!.onclick = (e: Event) => {
	console.log("close")
	ipcRenderer.send("close")
}
