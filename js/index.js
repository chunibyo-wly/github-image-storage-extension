layui.use(['upload', 'util', 'layer'], function () {
    let $ = layui.jquery,
        upload = layui.upload,
        layer = layui.layer,
        util = layui.util;

    // 拖拽上传
    let cnt = 0;
    let $dummy = $("#preview-board")
    upload.render({
        elem: '#id-upload-image',
        url: 'https://httpbin.org/post',
        multiple: true,
        done: function (res) {
            if (cnt % 3 === 0)
                $dummy.append('<div class="layui-row"></div><br>')
            cnt = cnt + 1
            let html = '' +
                '<div class="layui-col-xs4">' +
                '    <div class="crop">' +
                '        <img src="' + res.files.file + '" alt="失败">' +
                '    </div>' +
                '</div>'
            $dummy.find('div.layui-row').last().append(html)
            console.log(res)
        }
    });

    // 切换url类型
    let urlFormat = "1"
    let changeUrlFormat = function () {
        if (urlFormat === $(this).val()) return
        // 1. 全局变量保存url类型
        urlFormat = $(this).val()
        // 2. 被点击的按钮激活
        $(this).removeClass("layui-btn-primary")
        // 3. 移除已经激活的按钮
        $(this).siblings(":not(layui-btn-primary)").addClass("layui-btn-primary")
    }
    $("#url-format > .layui-btn").on("click", () => changeUrlFormat())
})