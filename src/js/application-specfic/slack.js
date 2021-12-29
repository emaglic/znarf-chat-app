const ApplicationSettings = require('./index');

class SlackSettings extends ApplicationSettings {
	constructor(opts) {
		super(opts);
	}

	getExecuteJS() {
		return `
		var hasFocus = null;
		var Notification = function(title, opts) {
			ipcRenderer.sendToHost('new-message', null);
		}
		window.Notification = Notification;
		setInterval( () => {
			let newFocus = document.hasFocus();
			if(hasFocus !== newFocus) {
				ipcRenderer.sendToHost('focus-change', newFocus)
				hasFocus = newFocus;
			}
		}, this.refreshTime);
  `;
	}

	setWebviewAttributes(webview) {
		const useragent =
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36';
		webview.setAttribute('useragent', useragent);
	}
}

module.exports = SlackSettings;
