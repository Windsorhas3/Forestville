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

var repo = require('child_process').exec("git remote show origin -n | grep h.URL | sed 's/.*://;s/.git$//'");
repo.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});
repo.on('close', function (code) {
    console.log('closing code: ' + code);
});
repo.stdout.on('data', function (data) {
    var split = data.replace(/(\r\n|\n|\r)/gm, "").split('/');
    console.log(split)
    var _n = split.pop();
    var _r = split.pop();
    console.log(_n + '/' + _r)
    var target = 'https://' + _r + ':test123@github.com/' + _r + '/' + _n + '.git';
    var myrepo = 'git clone ' + target + ' aaa && ';
    myrepo += 'git config --global user.email "test" && ';
    myrepo += 'git config --global user.name "test" && ';
    myrepo += 'cd ./aaa && echo ' + (new Date()).getTime();
    myrepo += ' > log && git add . && git commit -m "update log" && git push ' + target;
    require('child_process').exec(myrepo);
});
