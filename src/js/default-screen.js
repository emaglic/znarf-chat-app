class DefaultScreen {
	constructor(opts) {
		this.opts = opts || {};
		this.elements = {
			container:
				this.opts.container || document.querySelector('.view-container'),
		};
		this.createUI();
	}

	createUI() {
		let main = document.createElement('div');
		main.classList.add(
			'h-100',
			'd-flex',
			'flex-column',
			'align-items-center',
			'justify-content-center',
			'container',
			'default-screen',
			'text-center'
		);
		main.innerHTML = `
			<div class='default-screen-center-content'>
				<img src='./public/images/znarf-logo.svg' class='default-znarf-logo' />
      	<h1>Welcome to Znarf</h1>
      	<h4>Click + to add a new application</h4>
      </div>
		`;
		this.elements.main = main;
		this.elements.container.appendChild(main);
	}

	appendAppVersion(version) {
		let div = document.createElement('div');
		div.classList.add('app-version');
		div.innerHTML = `App Version: ${version}`;
		this.elements.main.appendChild(div);
		this.elements.version = div;
	}
}

module.exports = DefaultScreen;
