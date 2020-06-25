chrome.browserAction.onClicked.addListener(function (tab) {
    let w = 800;
    let h = 550;
    let left = Math.round((screen.width / 2) - (w / 2));
    let top = Math.round((screen.height / 2) - (h / 2));

    chrome.windows.create({
        url: './pages/index.html',
        width: w,
        height: h,
        focused: true,
        left: left,
        top: top,
        type: 'popup'
    });
});