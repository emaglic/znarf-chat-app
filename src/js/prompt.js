const { importIcon, getFavicon } = require('./helpers');
const NavItem = require('./nav-item');

// Add App Prompt
// =========================================================================================
class Prompt {
	constructor(opts) {
		if (!opts) opts = {};
		this.owner = opts.owner;
		this.elements = {
			container: opts.main || document.querySelector('main'),
		};

		this.createUI();
	}

	createUI() {
		const main = document.createElement('div');
		main.classList.add('prompt-container', 'addapp-prompt');
		main.innerHTML = `
    <div class="prompt-click-catcher"></div>
    <div
      class="d-flex flex-column justify-content-center align-items-center h-100 text-white container prompt-container-inner"
    >
      <div class='row row0 w-100'>
        <div class="col-12 text-center">
          <h2>New Web Application</h2>
        </div>
      </div>
      <div class='row row1 w-100 mt-3'>
      <div class="col-12">
          <label class="sr-only" for="inlineFormInputGroupUsername">Name</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">Name</div>
            </div>
            <input
              type="text"
              class="form-control prompt-name"
              placeholder="Enter a name for your application"
            />
          </div>
        </div>
      </div>
      <div class="row row1 w-100 mt-3">
        <div class="col-12">
          <label class="sr-only" for="inlineFormInputGroupUsername">URL</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">URL</div>
            </div>
            <input
              type="text"
              class="form-control prompt-url"
              placeholder="Enter URL Here"
            />
          </div>
        </div>
      </div>
      <div class="row row2 mt-3 w-100">
        <div class="col-12 text-center mb-2">
          <h5>Add Custom Icon</h5>
        </div>
        <div class="col-6">
          <label class="sr-only" for="inlineFormInputGroupUsername">Icon URL</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">Icon URL</div>
            </div>
            <input
              type="text"
              class="form-control prompt-icon-url"
              placeholder="Enter Image Address"
            />
          </div>
        </div>
        <div class='col-3 d-inline-flex justify-content-center aligh-items-center h3'>
          OR
        </div>
        <div class="col-3 d-inline-flex justify-content-center align-items-center">
          <input
              type="file"
              accept="image/*"
              class="prompt-icon"
              placeholder="Upload Icon Image"
            />
        </div>
      </div>
      <div class="row row3 mt-3 w-100">
        <div class="col-12 text-center mb-2">
          <h5>Add Custom Useragent</h5>
        </div>
        <div class="col-12">
          <label class="sr-only" for="inlineFormInputGroupUsername">Icon URL</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">UserAgent</div>
            </div>
            <input
              type="text"
              class="form-control prompt-custom-useragent"
              placeholder="Enter Custom Useragent (Optional)"
            />
          </div>
        </div>
      </div>
      <div class="row d-inline-flex row4 w-100 justify-content-center align-items-center mt-3">
        <button class="prompt-cancel btn btn-danger mr-3">CANCEL</button>
        <button class="prompt-submit btn btn-success">SUBMIT</button>
      </div>
    </div>  
      `;

		let name = main.querySelector('input.prompt-name');
		let url = main.querySelector('input.prompt-url');
		let icon = main.querySelector('input.prompt-icon');
		let iconUrl = main.querySelector('input.prompt-icon-url');
		let useragent = main.querySelector('input.prompt-custom-useragent');
		let cancel = main.querySelector('button.prompt-cancel');
		let submit = main.querySelector('button.prompt-submit');
		let clickCatcher = main.querySelector('div.prompt-click-catcher');

		this.elements = {
			...this.elements,
			main,
			name,
			url,
			icon,
			iconUrl,
			useragent,
			cancel,
			submit,
			clickCatcher,
		};

		clickCatcher.onclick = () => {
			this.destroy();
		};

		cancel.onclick = () => {
			this.destroy();
		};

		url.onkeyup = (evt) => {
			if (evt.which === 13 || evt.keyCode === 13) this.onSubmit();
		};

		submit.onclick = (evt) => {
			this.onSubmit();
		};

		//console.log('this.elements: ', this.elements)
		this.elements.container.appendChild(main);
		this.elements.name.focus();
	}

	onSubmit() {
		let name = this.elements.name;
		let icon = this.elements.icon;
		let iconUrl = this.elements.iconUrl;
		let url = this.elements.url;
		let useragent = this.elements.useragent;

		const requiredFields = [name, url];
		let missingReqFields = [];
		requiredFields.forEach((field) => {
			if (!field.value) {
				field.classList.add('prompt-required', 'text-white');
				missingReqFields.push(field);
			}
		});
		if (missingReqFields.length) return;

		let prependToUrl = url.value.includes('https://')
			? ''
			: url.value.includes('http://')
			? ''
			: 'http://';

		if (icon.files.length || iconUrl.value || getFavicon(url.value)) {
			let path = icon.files.length
				? icon.files[0].path
				: iconUrl.value
				? iconUrl.value
				: prependToUrl + url.value + '/favicon.ico';

			importIcon(path)
				.then((iconSrc) => {
					let navItem = new NavItem({
						url: `${prependToUrl}${url.value}`,
						icon: String(iconSrc),
						name: name.value,
						userAgent: useragent.value,
						owner: this.owner,
						index: this.owner.navItems.length,
					});
					this.owner.navItems.push(navItem);
					this.owner.saveToStorage();
				})
				.catch((err) => console.error(err));
		} else {
			let navItem = new NavItem({
				url: `${prependToUrl}${url.value}`,
				icon: null,
				name: name.value,
				userAgent: useragent.value,
				owner: this.owner,
				index: this.owner.navItems.length,
			});
			this.owner.navItems.push(navItem);
			this.owner.saveToStorage();
		}
		this.destroy();
	}

	destroy() {
		this.elements.main.parentNode.removeChild(this.elements.main);
		this.owner.prompt = null;
	}
}
// =========================================================================================
module.exports = Prompt;
