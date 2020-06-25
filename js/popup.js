layui.use('upload', function () {
    let $ = layui.jquery,
        upload = layui.upload;

    //拖拽上传
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
})