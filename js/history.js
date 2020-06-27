layui.use(['jquery', 'laypage'], function () {
    let $ = layui.$,
        laypage = layui.laypage;

    let handleClick = function () {
        copyToClipboard(`![](${$(this).attr('src')})`)
    }

    let $dummy = $("#image-board")

    let drawImage = function (imageList) {
        $dummy.empty()
        imageList.map((image, index) => {
            if (index === 0) $dummy.empty()
            if (index % 3 === 0)
                $dummy.append(`<div class="layui-row"></div><br>`)
            let html = `
                    <div class='layui-col-xs4'>
                        <div class='crop' value=${image['download_url']}>
                            <img src=${image['download_url']} alt="失败">
                        </div>
                    </div>
                `
            $dummy.children('div.layui-row').last().append(html)
        })
        $('.crop').on('click', 'img', undefined, handleClick)
    }

    // 读取配置文件后发送get请求
    let getFiles = function () {
        chrome.storage.sync.get(['repoName', 'branchName', 'token'], function (result) {
            let settings = {
                "url": `https://api.github.com/repos/${result.repoName}/contents?ref=${result.branchName}`,
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "Authorization": `token ${result.token}`
                },
            };

            $.ajax(settings).done(function (response) {
                console.log(response.length)
                laypage.render({
                    elem: 'id-laypage',
                    count: response.length,
                    limit: 9,
                    jump: function (obj, first) {
                        console.log((obj.curr - 1) * 9, obj.curr * 9 - 1)
                        drawImage(response.slice((obj.curr - 1) * 9, obj.curr * 9))
                    }
                });
            });
        });
    }

    getFiles();

});