const ApplicationSettings = require('./index');

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
