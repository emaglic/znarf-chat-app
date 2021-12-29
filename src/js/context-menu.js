class ContextMenu {
	constructor(opts) {
		if (!opts.owner) return;
		this.owner = opts.owner;
		this.position = opts.position || { x: 0, y: 0 };
		this.elements = {
			container: this.owner.elements.main,
		};
		this.template = this.owner.contextMenuTemplate;
		this.createUI();
	}

	createUI() {
		console.log('this.owner: ', this.owner);
		let main = document.createElement('div');
		main.classList.add('context-menu', 'py-2');
		main.innerHTML = `
    <ul></ul>
    `;
		if (this.position) {
			main.style.left = this.position.x + 'px';
			main.style.top = this.position.y + 'px';
		}

		this.template.forEach((item, index) => {
			let li = document.createElement('li');
			li.classList.add('context-item');
			li.innerHTML = this.handleRole(item, li) || item.role;
			main.querySelector('ul').appendChild(li);
		});

		this.elements = {
			...this.elements,
			main,
		};

		this.owner.elements.navContainer.appendChild(main);
		//let mainEl = document.querySelector('main');
		//mainEl.appendChild(main);
	}

	handleRole(item, element) {
		let role = item.role;

		switch (role) {
			case 'Reload App':
				element.onclick = () => {
					if (this.owner.webview) this.owner.webview.reload();
				};
				break;
			case 'Open Developer Tools':
				element.onclick = () => {
					if (this.owner.webview) this.owner.webview.openDevTools();
				};
				break;
			case 'Delete App':
				element.onclick = () => {
					this.owner.deleteApp();
				};
				break;

			case 'header':
				element.classList.add('header', 'py-0', 'px-2');
				return item.label;

			case 'divider':
				element.classList.add('divider', 'p-0');
				return `<hr class='my-2'>`;

			case 'Zoom +':
				element.onclick = () => {
					if (this.owner.webview) this.owner.webview.zoomIn();
				};
				break;

			case 'Zoom -':
				element.onclick = () => {
					if (this.owner.webview) this.owner.webview.zoomOut();
				};
				break;

			case 'Zoom Default':
				element.onclick = () => {
					if (this.owner.webview) this.owner.webview.zoomDefault();
				};
				break;

			case 'Move Up -':
				element.onclick = () => {
					this.owner.owner.reorderItem(this.owner, -1);
				};
				break;

			case 'Move Down +':
				element.onclick = () => {
					console.log('this.owner.owner: ', this.owner.owner);
					this.owner.owner.reorderItem(this.owner, 1);
				};
				break;

			default:
				return null;
		}
		element.classList.add('p-2');
		return null;
	}

	destroy() {
		this.elements.main.parentNode.removeChild(this.elements.main);
		this.owner.owner.contextMenu = null;
	}
}

module.exports = ContextMenu;
