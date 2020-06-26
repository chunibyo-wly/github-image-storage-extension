layui.use(['form'], function () {
    let $ = layui.$,
        form = layui.form,
        layer = layui.layer;

    // 监听提交
    form.on('submit(save)', function (data) {
        chrome.storage.sync.set(data.field, function () {
            layer.alert("保存成功")
        });


        return false;
    });

    chrome.storage.sync.get(['repoName', 'branchName', 'token'], function (result) {
        form.val("repo", result)
    });

});