// 进入设置页面
[].forEach.call(document.getElementsByClassName("layui-icon-set"), item => item.onclick = () => window.open('settings.html', '_self'));

// 进入历史页面
[].forEach.call(document.getElementsByClassName("layui-icon-time"), item => item.onclick = () => window.open('history.html', '_self'));

// 进入主页
[].forEach.call(document.getElementsByClassName("layui-icon-home"), item => item.onclick = () => window.open('index.html', '_self'));

function copyToClipboard(text) {
    let temp = document.createElement("input")
    document.getElementsByTagName("body")[0].append(temp)
    temp.value = text
    temp.select()
    document.execCommand("copy");
    temp.remove()
}