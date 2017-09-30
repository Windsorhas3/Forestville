var exec = require("child_process").exec;
var child = exec('/usr/bin/google-chrome --headless --disable-gpu --no-sandbox --dump-dom ./index.html && sleep 10m');
child.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
});
child.stderr.on('data', function(data) {
    console.log('stdout: ' + data);
});
child.on('close', function(code) {
    console.log('closing code: ' + code);
});

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
    Page.navigate({ url: 'https://github.com/' });

    Page.loadEventFired(async () => {
        let js = "document.body.innerHTML";
        const result = await Runtime.evaluate({ expression: js });
        console.log(result);
    });
})();
