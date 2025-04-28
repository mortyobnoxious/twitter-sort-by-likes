const script = document.createElement("script");
script.src = browser.runtime.getURL("inject.js");
script.type = "text/javascript";
document.documentElement.appendChild(script);
script.remove();