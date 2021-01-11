var $ = mdui.$;
var noRobot = true;
function robotVerified() {
    noRobot = true
}

function verified() {
    if (noRobot) {
        onlyCode = document.getElementById("olcd").value;
        name = document.getElementById("name").value;
        AV.init({
            appId: "DhkPXk4YxzyyIN9Owjd5lATm-gzGzoHsz",
            appKey: "YAcwA9eXyCBoPqj9d3faam7M",
            serverURL: "https://dhkpxk4y.lc-cn-n1-shared.com"
        });
        const stu = new AV.Query('Students');
        stu.equalTo('onlyCode', onlyCode);
        stu.first().then((students) => {
            const realName = students.get('name');
            //console.log(realName);
            if (realName == name) {
                document.cookie = "name=" + encodeURI(name) + "; path=/";
                document.cookie = "onlyCode=" + encodeURI(onlyCode) + "; path=/";
                if (onlyCode == 21803880 || onlyCode == 21910002) {
                    mdui.snackbar({message: '验证成功！请稍候，正在加载'});
                    window.location.href = "./nan/index.html"
                }
                if (onlyCode <= 21905260 && onlyCode >= 21904309) {
                    mdui.snackbar({message: '验证成功！请稍候，正在加载'});
                    window.location.href = "./zhong/index.html"
                }
            }
            else {
                mdui.snackbar("认证失败，请检查信息是否无误",);
            }
        });

    } else {
        mdui.snackbar("请先完成人机验证",);
    }
}
