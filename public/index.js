/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/application-specfic/application-classes.js":
/*!***********************************************************!*\
  !*** ./src/js/application-specfic/application-classes.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const HangoutsSettings = __webpack_require__(/*! ./hangouts */ "./src/js/application-specfic/hangouts.js");

const SlackSettings = __webpack_require__(/*! ./slack */ "./src/js/application-specfic/slack.js");

const SkypeSettings = __webpack_require__(/*! ./skype */ "./src/js/application-specfic/skype.js");

const MessengerSettings = __webpack_require__(/*! ./messenger */ "./src/js/application-specfic/messenger.js");

module.exports = {
  HangoutsSettings,
  SlackSettings,
  SkypeSettings,
  MessengerSettings
};

/***/ }),

/***/ "./src/js/application-specfic/hangouts.js":
/*!************************************************!*\
  !*** ./src/js/application-specfic/hangouts.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const ApplicationSettings = __webpack_require__(/*! ./index */ "./src/js/application-specfic/index.js");

class HangoutsSettings extends ApplicationSettings {
  constructor(opts) {
    super(opts);
  }

  getExecuteJS() {
    return `
    /* var Notification = function(title, opts) {
			console.log('title: ', title, 'opts: ', opts);
			ipcRenderer.sendToHost(title, opts);
		}
		window.Notification = Notification; */
    let updateTimer = setInterval( () => {
      //let unreadsAll = [...document.querySelectorAll('#hangout-landing-chat')];
      let unread = 0;
      let landingChat = document.querySelector('#hangout-landing-chat');
      if(landingChat && landingChat.children && landingChat.children.length > 0 && landingChat.children[0].contentWindow && landingChat.children[0].contentWindow.document) {
        let childWindow = landingChat.children[0].contentWindow;
        let childDocument = childWindow.document;
        let unreadsAll = [...childDocument.querySelectorAll('.lt')];
        unreadsAll.forEach( (item) => {
          let span = item.querySelector('span');
          if(!span) return;
          let fontWeight = childWindow.getComputedStyle(span).getPropertyValue('font-weight');
          if(!fontWeight) return;
          if(fontWeight == 700) unread += 1;
        })
      }
      ipcRenderer.sendToHost('hangouts-status-update', { unreadMessages: unread });
    }, ${this.refreshTime}) 
  `;
  }

  setWebviewAttributes(webview) {
    webview.setAttribute('autosize', 'on');
    webview.setAttribute('useragent', 'Chrome');
    webview.setAttribute('nodeintegration', 'on');
    webview.setAttribute('disablewebsecurity', 'on');
  }

}

module.exports = HangoutsSettings;

/***/ }),

/***/ "./src/js/application-specfic/index.js":
/*!*********************************************!*\
  !*** ./src/js/application-specfic/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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

/***/ }),

/***/ "./src/js/application-specfic/messenger.js":
/*!*************************************************!*\
  !*** ./src/js/application-specfic/messenger.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const ApplicationSettings = __webpack_require__(/*! ./index */ "./src/js/application-specfic/index.js");

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

/***/ }),

/***/ "./src/js/application-specfic/skype.js":
/*!*********************************************!*\
  !*** ./src/js/application-specfic/skype.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const ApplicationSettings = __webpack_require__(/*! ./index */ "./src/js/application-specfic/index.js");

class SkypeSettings extends ApplicationSettings {
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
    const useragent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18362';
    webview.setAttribute('useragent', useragent);
  }

}

module.exports = SkypeSettings;

/***/ }),

/***/ "./src/js/application-specfic/slack.js":
/*!*********************************************!*\
  !*** ./src/js/application-specfic/slack.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const ApplicationSettings = __webpack_require__(/*! ./index */ "./src/js/application-specfic/index.js");

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
    const useragent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36';
    webview.setAttribute('useragent', useragent);
  }

}

module.exports = SlackSettings;

/***/ }),

/***/ "./src/js/context-menu.js":
/*!********************************!*\
  !*** ./src/js/context-menu.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

class ContextMenu {
  constructor(opts) {
    if (!opts.owner) return;
    this.owner = opts.owner;
    this.position = opts.position || {
      x: 0,
      y: 0
    };
    this.elements = {
      container: this.owner.elements.main
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
    this.elements = { ...this.elements,
      main
    };
    this.owner.elements.navContainer.appendChild(main); //let mainEl = document.querySelector('main');
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

/***/ }),

/***/ "./src/js/default-screen.js":
/*!**********************************!*\
  !*** ./src/js/default-screen.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

class DefaultScreen {
  constructor(opts) {
    this.opts = opts || {};
    this.elements = {
      container: this.opts.container || document.querySelector('.view-container')
    };
    this.createUI();
  }

  createUI() {
    let main = document.createElement('div');
    main.classList.add('h-100', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'container', 'default-screen', 'text-center');
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

/***/ }),

/***/ "./src/js/helpers.js":
/*!***************************!*\
  !*** ./src/js/helpers.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Add App Prompt
// =========================================================================================

/* function Prompt(opts) {
  this.element = document.createElement("div");
  this.element.classList.add("prompt-container");
  this.element.innerHTML = `
  <div class="prompt-click-catcher"></div>
  <div
    class="d-flex flex-column justify-content-center align-items-center h-100 text-white container prompt-container-inner"
  >
    <div class='row row0 w-100'>
      <div class="col-12 text-center">
        <h2>Setup New Web Application</h2>
      </div>
    </div>
    <div class="row row1 w-100 mt-5">
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
    <div class="row row2 mt-5 w-100">
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
    <div class="row row3 mt-5 w-100">
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
    <div class="row d-inline-flex row4 w-100 justify-content-center align-items-center mt-5">
      <button class="prompt-cancel btn btn-danger mr-3">CANCEL</button>
      <button class="prompt-submit btn btn-success">SUBMIT</button>
    </div>
  </div>  
    `;
  this.input = this.element.querySelector("input.prompt-url");
  this.icon = this.element.querySelector("input.prompt-icon");
  this.iconUrl = this.element.querySelector("input.prompt-icon-url");
  this.useragent = this.element.querySelector("input.prompt-custom-useragent");
  this.cancel = this.element.querySelector("button.prompt-cancel");
  this.submit = this.element.querySelector("button.prompt-submit");
  this.clickCatcher = this.element.querySelector("div.prompt-click-catcher");

  let main = document.querySelector("main");
  main.appendChild(this.element);

  this.input.focus();

  this.destroy = () => {
    this.element.parentNode.removeChild(this.element);
  };

  return this;
} */
// =========================================================================================
// Convert Image to DataURL
// =========================================================================================
const getDataUrl = img => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    resolve(canvas.toDataURL("image/png"));
  });
}; // =========================================================================================
// Import An Icon Image
// =========================================================================================


const importIcon = src => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve(getDataUrl(img));
    };

    img.onerror = err => {
      reject(err);
    };

    img.src = src;
  });
}; // =========================================================================================
// Attempts to Automatically Find a Favicon
// ========================================================================================


const getFavicon = url => {
  let prependToUrl = url.includes("https://") ? "" : url.includes("http://") ? "" : "http://";
  let faviconUrl = prependToUrl + url + "/favicon.ico";
  var http = new XMLHttpRequest();
  http.open("HEAD", faviconUrl, false);
  http.send();

  if (http.status != 404) {
    return faviconUrl;
  } else {
    return null;
  }
}; // ========================================================================================


module.exports = {
  importIcon,
  getFavicon
};

/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/index.scss */ "./src/scss/index.scss");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_scss_index_scss__WEBPACK_IMPORTED_MODULE_0__);


const Main = __webpack_require__(/*! ./main */ "./src/js/main.js");

const navContainer = document.querySelector('.nav-container');
const viewContainer = document.querySelector('.view-container');
let appVersion = null;
let main;

const init = () => {
  viewContainer.style.width = window.innerWidth - navContainer.offsetWidth + 'px';
  main = new Main(); //navInit();
  //new Notification("Hello!", { content: "Notification world!" }); // Send push notification
};

const resize = () => {
  viewContainer.style.width = window.innerWidth - navContainer.offsetWidth + 'px';
};
/* 

This is the renderer process. 
This is how you talk to the main process

// Get message from main process....
ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})

// Send message to main process...
ipcRenderer.send('asynchronous-message', 'ping')

*/


window.onresize = resize;
window.onload = init;

/***/ }),

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const {
  ipcRenderer
} = window.require('electron');

const NavItem = __webpack_require__(/*! ./nav-item */ "./src/js/nav-item.js");

const Prompt = __webpack_require__(/*! ./prompt */ "./src/js/prompt.js");

const ContextMenu = __webpack_require__(/*! ./context-menu */ "./src/js/context-menu.js");

const importIcon = __webpack_require__(/*! ./helpers */ "./src/js/helpers.js").importIcon;

const getFavicon = __webpack_require__(/*! ./helpers */ "./src/js/helpers.js").getFavicon;

const {
  FETCH_TEXT_FROM_STORAGE,
  SAVE_TEXT_IN_STORAGE,
  HANDLE_FETCH_TEXT_FROM_STORAGE,
  HANDLE_SAVE_TEXT_IN_STORAGE
} = __webpack_require__(/*! ../../util/constants */ "./util/constants.js");

const DefaultScreen = __webpack_require__(/*! ./default-screen */ "./src/js/default-screen.js");

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
    this.mouseHoverTime = 2000; //this.apps = [];

    this.contextMenu = null;
    this.defaultScreen = new DefaultScreen();
    this.elements = {
      body: document.querySelector('body')
    };
    this.init();
  } // INIT
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
    this.elements = { ...this.elements,
      navContainer,
      navContainerInner,
      viewContainer,
      addAppButton
    };

    this.elements.body.onclick = evt => {
      evt.preventDefault();
      if (this.contextMenu) this.contextMenu.destroy();
    };

    this.elements.navContainer.onmouseleave = evt => {
      if (this.contextMenu) this.contextMenu.destroy();
    };

    ipcRenderer.on('get-app-version', (evt, version) => {
      this.appVersion = version;
      this.defaultScreen.appendAppVersion(this.appVersion);
    });
    ipcRenderer.on('openExternalUrl', this.onOpenExternalUrl.bind(this));
    ipcRenderer.on(HANDLE_FETCH_TEXT_FROM_STORAGE, this.onFetchTextFromStorage.bind(this));
    ipcRenderer.on(HANDLE_SAVE_TEXT_IN_STORAGE, this.onSaveTextInStorage.bind(this));
    ipcRenderer.send(FETCH_TEXT_FROM_STORAGE);
  } // ==================================================================================================


  createPrompt() {
    let prompt = document.querySelector('.addapp-prompt');
    if (prompt) return;
    new Prompt({
      owner: this
    });
  } // ==================================================================================================


  onOpenExternalUrl(event, url) {} // ==================================================================================================
  // ==================================================================================================


  onFetchTextFromStorage(event, data) {
    let appsJSON = JSON.parse(data.json);
    let appsArr = appsJSON.apps; //console.log("appJSON: ", appsJSON);
    //console.log("appsArr: ", appsArr);

    appsArr.forEach((app, index) => {
      //console.log("app: ", app);
      let navItem = new NavItem({
        url: app.url,
        icon: app.icon,
        name: app.name,
        owner: this,
        index: app.index || this.navItems.length
      }); //navItem.button.click();
    }); //console.log('ta-da')

    /* if(navContainer) {
            let firstButton = navContainer.querySelector('.nav-button') 
            if(firstButton) firstButton.click();
          } */
    //this.init();
  } // ==================================================================================================
  // ==================================================================================================


  onSaveTextInStorage(event, data) {//console.log("handleSaveText");
  }

  reorderItem(item, direction) {
    let navContainerInner = document.querySelector('.nav-container-inner');

    if (direction === 1) {
      if (item.index === this.navItems.length - 1) return;
      navContainerInner.insertBefore(item.elements.main, navContainerInner.children[item.index + 2]);
    } else if (direction === -1) {
      if (item.index === 0) return;
      navContainerInner.insertBefore(item.elements.main, navContainerInner.children[item.index - 1]);
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
    this.navItems.forEach(item => {
      let newApp = {
        name: item.name,
        url: item.url,
        icon: item.iconSrc,
        index: item.index
      };
      saveAppsArr.push(newApp);
    });
    let js = {
      apps: saveAppsArr
    };
    ipcRenderer.send(SAVE_TEXT_IN_STORAGE, JSON.stringify(js));
  } // ==================================================================================================


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

  createContextMenu({
    owner,
    position
  }) {
    if (this.contextMenu) {
      this.contextMenu.destroy();
    }

    this.contextMenu = new ContextMenu({
      owner,
      position
    });
  }

}

module.exports = Main;

/***/ }),

/***/ "./src/js/nav-item.js":
/*!****************************!*\
  !*** ./src/js/nav-item.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const CreateWebview = __webpack_require__(/*! ./webview */ "./src/js/webview.js");

const {
  ipcRenderer
} = window.require('electron');

const {
  HangoutsSettings,
  SlackSettings,
  SkypeSettings,
  MessengerSettings
} = __webpack_require__(/*! ./application-specfic/application-classes */ "./src/js/application-specfic/application-classes.js");

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
    this.useDefaultIcon = opts.icon === './public/images/default.svg' ? true : opts.icon === null ? true : false;
    this.iconSrc = opts.icon ? opts.icon : './public/images/default.svg';
    /* this.mouseOverTimeout = null;
    this.mouseOverTime = 2000; */

    this.elements = {
      navContainer: this.owner.elements.navContainer,
      navContainerInner: this.owner.elements.navContainerInner
    };
    this.contextMenuTemplate = this.getContextTemplate(); //console.log('this.owner: ', this.owner);

    this.owner.navItems.push(this);
    this.applicationSettings = this.detectApplication(this.url);
    this.webview = new CreateWebview({
      owner: this,
      icon: this.iconSrc,
      name: this.name,
      url: this.url,
      userAgent: this.userAgent,
      viewContainer: this.owner.elements.viewContainer
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
      return new HangoutsSettings({
        owner: this
      });
    }

    if (url.includes('slack.com')) {
      return new SlackSettings({
        owner: this
      });
    }

    if (url.includes('skype.com')) {
      return new SkypeSettings({
        owner: this
      });
    }

    if (url.includes('messenger.com')) {
      return new MessengerSettings({
        owner: this
      });
    }

    return null;
  }

  getContextTemplate() {
    return [{
      role: 'header',
      label: this.name
    }, {
      role: 'divider'
    }, {
      role: 'Reload App'
    }, {
      role: 'Zoom +'
    }, {
      role: 'Zoom -'
    }, {
      role: 'Zoom Default'
    }, {
      role: 'Move Up -'
    }, {
      role: 'Move Down +'
    }, {
      role: 'Open Developer Tools'
    }, {
      role: 'Delete App'
    }];
  }

  createUI() {
    let main = document.createElement('div');
    main.classList.add('nav-button'); //main.dataset.index = this.index;

    main.innerHTML = `
						<img src='${this.iconSrc}' class='nav-icon' />
						<div class='nav-badge justify-content-center align-items-center'></div>
				`;
    let badge = main.querySelector('.nav-badge');

    if (this.useDefaultIcon) {
      let iconInitial = document.createElement('div');
      iconInitial.classList.add('service-icon-name');
      let n = this.name[0].toUpperCase() + this.name.substr(1, this.name.length > 8 ? 8 : this.name.length - 1);
      iconInitial.innerHTML = `${n}`;
      main.appendChild(iconInitial);
    } //console.log('nav-item this.elements: ', this.elements)

    /* this.elements.navContainerInner.insertBefore(
    	main,
    	this.elements.navContainerInner.childNodes[
    		this.elements.navContainerInner.childElementCount - 1
    	]
    );
    */


    this.elements.navContainerInner.appendChild(main);

    main.oncontextmenu = evt => {
      evt.preventDefault(); //console.log('nav-item evt: ', evt);

      this.owner.createContextMenu({
        owner: this,
        position: {
          x: evt.offsetX,
          y: evt.pageY
        }
      });
    };

    main.onclick = evt => {
      this.owner.toggleNavItem(this.index);
    };

    this.elements = { ...this.elements,
      main,
      badge
    };
  }

  deleteApp() {
    this.elements.main.parentNode.removeChild(this.elements.main);
    if (this.webview && this.webview.element) this.webview.element.parentNode.removeChild(this.webview.element);
    this.navItems = this.navItems.filter(x => x.index !== this.index);
    this.owner.saveToStorage();
  }

}

module.exports = NavItem;

/***/ }),

/***/ "./src/js/prompt.js":
/*!**************************!*\
  !*** ./src/js/prompt.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const {
  importIcon,
  getFavicon
} = __webpack_require__(/*! ./helpers */ "./src/js/helpers.js");

const NavItem = __webpack_require__(/*! ./nav-item */ "./src/js/nav-item.js"); // Add App Prompt
// =========================================================================================


class Prompt {
  constructor(opts) {
    if (!opts) opts = {};
    this.owner = opts.owner;
    this.elements = {
      container: opts.main || document.querySelector('main')
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
    this.elements = { ...this.elements,
      main,
      name,
      url,
      icon,
      iconUrl,
      useragent,
      cancel,
      submit,
      clickCatcher
    };

    clickCatcher.onclick = () => {
      this.destroy();
    };

    cancel.onclick = () => {
      this.destroy();
    };

    url.onkeyup = evt => {
      if (evt.which === 13 || evt.keyCode === 13) this.onSubmit();
    };

    submit.onclick = evt => {
      this.onSubmit();
    }; //console.log('this.elements: ', this.elements)


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
    requiredFields.forEach(field => {
      if (!field.value) {
        field.classList.add('prompt-required', 'text-white');
        missingReqFields.push(field);
      }
    });
    if (missingReqFields.length) return;
    let prependToUrl = url.value.includes('https://') ? '' : url.value.includes('http://') ? '' : 'http://';

    if (icon.files.length || iconUrl.value || getFavicon(url.value)) {
      let path = icon.files.length ? icon.files[0].path : iconUrl.value ? iconUrl.value : prependToUrl + url.value + '/favicon.ico';
      importIcon(path).then(iconSrc => {
        let navItem = new NavItem({
          url: `${prependToUrl}${url.value}`,
          icon: String(iconSrc),
          name: name.value,
          userAgent: useragent.value,
          owner: this.owner,
          index: this.owner.navItems.length
        });
        this.owner.navItems.push(navItem);
        this.owner.saveToStorage();
      }).catch(err => console.error(err));
    } else {
      let navItem = new NavItem({
        url: `${prependToUrl}${url.value}`,
        icon: null,
        name: name.value,
        userAgent: useragent.value,
        owner: this.owner,
        index: this.owner.navItems.length
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

} // =========================================================================================


module.exports = Prompt;

/***/ }),

/***/ "./src/js/webview.js":
/*!***************************!*\
  !*** ./src/js/webview.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const {
  shell
} = __webpack_require__(/*! electron */ "electron");

const {
  ipcRenderer
} = window.require('electron');

const path = __webpack_require__(/*! path */ "path");

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
      spellcheck: true
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
    this.element.setAttribute('webpreferences', this.getCombinedTagAttributes(this.webpreferences));
    this.element.setAttribute('allowpopups', true);
    this.element.setAttribute('preload', `./preload.js`);
    this.element.classList.add('webview', 'bg-light');
    this.element.addEventListener('new-window', evt => {
      evt.preventDefault();

      const protocol = __webpack_require__(/*! url */ "url").parse(evt.url).protocol;

      if (protocol === 'http:' || protocol === 'https:') {
        shell.openExternal(evt.url);
      }
    });

    if (this.userAgent) {
      this.element.setAttribute('useragent', this.userAgent);
    } else {
      if (this.applicationSettings && this.applicationSettings.setWebviewAttributes) {
        this.applicationSettings.setWebviewAttributes(this.element);
      }
    }

    let prependToUrl = this.url.includes('https://') ? '' : this.url.includes('http://') ? '' : 'http://';
    this.element.src = prependToUrl + this.url;

    if (this.applicationSettings && this.applicationSettings.getExecuteJS) {
      this.element.addEventListener('dom-ready', evt => {
        this.element.executeJavaScript(this.applicationSettings.getExecuteJS(), false);
      });
    }

    this.element.addEventListener('ipc-message', evt => {
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

/***/ }),

/***/ "./src/scss/index.scss":
/*!*****************************!*\
  !*** ./src/scss/index.scss ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./util/constants.js":
/*!***************************!*\
  !*** ./util/constants.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  FETCH_TEXT_FROM_STORAGE: 'fetch-text-from-storage',
  SAVE_TEXT_IN_STORAGE: 'save-text-in-storage',
  HANDLE_FETCH_TEXT_FROM_STORAGE: 'handle-fetch-text-from-storage',
  HANDLE_SAVE_TEXT_IN_STORAGE: 'handle-save-in-storage'
};

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map