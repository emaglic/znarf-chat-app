const ApplicationSettings = require('./index');

class MessengerSettings extends ApplicationSettings {
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
}

module.exports = MessengerSettings;
