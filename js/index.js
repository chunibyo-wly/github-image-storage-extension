layui.use(['upload', 'util', 'layer'], function () {
    let $ = layui.jquery,
        upload = layui.upload,
        layer = layui.layer,
        util = layui.util;

    // ================== 切换url类型 ==================
    let urlFormat = "0"
    $("#url-format > .layui-btn").on("click", function () {
        if (urlFormat === $(this).val()) return
        // 1. 全局变量保存url类型
        urlFormat = $(this).val()
        // 2. 被点击的按钮激活
        $(this).removeClass("layui-btn-primary")
        // 3. 移除已经激活的按钮
        $(this).siblings(":not(layui-btn-primary)").addClass("layui-btn-primary")
    })

    // ================== 切换url类型 ==================

    function copyToClipboard(text) {
        let $temp = $("<input>");
        $("body").append($temp);
        $temp.val(text).trigger('select');
        document.execCommand("copy");
        $temp.remove();
    }

    // 0: Markdown
    // 1: HTML
    // 2: URL
    // 3: UBB
    let handleClick = function () {
        let url = $(this).attr('src')
        switch (urlFormat) {
            case "0":
                copyToClipboard(`![](${url})`)
                break
            case "1":
                copyToClipboard(`<img src=${url} alt=""/>`)
                break
            case "2":
                copyToClipboard(url)
                break
            case "3":
                copyToClipboard(`[IMG]${url}[/IMG]`)
                break
        }
    }

    // ================== 上传 ======================
    // blob to base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    // ajax队列(github无法同时处理多个commit)
    let pushAjax = function (ajaxQueue, cnt, $dummy) {
        if (ajaxQueue.length !== 0)
            $.ajax(ajaxQueue.shift()).done(function (response) {
                if (cnt === 0) $dummy.empty()
                if (cnt % 3 === 0)
                    $dummy.append(`<div class="layui-row"></div><br>`)
                let html = `
                    <div class='layui-col-xs4'>
                        <div class='crop' value=${response.content['download_url']}>
                            <img src=${response.content['download_url']} alt="失败">
                        </div>
                    </div>
                `
                $dummy.find('div.layui-row').last().append(html)
                pushAjax(ajaxQueue, cnt + 1, $dummy)
            });
        else
            $('.crop').on('click', 'img', undefined, handleClick)
    }

    // 读取配置文件后发送push请求
    let uploadFile = function (files) {
        let fileList = []
        for (let i = 0; i < files.length; i++) fileList.push(files[i])

        let ajaxQueue = []
        chrome.storage.sync.get(['repoName', 'branchName', 'token'], async function (result) {
            await Promise.all(fileList.map(async (item, index) => {
                let base64Img = await toBase64(item)
                base64Img = base64Img.substr(base64Img.indexOf(',') + 1)
                let date = new Date()
                let settings = {
                    "url": "https://api.github.com/repos/" + result["repoName"] + "/contents/" + date + item['name'],
                    "method": "PUT",
                    "timeout": 0,
                    "headers": {
                        "Authorization": "token " + result['token'],
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({"message": date, "content": base64Img, "branch": result["branchName"]}),
                };
                ajaxQueue.push(settings)
            }))

            pushAjax(ajaxQueue, 0, $("#preview-board"))
        });
    }
    // ================== 上传 ======================

    // ================== 拖拽上传 ==================
    let $uploadImage = $("#id-upload-image")
    $uploadImage.on('dragenter', e => {
        e.stopPropagation();
        e.preventDefault();
    })
    $uploadImage.on('dragover', e => {
        e.stopPropagation();
        e.preventDefault();
    })
    $uploadImage.on('drop', e => {
        if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
            e.preventDefault();
            e.stopPropagation();
            uploadFile(e.originalEvent.dataTransfer.files);
        }
    })
    // 拖拽上传

    // ================== 点击上传 ==================
    let $fileInput = $("#id-file-input")

    // 点击按钮触发 <input type='file'>
    $uploadImage.on('click', () => $fileInput.trigger('click'))

    // 选择文件后 <input type='file'> 会有change event
    $fileInput.on('change', e => uploadFile(e.target.files))
    // ================== 点击上传 ==================
})