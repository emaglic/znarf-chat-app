const { shell } = require('electron');

function CreateWebview(app, viewContainer) {
	this.app = app;
	this.viewContainer = viewContainer;

	this.element = document.createElement('webview');
	this.element.setAttribute('allowpopups', true);
	this.element.addEventListener('dom-ready', () => {
		this.element.openDevTools();
	});

	//this.element.setAttribute("webpreferences", "nativeWindowOpen=true");
	//this.element.setAttribute("allowpopups", true);

	this.element.dataset.hostname = new URL(
		app.url.includes('http') ? app.url : `http://${app.url}`
	).hostname.toLowerCase();

	this.element.addEventListener('new-window', (evt) => {
		evt.preventDefault();
		const protocol = require('url').parse(evt.url).protocol;
		if (protocol === 'http:' || protocol === 'https:') {
			shell.openExternal(evt.url);
		}
	});

	console.log('this.element: ', this.element);

	this.reload = () => {
		this.element.reload();
	};

	this.openDevTools = () => {
		this.element.openDevTools();
	};

	// Detects the best user agent for the given site.
	this.setUserAgent = (url) => {
		let _url = url.toLowerCase();

		if (_url.includes('google.com')) {
			//console.log("google.com");
			this.element.setAttribute('autosize', 'on');
			this.element.setAttribute('useragent', 'Chrome');
			this.element.setAttribute('nodeintegration', 'on');
			this.element.setAttribute('disablewebsecurity', 'on');
			/* this.element.setAttribute(
        "webpreferences",
        "allowRunningInsecureContent"
      ); */
		}
		if (_url.includes('slack.com')) {
			//console.log("slack.com");
			const ua =
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36';
			this.element.setAttribute('useragent', ua);
		}

		if (_url.includes('messenger.com')) {
			//console.log("messenger.com");
		}

		if (_url.includes('skype.com')) {
			const ua =
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18362';
			this.element.setAttribute('useragent', ua);
		}

		return null;
	};

	this.setUserAgent(app.url);

	this.element.classList.add('webview');
	this.element.classList.add('visible');
	//const src = app.url.replace("http://", "http://");

	let prependToUrl = app.url.includes('https://')
		? ''
		: app.url.includes('http://')
		? ''
		: 'http://';
	this.element.src = prependToUrl + app.url;
	viewContainer.appendChild(this.element);

	this.toggle = (force = 0) => {
		if (force === -1) {
			this.element.classList.remove('visible');
		} else if (force === 1) {
			this.element.classList.add('visible');
		} else {
			this.element.classList.toggle('visible');
		}
	};

	return this;
}

module.exports = CreateWebview;
