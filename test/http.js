const CDP = require('chrome-remote-interface');
const chromeLauncher = require('chrome-launcher');

function launchChrome(headless = true) {
    return chromeLauncher.launch({
	chromePath: '/usr/bin/google-chrome',
        chromeFlags: [
            '--window-size=300,732',
            '--disable-gpu',
	    '--no-sandbox',
            headless ? '--headless' : ''
        ]
    });
}

(async function () {
    const chrome = await launchChrome();
    const protocol = await CDP({ port: chrome.port });
    const { Page, Runtime } = protocol;
    await Promise.all([Page.enable(), Runtime.enable()]);
    Page.navigate({ url: 'https://wtyjfqkrr.github.io/tmpsite/index.html' });

    Page.loadEventFired(async () => {
        let js = "document.body.innerHTML";
        const result = await Runtime.evaluate({ expression: js });
        console.log(result);
    });
})();

var index = 1;
var max = 13;
var interval;
interval = setInterval(function () {
  if (index >= max) process.exit(0);
  console.log("waiting..." + index++);
}, 1000 * 60);
