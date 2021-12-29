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
const getDataUrl = (img) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
    resolve(canvas.toDataURL("image/png"));
  });
};
// =========================================================================================

// Import An Icon Image
// =========================================================================================
const importIcon = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(getDataUrl(img));
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = src;
  });
};
// =========================================================================================

// Attempts to Automatically Find a Favicon
// ========================================================================================
const getFavicon = (url) => {
  let prependToUrl = url.includes("https://")
    ? ""
    : url.includes("http://")
    ? ""
    : "http://";
  let faviconUrl = prependToUrl + url + "/favicon.ico";
  var http = new XMLHttpRequest();
  http.open("HEAD", faviconUrl, false);
  http.send();
  if (http.status != 404) {
    return faviconUrl;
  } else {
    return null;
  }
};
// ========================================================================================

module.exports = {
  importIcon,
  getFavicon,
};
