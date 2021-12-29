const CreateWebview = require('./webview');
const { ipcRenderer } = window.require('electron');
const {
	HangoutsSettings,
	SlackSettings,
	SkypeSettings,
	MessengerSettings,
} = require('./application-specfic/application-classes');

class NavItem {
	constructor(opts) {
		console.log('opts: ', opts);
		this.url = opts.url;
		this.webview = null;
		this.owner = opts.owner;
		this.index = opts.index;
		this.userAgent = opts.userAgent || null;
		this.index = this.owner.navItems.length;
		this.name = opts.name;
		this.useDefaultIcon =
			opts.icon === './public/images/default.svg'
				? true
				: opts.icon === null
				? true
				: false;
		this.iconSrc = opts.icon ? opts.icon : './public/images/default.svg';
		/* this.mouseOverTimeout = null;
		this.mouseOverTime = 2000; */
		this.elements = {
			navContainer: this.owner.elements.navContainer,
			navContainerInner: this.owner.elements.navContainerInner,
		};
		this.contextMenuTemplate = this.getContextTemplate();
		//console.log('this.owner: ', this.owner);
		this.owner.navItems.push(this);

		this.applicationSettings = this.detectApplication(this.url);

		this.webview = new CreateWebview({
			owner: this,
			icon: this.iconSrc,
			name: this.name,
			url: this.url,
			userAgent: this.userAgent,
			viewContainer: this.owner.elements.viewContainer,
		});

		this.createUI();
	}

	get navItems() {
		return this.owner.navItems;
	}

	set navItems(items) {
		this.owner.navItems = items;
	}

	detectApplication(url) {
		if (url.includes('google.com')) {
			return new HangoutsSettings({ owner: this });
		}
		if (url.includes('slack.com')) {
			return new SlackSettings({ owner: this });
		}
		if (url.includes('skype.com')) {
			return new SkypeSettings({ owner: this });
		}
		if (url.includes('messenger.com')) {
			return new MessengerSettings({ owner: this });
		}
		return null;
	}

	getContextTemplate() {
		return [
			{ role: 'header', label: this.name },
			{ role: 'divider' },
			{ role: 'Reload App' },
			{ role: 'Zoom +' },
			{ role: 'Zoom -' },
			{ role: 'Zoom Default' },
			{ role: 'Move Up -' },
			{ role: 'Move Down +' },
			{ role: 'Open Developer Tools' },
			{ role: 'Delete App' },
		];
	}

	createUI() {
		let main = document.createElement('div');
		main.classList.add('nav-button');
		//main.dataset.index = this.index;
		main.innerHTML = `
						<img src='${this.iconSrc}' class='nav-icon' />
						<div class='nav-badge justify-content-center align-items-center'></div>
				`;

		let badge = main.querySelector('.nav-badge');

		if (this.useDefaultIcon) {
			let iconInitial = document.createElement('div');
			iconInitial.classList.add('service-icon-name');
			let n =
				this.name[0].toUpperCase() +
				this.name.substr(1, this.name.length > 8 ? 8 : this.name.length - 1);
			iconInitial.innerHTML = `${n}`;
			main.appendChild(iconInitial);
		}

		//console.log('nav-item this.elements: ', this.elements)
		/* this.elements.navContainerInner.insertBefore(
			main,
			this.elements.navContainerInner.childNodes[
				this.elements.navContainerInner.childElementCount - 1
			]
		);
 */
		this.elements.navContainerInner.appendChild(main);

		main.oncontextmenu = (evt) => {
			evt.preventDefault();
			//console.log('nav-item evt: ', evt);
			this.owner.createContextMenu({
				owner: this,
				position: { x: evt.offsetX, y: evt.pageY },
			});
		};

		main.onclick = (evt) => {
			this.owner.toggleNavItem(this.index);
		};

		this.elements = {
			...this.elements,
			main,
			badge,
		};
	}

	deleteApp() {
		this.elements.main.parentNode.removeChild(this.elements.main);
		if (this.webview && this.webview.element)
			this.webview.element.parentNode.removeChild(this.webview.element);
		this.navItems = this.navItems.filter((x) => x.index !== this.index);
		this.owner.saveToStorage();
	}
}

module.exports = NavItem;
