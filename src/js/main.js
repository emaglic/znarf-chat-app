const { ipcRenderer } = window.require('electron');
const NavItem = require('./nav-item');
const Prompt = require('./prompt');
const ContextMenu = require('./context-menu');
const importIcon = require('./helpers').importIcon;
const getFavicon = require('./helpers').getFavicon;
const {
	FETCH_TEXT_FROM_STORAGE,
	SAVE_TEXT_IN_STORAGE,
	HANDLE_FETCH_TEXT_FROM_STORAGE,
	HANDLE_SAVE_TEXT_IN_STORAGE,
} = require('../../util/constants');
const DefaultScreen = require('./default-screen');

class Main {
	constructor() {
		this.viewContainer = null;
		this.navContainer = null;
		this.navItems = [];
		this.addApp = null;
		this.prompt = null;
		this.appJSON = null;
		this.mouseTimer = null;
		this.appVersion = null;
		this.mouseHoverTime = 2000;
		//this.apps = [];
		this.contextMenu = null;
		this.defaultScreen = new DefaultScreen();
		this.elements = {
			body: document.querySelector('body'),
		};

		this.init();
	}

	// INIT
	// ==================================================================================================
	init() {
		//console.log('appsJSON: ', appsJSON);

		let navContainer = document.querySelector('.nav-container');
		let navContainerInner = document.querySelector('.nav-container-inner');
		let viewContainer = document.querySelector('.view-container');

		let addAppButton = document.createElement('div');
		addAppButton.classList.add('nav-button', 'add-app-button');
		addAppButton.innerHTML = `
      <img src='./public/images/add.svg' class='nav-icon' />
    `;

		addAppButton.onclick = () => {
			this.createPrompt();
		};

		navContainer.appendChild(addAppButton);

		this.elements = {
			...this.elements,
			navContainer,
			navContainerInner,
			viewContainer,
			addAppButton,
		};

		this.elements.body.onclick = (evt) => {
			evt.preventDefault();
			if (this.contextMenu) this.contextMenu.destroy();
		};

		this.elements.navContainer.onmouseleave = (evt) => {
			if (this.contextMenu) this.contextMenu.destroy();
		};

		ipcRenderer.on('get-app-version', (evt, version) => {
			this.appVersion = version;
			this.defaultScreen.appendAppVersion(this.appVersion);
		});

		ipcRenderer.on('openExternalUrl', this.onOpenExternalUrl.bind(this));
		ipcRenderer.on(
			HANDLE_FETCH_TEXT_FROM_STORAGE,
			this.onFetchTextFromStorage.bind(this)
		);
		ipcRenderer.on(
			HANDLE_SAVE_TEXT_IN_STORAGE,
			this.onSaveTextInStorage.bind(this)
		);
		ipcRenderer.send(FETCH_TEXT_FROM_STORAGE);
	}
	// ==================================================================================================

	createPrompt() {
		let prompt = document.querySelector('.addapp-prompt');
		if (prompt) return;
		new Prompt({ owner: this });
	}

	// ==================================================================================================
	onOpenExternalUrl(event, url) {}
	// ==================================================================================================

	// ==================================================================================================
	onFetchTextFromStorage(event, data) {
		let appsJSON = JSON.parse(data.json);
		let appsArr = appsJSON.apps;
		//console.log("appJSON: ", appsJSON);
		//console.log("appsArr: ", appsArr);
		appsArr.forEach((app, index) => {
			//console.log("app: ", app);
			let navItem = new NavItem({
				url: app.url,
				icon: app.icon,
				name: app.name,
				owner: this,
				index: app.index || this.navItems.length,
			});
			//navItem.button.click();
		});
		//console.log('ta-da')
		/* if(navContainer) {
          let firstButton = navContainer.querySelector('.nav-button') 
          if(firstButton) firstButton.click();
        } */
		//this.init();
	}
	// ==================================================================================================

	// ==================================================================================================
	onSaveTextInStorage(event, data) {
		//console.log("handleSaveText");
	}

	reorderItem(item, direction) {
		let navContainerInner = document.querySelector('.nav-container-inner');
		if (direction === 1) {
			if (item.index === this.navItems.length - 1) return;
			navContainerInner.insertBefore(
				item.elements.main,
				navContainerInner.children[item.index + 2]
			);
		} else if (direction === -1) {
			if (item.index === 0) return;
			navContainerInner.insertBefore(
				item.elements.main,
				navContainerInner.children[item.index - 1]
			);
		}
		let appEls = [...navContainerInner.querySelectorAll('.nav-button')];
		let newAppOrder = [];
		appEls.forEach((el, index) => {
			this.navItems.forEach((app, _index) => {
				if (el === app.elements.main) {
					newAppOrder.push(app);
					app.index = index;
				}
			});
		});
		console.log('newAppOrder: ', newAppOrder);
		this.navItems = newAppOrder;
		this.saveToStorage();
	}

	saveToStorage() {
		let saveAppsArr = [];
		this.navItems.forEach((item) => {
			let newApp = {
				name: item.name,
				url: item.url,
				icon: item.iconSrc,
				index: item.index,
			};
			saveAppsArr.push(newApp);
		});
		let js = { apps: saveAppsArr };
		ipcRenderer.send(SAVE_TEXT_IN_STORAGE, JSON.stringify(js));
	}
	// ==================================================================================================

	toggleNavItem(index) {
		console.log('index: ', index);
		this.navItems.forEach((navItem, _index) => {
			//console.log('navItem: ', navItem);
			if (navItem.index === index) {
				navItem.elements.main.classList.add('selected');
				if (navItem.webview) {
					navItem.webview.toggle(1);
				}
			} else {
				navItem.elements.main.classList.remove('selected');
				if (navItem.webview) {
					navItem.webview.toggle(-1);
				}
			}
		});
	}

	createContextMenu({ owner, position }) {
		if (this.contextMenu) {
			this.contextMenu.destroy();
		}
		this.contextMenu = new ContextMenu({ owner, position });
	}
}
module.exports = Main;
