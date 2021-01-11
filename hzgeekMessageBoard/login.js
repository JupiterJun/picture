var $ = mdui.$;

function verified() {
    password = document.getElementById("name").value;
    AV.init({
        appId: "E3IPobYxvWSCTK61JgU7GAI4-gzGzoHsz",
        appKey: "SUNYFFblLPwrBaobvyfmiJgh",
        serverURL: "https://e3ipobyx.lc-cn-n1-shared.com"
    });
    const query = new AV.Query('password');
    query.get('5ffa77e7eaead00ab4bcaf98').then((todo) => {
        // todo 就是 objectId 为 582570f38ac247004f39c24b 的 Todo 实例
        const pswd = todo.get('password');
        if (pswd == password) {
            mdui.snackbar({ message: '验证成功！请稍候，正在加载' });
            window.location.href = "./main.html"
        }
        else {
            mdui.snackbar("认证失败，请检查信息是否无误",);
        }
    });
}
