class ApplicationSettings {
	constructor(opts) {
		console.log('opts: ', opts);
		this.owner = opts.owner;
		console.log(this.owner);
		this.refreshTime = opts.refreshTime || 5000;
		this.webview = this.owner.webview || null;
	}

	getExecuteJS() {
		return null;
	}
}

module.exports = ApplicationSettings;
