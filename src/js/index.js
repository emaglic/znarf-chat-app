import '../scss/index.scss';
const Main = require('./main');
const navContainer = document.querySelector('.nav-container');
const viewContainer = document.querySelector('.view-container');

let appVersion = null;
let main;
const init = () => {
	viewContainer.style.width =
		window.innerWidth - navContainer.offsetWidth + 'px';
	main = new Main();
	//navInit();
	//new Notification("Hello!", { content: "Notification world!" }); // Send push notification
};

const resize = () => {
	viewContainer.style.width =
		window.innerWidth - navContainer.offsetWidth + 'px';
};

/* 

This is the renderer process. 
This is how you talk to the main process

// Get message from main process....
ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})

// Send message to main process...
ipcRenderer.send('asynchronous-message', 'ping')

*/

window.onresize = resize;
window.onload = init;
