const { ipcRenderer } = window.require("electron");
const CreateWebview = require("./webview");
const Prompt = require("./prompt")
const importIcon = require("./helpers").importIcon;
const getFavicon = require("./helpers").getFavicon;
let activeWebviewElement = null;
const {
  FETCH_TEXT_FROM_STORAGE,
  SAVE_TEXT_IN_STORAGE,
  HANDLE_FETCH_TEXT_FROM_STORAGE,
  HANDLE_SAVE_TEXT_IN_STORAGE,
} = require("../../util/constants");
let viewContainer = null;
let navContainer = null;
const navButtons = [];
let addApp = null;
let prompt = null;
let appJSON = null;
let mouseTimer = null;
const mouseHoverTime = 2000;
// Events
// =================================================================

// Communication with Main Process
//========================================
ipcRenderer.on("openExternalUrl", (event, url) => {
  //console.log("url: ", url);
  if (activeWebviewElement) {
    let appHost = activeWebviewElement.dataset.hostname;
    const urlHost = new URL(url).hostname.toLowerCase();
    if (appHost === urlHost) activeWebviewElement.src = url;
  }
});

//========================================

const handleFetchTextFromStorage = (event, data) => {
  let appsJSON = JSON.parse(data.json);
  console.log('appsJSON: ', appsJSON);
  let appsArr = appsJSON.apps;
  //console.log("appJSON: ", appsJSON);
  //console.log("appsArr: ", appsArr);
  appsArr.forEach((app, index) => {
    console.log("app: ", app);
    let navItem = new CreateNavItem(app);
    navItem.button.click();
  });
  if(navContainer) {
    let firstButton = navContainer.querySelector('.nav-button') 
    if(firstButton) firstButton.click();
  }
  init2();
};

const handleSaveTextInStorage = (event, data) => {
  console.log("handleSaveText");
};

ipcRenderer.on(HANDLE_FETCH_TEXT_FROM_STORAGE, handleFetchTextFromStorage);
ipcRenderer.on(HANDLE_SAVE_TEXT_IN_STORAGE, handleSaveTextInStorage);

const saveToStorage = (apps) => {
  let saveAppsArr = [];
  apps.forEach((app) => {
    let newApp = {
      name: app.name,
      url: app.url,
      icon: app.iconSrc,
    };
    saveAppsArr.push(newApp);
  });
  let js = { apps: saveAppsArr };
  console.log("js: ", js);
  ipcRenderer.send(SAVE_TEXT_IN_STORAGE, JSON.stringify(js));
};

// =================================================================

// Init Method Runs At Start
// =================================================================
const init = () => {
  navContainer = document.querySelector(".nav-container");
  viewContainer = document.querySelector(".view-container");
  ipcRenderer.send(FETCH_TEXT_FROM_STORAGE);
};
// =================================================================

// init2
// =================================================================
const init2 = () => {
  //console.log('appsJSON: ', appsJSON);
  //navContainer = document.querySelector(".nav-container");
  //viewContainer = document.querySelector(".view-container");
  addApp = new AddAppButton();
  console.log(addApp);

  // Code for addApp button
  // =======================================================
  addApp.button.onclick = () => {
    if (prompt) return;

    prompt = new Prompt();
    console.log("prompt: ", prompt);

    console.log('prompt: ', prompt)

    prompt.elements.clickCatcher.onclick = () => {
      prompt.destroy();
      prompt = null;
    };

    let submitFunct = () => {
      let icon = null;

      let prependToUrl = prompt.elements.input.value.includes("https://")
        ? ""
        : prompt.elements.input.value.includes("http://")
        ? ""
        : "http://";

      if (
        prompt.elements.icon.files.length ||
        prompt.elements.iconUrl.value ||
        getFavicon(prompt.elements.input.value)
      ) {
        let path = prompt.elements.icon.files.length
          ? prompt.elements.icon.files[0].path
          : prompt.elements.iconUrl.value
          ? prompt.elements.iconUrl.value
          : prependToUrl + prompt.elements.input.value + "/favicon.ico";
        //console.log('prompt.elements.icon.files', prompt.elements.icon.files);
        icon = importIcon(path)
          .then((value) => {
            console.log("value: ", value);
            console.log("THEN FIRED....");
            const navItem = new CreateNavItem({
              name: "newApp",
              url: prompt.elements.input.value,
              icon: String(value),
              useragent: prompt.elements.useragent.value ? prompt.elements.useragent.value : null,
            });
            prompt.destroy();
            prompt = null;
          })
          .catch((err) => console.error(err));
      } else {
        const navItem = new CreateNavItem({
          name: "newApp",
          url: prompt.elements.input.value,
          icon: icon,
        });
        prompt.destroy();
        prompt = null;
      }
    };

    prompt.elements.input.onkeypress = (evt) => {
      if (evt.which == 13 || evt.keyCode == 13) {
        submitFunct();
      }
    };

    prompt.elements.submit.onclick = () => {
      submitFunct();
    };

    prompt.elements.cancel.onclick = () => {
      prompt.destroy();
      prompt = null;
    };
  };
}
// =================================================================

// Add a New App to the List
// =================================================================
function AddAppButton() {
  this.button = document.createElement("div");
  this.button.classList.add("nav-button");
  this.button.classList.add("add-app-button");

  this.icon = document.createElement("img");
  this.icon.classList.add("nav-icon");
  this.icon.src = "./public/images/add.svg";

  this.button.appendChild(this.icon);
  navContainer.appendChild(this.button);

  return this;
}
// =================================================================

// Delete An App From the List
// =================================================================

// =================================================================

// Create a New App
// =================================================================
function CreateNavItem(app) {
  console.log("create nav item!");

  this.url = app.url;
  this.webview = null;
  this.index = navButtons.length;
  this.name = app.name;
  this.iconSrc = app.icon ? app.icon : "./public/images/default.svg";
  this.useragent = app.useragent ? app.useragent : null;
  navButtons.push(this);
  saveToStorage(navButtons);

  this.button = document.createElement("div");
  this.button.classList.add("nav-button");

  //this.favicon = app.url + '/favicon.ico';
  //console.log('this.favicon: ', this.favicon)
  this.icon = document.createElement("img");
  this.icon.classList.add("nav-icon");
  this.icon.src = this.iconSrc;

  //console.log('APP: ', app);

  //let icon = app.icon ? app.icon : './public/images/default.svg';
  //console.log('app.icon: ', app.icon);

  //this.close = document.createElement("div");
  //this.close.classList.add("nav-close");

  this.delete = document.createElement("div");
  this.delete.classList.add("nav-delete");

  this.button.appendChild(this.icon);
  //this.button.appendChild(this.close);
  this.button.appendChild(this.delete);
  //navContainer.appendChild(this.button);
  navContainer.insertBefore(
    this.button,
    navContainer.childNodes[navContainer.childElementCount - 1]
  );

  this.button.onmouseenter = () => {
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => {
      //this.close.classList.add("hover");
      this.delete.classList.add("hover");
    }, mouseHoverTime);
  };

  this.button.onmouseleave = () => {
    clearTimeout(mouseTimer);
    //this.close.classList.remove("hover");
    this.delete.classList.remove("hover");
  };

  this.button.onclick = (evt) => {
    //console.log('this.button.onclick evt: ', evt)
    //console.log('you clicked the element for: ', app.name)

    /* if (evt.target === this.close) {
      //console.log('close app was clicked.')
      if (this.webview && this.webview.element)
        this.webview.element.parentNode.removeChild(this.webview.element);
      this.button.parentNode.removeChild(this.button);
    }  */
    if (evt.target === this.delete) {ssaA111
      //console.log('delete app was clicked.')
      navButtons.splice(this.index, 1);
      if (this.webview && this.webview.element)
        this.webview.element.parentNode.removeChild(this.webview.element);
      this.button.parentNode.removeChild(this.button);
      saveToStorage(navButtons);
    } else {
      if (this.webview) {
        //console.log('showing app: ', app.name)
        toggleAppViews(this.index);
      } else {
        //console.log('creating webview for: ', app.name);
        this.webview = new CreateWebview(app, viewContainer);
        toggleAppViews(this.index);
      }
    }
  };

  //ipcRenderer.send('addNewApplication', this.url);

  //Save New App To Storage
  //saveToStorage(this);

  return this;
}
// =================================================================

// Change Which App is Visible
// =================================================================
const toggleAppViews = (newIndex) => {
  //console.log('navButtons: ', navButtons)
  navButtons.forEach((app, index) => {
    //console.log('newIndex: ', newIndex);
    //console.log('index: ', index);
    if (index === newIndex) {
      //console.log('match')
      //console.log('app equals: ', app);
      app.button.classList.add("selected");
      if (app.webview) {
        app.webview.toggle(1);
        activeWebviewElement = app.webview.element;
      }
    } else {
      //console.log('not match')
      //console.log('app not-equals: ', app);
      navButtons[index].button.classList.remove("selected");
      if (app.webview) {
        app.webview.toggle(-1);
      }
    }
    //console.log('--------------------')
  });
};
// =================================================================

module.exports = {
  init,
};
