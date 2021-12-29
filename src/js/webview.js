const { shell } = require('electron');
const { ipcRenderer } = window.require('electron');
const path = require('path');

class CreateWebview {
	constructor(opts) {
		this.owner = opts.owner;
		this.applicationSettings = opts.owner.applicationSettings;
		this.icon = opts.icon;
		this.name = opts.name;
		this.url = opts.url;
		this.userAgent = opts.userAgent;
		this.viewContainer = opts.viewContainer;
		this.zoom = 1;
		this.hasFocus = null;
		this.element = null;

		this.webpreferences = {
			spellcheck: true,
		};

		this.createUI();
	}

	/* 	this.element.dataset.hostname = new URL(
    app.url.includes("http") ? app.url : `http://${app.url}`
  ).hostname.toLowerCase(); */

	getCombinedTagAttributes(attributeObj) {
		let str = '';
		let keys = Object.keys(attributeObj);
		let values = Object.values(attributeObj);
		keys.forEach((key, index) => {
			str += `${key}=${values[index]}`;
			if (index < keys.length - 1) str += ', ';
		});
		console.log('attributes: ', str);
		return str;
	}

	createUI() {
		this.element = document.createElement('webview');
		this.element.setAttribute(
			'webpreferences',
			this.getCombinedTagAttributes(this.webpreferences)
		);
		this.element.setAttribute('allowpopups', true);
		this.element.setAttribute('preload', `./preload.js`);
		this.element.classList.add('webview', 'bg-light');
		this.element.addEventListener('new-window', (evt) => {
			evt.preventDefault();
			const protocol = require('url').parse(evt.url).protocol;
			if (protocol === 'http:' || protocol === 'https:') {
				shell.openExternal(evt.url);
			}
		});
		if (this.userAgent) {
			this.element.setAttribute('useragent', this.userAgent);
		} else {
			if (
				this.applicationSettings &&
				this.applicationSettings.setWebviewAttributes
			) {
				this.applicationSettings.setWebviewAttributes(this.element);
			}
		}

		let prependToUrl = this.url.includes('https://')
			? ''
			: this.url.includes('http://')
			? ''
			: 'http://';
		this.element.src = prependToUrl + this.url;

		if (this.applicationSettings && this.applicationSettings.getExecuteJS) {
			this.element.addEventListener('dom-ready', (evt) => {
				this.element.executeJavaScript(
					this.applicationSettings.getExecuteJS(),
					false
				);
			});
		}

		this.element.addEventListener('ipc-message', (evt) => {
			//console.log('ipc-message: ', evt);

			if (evt.channel === 'focus-change') {
				this.hasFocus = evt.args[0];
				if (this.hasFocus) {
					this.owner.elements.badge.classList.add('d-none');
					this.owner.elements.badge.classList.remove('bg-danger');
					this.owner.elements.badge.innerHTML = '';
				}
			} else if (evt.channel === 'new-message') {
				if (!this.hasFocus) {
					this.owner.elements.badge.classList.add('d-flex', 'bg-danger');
					this.owner.elements.badge.innerHTML = '1';
				}
			} else if (evt.channel === 'hangouts-status-update') {
				let data = null;
				if (evt.args && evt.args.length) {
					data = evt.args[0];
				}
				if (!data) return;

				if (data.unreadMessages > 0) {
					this.owner.elements.badge.classList.add('d-flex', 'bg-danger');
					this.owner.elements.badge.innerHTML = data.unreadMessages;
				} else {
					this.owner.elements.badge.classList.add('d-none');
					this.owner.elements.badge.classList.remove('bg-danger');
					this.owner.elements.badge.innerHTML = '';
				}
			}
		});

		this.viewContainer.appendChild(this.element);
	}

	reload() {
		this.element.reload();
	}

	openDevTools() {
		this.element.openDevTools();
	}

	zoomIn() {
		this.element.setZoomLevel(this.element.getZoomLevel() + 0.2);
	}

	zoomOut() {
		this.element.setZoomLevel(this.element.getZoomLevel() - 0.2);
	}

	zoomDefault() {
		this.element.setZoomLevel(0);
	}

	/* setUserAgent(url) {
		let _url = url.toLowerCase();

		if (_url.includes('google.com')) {
			this.element.setAttribute('autosize', 'on');
			this.element.setAttribute('useragent', 'Chrome');
			this.element.setAttribute('nodeintegration', 'on');
			this.element.setAttribute('disablewebsecurity', 'on');
		}

		if (_url.includes('slack.com')) {
			const ua =
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36';
			this.element.setAttribute('useragent', ua);
		}

		if (_url.includes('messenger.com')) {
		}

		if (_url.includes('skype.com')) {
			const ua =
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18362';
			this.element.setAttribute('useragent', ua);
		}

		return null;
	} */

	toggle(force = 0) {
		if (force === -1) {
			this.element.classList.remove('visible');
		} else if (force === 1) {
			this.element.classList.add('visible');
		} else {
			this.element.classList.toggle('visible');
		}
	}
}

module.exports = CreateWebview;
