import { ipcRenderer, remote, Rectangle } from "electron"

const iframe = document.getElementById("iframe") as HTMLIFrameElement | null
/*iframe!.onload = (e: Event) => {
	console.log(e.type)
}*/

// 終了
document.getElementById("close")!.onclick = (e: Event) => {
	ipcRenderer.send("close")
}
// 最小化
document.getElementById("minimize")!.onclick = (e: Event) => {
	ipcRenderer.send("minimize")
}
//　最大化
let isMaximized = false;
const maximize = document.getElementById("maximize")
const images = ["../assets/maximize.svg", "../assets/maximize_return.svg"]
let rect = { width: 1136, height: 640 }
maximize!.onclick = (e: Event) => {
	let window = remote.getCurrentWindow()
	//console.log(isMaximized)
	ipcRenderer.send("maximize", isMaximized)
	const img = maximize!.getElementsByTagName("img")
	if (isMaximized) {
		// 戻す
		img!.item(0)!.src = images[0]
		iframe!.width = rect.width.toString()
		iframe!.height = rect.height.toString()
		//console.log("%s, %s", iframe!.width, iframe!.height)
	} else {
		// 最大化
		img!.item(0)!.src = images[1]
		const bounds = window.getBounds()
		rect.width = +iframe!.width
		rect.height = +iframe!.height
		iframe!.width = bounds.width.toString()
		iframe!.height = (bounds.height - 30).toString()
		//console.log("%s, %s", iframe!.width, iframe!.height)
	}
	isMaximized = !isMaximized
}
// リロード
const reload = document.getElementById("reload")
reload!.onclick = (e: Event) => {
	ipcRenderer.send("reload")
}
// スクリーンショット
const titlebar = document.getElementById("titlebar")
document.getElementById("screenshot")!.onclick = (e: Event) => {
	var r: Rectangle = { width: +iframe!.width, height: +iframe!.height, x: 0, y: titlebar!.offsetHeight } 
	ipcRenderer.send("screenshot", r)
}
// スクショフォルダ
document.getElementById("picture")!.onclick = (e: Event) => {
	ipcRenderer.send("picture")
}