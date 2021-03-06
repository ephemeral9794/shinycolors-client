import { ipcRenderer, remote, Rectangle } from "electron"

const iframe = document.getElementById("iframe") as HTMLIFrameElement | null
/*iframe!.onload = (e: Event) => {
	console.log(e.type)
}*/

// 終了
document.getElementById("close")!.onclick = (e: Event) => {
	ipcRenderer.invoke("close")
}
// 最小化
document.getElementById("minimize")!.onclick = (e: Event) => {
	ipcRenderer.invoke("minimize")
}
//　最大化
let isMaximized = false;
const maximize = document.getElementById("maximize")
const images = ["../assets/maximize.svg", "../assets/maximize_return.svg"]
let rect = { width: 1136, height: 640 }
maximize!.onclick = (e: Event) => {
	isMaximized = !isMaximized
	let window = remote.getCurrentWindow()
	//console.log(isMaximized)
	ipcRenderer.invoke("maximize", isMaximized)
	const img = maximize!.getElementsByTagName("img")
	if (isMaximized) {
		// 最大化
		img!.item(0)!.src = images[1]
		const bounds = window.getBounds()
		rect.width = +iframe!.width
		rect.height = +iframe!.height
		iframe!.width = bounds.width.toString()
		iframe!.height = (bounds.height - 30).toString()
		//console.log("%s, %s", iframe!.width, iframe!.height)
	} else {
		// 戻す
		img!.item(0)!.src = images[0]
		iframe!.width = rect.width.toString()
		iframe!.height = rect.height.toString()
		//console.log("%s, %s", iframe!.width, iframe!.height)
	}
}
// リロード
const reload = document.getElementById("reload")
reload!.onclick = (e: Event) => {
	ipcRenderer.invoke("reload")
}
// スクリーンショット
const titlebar = document.getElementById("titlebar")
document.getElementById("screenshot")!.onclick = (e: Event) => {
	var r: Rectangle = { width: +iframe!.width, height: +iframe!.height, x: 0, y: titlebar!.offsetHeight } 
	ipcRenderer.invoke("screenshot", r)
	iframe!.focus()
}
// スクショフォルダ
document.getElementById("picture")!.onclick = (e: Event) => {
	ipcRenderer.invoke("picture")
}