var $ = mdui.$;
var noRobotAdd = true;
var noRobotVote = true;
var addSong = new mdui.Dialog('#addsong', { overlay: true });
var result = new mdui.Dialog('#result', { overlay: true });

AV.init({
    appId: "DhkPXk4YxzyyIN9Owjd5lATm-gzGzoHsz",
    appKey: "YAcwA9eXyCBoPqj9d3faam7M",
    serverURL: "https://dhkpxk4y.lc-cn-n1-shared.com"
});
checkCookie();

var voteItem = "zhong_20201212"

loadList();
loadResultList();

function checkCookie() {
    var name = getCookie("name");
    var onlyCode = getCookie("onlyCode");
    //console.log(name);
    //console.log(onlyCode);
    if (name == "" || onlyCode == "") {
        mdui.dialog({
            title: 'Oops! 出错了',
            content: '请重新登录',
            buttons: [
                {
                    text: '确认',
                    onClick: function (inst) {
                        window.location.href = "./index.html";
                        delCookie(name);
                        delCookie(onlyCode);
                    }
                }
            ]
        });
        return false;
    } else {
        const stu = new AV.Query('Students');
        stu.equalTo('onlyCode', onlyCode);
        stu.first().then((students) => {
            const realName = students.get('name');
            //console.log(realName);
            if (realName == name) {
                document.getElementById("userName").innerHTML = '<i class="mdui-menu-item-icon mdui-icon material-icons">&#xe7fd;</i>' + realName;
                return true;
            } else {
                mdui.dialog({
                    title: 'Oops! 出错了',
                    content: '请重新登录',
                    buttons: [
                        {
                            text: '确认',
                            onClick: function (inst) {
                                window.location.href = "./index.html";
                                delCookie(name);
                                delCookie(onlyCode);
                            }
                        }
                    ]
                });
                return false;
            }
        });
    }
}

function loadList() {
    const items = new AV.Query(voteItem + '_main');
    items.equalTo('type', 'music');
    items.find().then((Item) => {
        var List = '<div class="mdui-panel" mdui-panel><div class="mdui-panel-item"> <div class="mdui-panel-item-header"> <div class="mdui-panel-item-title">示例音乐</div> <div class="mdui-panel-item-summary">示例作者</div> <div class="mdui-panel-item-summary">这里显示添加者名字</div><i class="mdui-panel-item-arrow mdui-icon material-icons">keyboard_arrow_down</i> </div> <div class="mdui-panel-item-body"> <div class="mdui-chip"> <img class="mdui-chip-icon mdui-color-white" src="https://www.kugou.com/favicon.ico" /><span class="mdui-chip-title">酷狗音乐</span></div> <div class="mdui-chip"> <img class="mdui-chip-icon" src="https://y.qq.com/favicon.ico" /><span class="mdui-chip-title">QQ音乐</span> </div> <div class="mdui-chip"> <img class="mdui-chip-icon" src="https://s1.music.126.net/style/favicon.ico" /><span class="mdui-chip-title">网易云音乐</span></div><button class="mdui-btn mdui-color-theme-accent mdui-ripple mdui-float-right">投票</button> </div> </div>'
        for (index = 0; index < Item.length; index++) {
            //console.log(Item[index].id);
            //console.log(Item[index]._serverData.musicTitle);
            //console.log(Item[index]._serverData.musicArtist);
            List = List + '<div class="mdui-panel-item"><div class="mdui-panel-item-header"><div class="mdui-panel-item-title">' + Item[index]._serverData.musicTitle + '</div><div class="mdui-panel-item-summary">' + Item[index]._serverData.musicArtist + '</div><div class="mdui-panel-item-summary">由' + Item[index]._serverData.creatUser + '添加</div><i class="mdui-panel-item-arrow mdui-icon material-icons">keyboard_arrow_down</i></div><div class="mdui-panel-item-body"><div class="mdui-chip" onclick="window.open(\'https\\:\\/\\/www.kugou.com/yy/html/search.html#searchKeyWord=' + Item[index]._serverData.musicArtist + ' - ' + Item[index]._serverData.musicTitle + '\')"><img class="mdui-chip-icon mdui-color-white" src="https://www.kugou.com/favicon.ico" /><span class="mdui-chip-title">酷狗音乐</span></div><div class="mdui-chip" onclick="window.open(\'https\\:\\/\\/y.qq.com/portal/search.html#w=' + Item[index]._serverData.musicTitle + '-' + Item[index]._serverData.musicArtist + '\')"><img class="mdui-chip-icon" src="https://y.qq.com/favicon.ico" /><span class="mdui-chip-title">QQ音乐</span></div><div class="mdui-chip" onclick="window.open(\'https\\:\\/\\/music.163.com/#/search/m/?s=' + Item[index]._serverData.musicTitle + '-' + Item[index]._serverData.musicArtist + '\')"><img class="mdui-chip-icon" src="https://s1.music.126.net/style/favicon.ico" /><span class="mdui-chip-title">网易云音乐</span></div><button class="mdui-btn mdui-color-theme-accent mdui-ripple mdui-float-right" id="' + Item[index].id + '" onclick="clickVote(this.id)">投票</button></div></div>'
        }
        List = List + '</div>'
        document.getElementById("list").innerHTML = List
        mdui.mutation()
    });
}

function showResult() {
    user = getCookie("onlyCode");
    const usr = new AV.Query(voteItem + '_log');
    usr.equalTo('creatUid', user);
    usr.equalTo('type', 'voteMusic');
    usr.find().then((Usr) => {
        if (Usr.length == 0) {
            mdui.snackbar("只有投票后才能查看结果~",);
        } else {
            loadResultList();
            result.open();
        }
    });
}

function closeResult() {
    result.close();
}

function loadResultList() {
    const items = new AV.Query(voteItem + '_main');
    items.equalTo('type', 'music');
    items.descending('vote');
    items.find().then((Item) => {
        var List = '<div class="mdui-panel" mdui-panel>'
        for (index = 0; index < Item.length; index++) {
            //console.log(Item[index].id);
            //console.log(Item[index]._serverData.musicTitle);
            //console.log(Item[index]._serverData.musicArtist);
            indexx = index + 1;
            List = List + '<div class="mdui-panel-item"><div class="mdui-panel-item-header"><div class="mdui-panel-item-title">第' + indexx + '名 ' + Item[index]._serverData.musicTitle + '</div><div class="mdui-panel-item-summary">' + Item[index]._serverData.musicArtist + '</div><div class="mdui-panel-item-summary">得票数：' + Item[index]._serverData.vote + '</div><i            class="mdui-panel-item-arrow mdui-icon material-icons">keyboard_arrow_down</i></div><div class="mdui-panel-item-body"><div class="mdui-chip" onclick="window.open(\'https\\:\\/\\/www.kugou.com/yy/html/search.html#searchKeyWord=' + Item[index]._serverData.musicArtist + ' - ' + Item[index]._serverData.musicTitle + '\')"><img class="mdui-chip-icon mdui-color-white" src="https://www.kugou.com/favicon.ico" /><span class="mdui-chip-title">酷狗音乐</span></div><div class="mdui-chip" onclick="window.open(\'https\\:\\/\\/y.qq.com/portal/search.html#w=' + Item[index]._serverData.musicTitle + '-' + Item[index]._serverData.musicArtist + '\')">            <img class="mdui-chip-icon" src="https://y.qq.com/favicon.ico" /><span class="mdui-chip-title">QQ音乐</span></div><div class="mdui-chip" onclick="window.open(\'https\\:\\/\\/music.163.com/#/search/m/?s=' + Item[index]._serverData.musicTitle + '-' + Item[index]._serverData.musicArtist + '\')"><img class="mdui-chip-icon" src="https://s1.music.126.net/style/favicon.ico" /><span class="mdui-chip-title">网易云音乐</span></div>   由' + Item[index]._serverData.creatUser + '添加</div></div>'
        }
        List = List + '</div>'
        document.getElementById("resultList").innerHTML = List
        mdui.mutation()
    });
}

function changeUser() {
    document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "onlyCode=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "../";
}

function robotVerifiedAdd() {
    noRobotAdd = true
}

function checkIfAddedMusic() {
    user = getCookie("name");
    const usr = new AV.Query(voteItem + '_main');
    usr.equalTo('creatUser', user);
    usr.find().then((Usr) => {
        if (Usr.length == 0) {
            user = getCookie("onlyCode");
            const usr = new AV.Query(voteItem + '_log');
            usr.equalTo('creatUid', user);
            usr.equalTo('type', 'voteMusic');
            usr.find().then((Usr) => {
                if (Usr.length == 0) {
                    addSong.open();
                } else {
                    mdui.snackbar("您已经投过票了",);
                }
            });
        } else {
            mdui.snackbar("您已经添加过歌曲了",);
        }
    });
}

function addMusic() {
    if (noRobotAdd) {
        musicTitle = document.getElementById("songTitle").value;
        musicArtist = document.getElementById("songArtist").value;
        user = getCookie("name");
        if (true) {
            if (musicTitle == "") {
                mdui.alert("输入歌曲名！")
            } else {
                const usr = new AV.Query(voteItem + '_main');
                usr.equalTo('creatUser', user);
                usr.find().then((Usr) => {
                    if (Usr.length == 0) {
                        const add = new AV.Query(voteItem + '_main');
                        add.equalTo('musicTitle', musicTitle);
                        add.equalTo('musicArtist', musicArtist);
                        add.find().then((Add) => {
                            if (Add.length == 0) {
                                const Main = AV.Object.extend(voteItem + '_main');
                                const main = new Main();
                                main.set('musicTitle', musicTitle);
                                main.set('musicArtist', musicArtist);
                                main.set('type', 'music');
                                main.set('creatUser', user);
                                main.set('vote', 0);
                                main.save().then((main) => {
                                    //console.log(`保存成功。objectId：${main.id}`);
                                    addSong.close();
                                    var onlyCode = getCookie("onlyCode");
                                    var userAgent = navigator.userAgent
                                    const Log = AV.Object.extend(voteItem + '_log');
                                    const log = new Log();
                                    log.set('musicTitle', musicTitle);
                                    log.set('musicArtist', musicArtist);
                                    log.set('musicObjectId', main.id)
                                    log.set('type', 'addMusic');
                                    log.set('creatUser', user);
                                    log.set('creatUid', onlyCode);
                                    log.set('userAgent', userAgent);
                                    log.set('userIp', returnCitySN["cip"]);
                                    log.set('zipCode', returnCitySN["cid"]);
                                    log.set('userCity', returnCitySN["cname"]);
                                    log.save().then((log) => {
                                        //console.log(`日志保存成功。objectId：${log.id}`);
                                    });
                                    loadList();
                                    mdui.alert("成功添加 " + musicTitle + "-" + musicArtist);
                                }, (error) => {
                                    addSong.close();
                                    mdui.alert("未知错误，请重试")
                                });
                            } else {
                                mdui.alert("这首歌已经被添加过了")
                            }
                        });
                    } else {
                        addSong.close();
                        mdui.alert("您已经添加过歌曲了")
                    }
                });
            }
        }
    } else {
        document.getElementById("robotAdd").innerHTML = "请先完成人机验证";
    }
}

function clickVote(musicId) {
    mdui.dialog({
        title: '确认要投给这首歌吗',
        content: '每人只有一次投票机会，投票后不可更改。',
        buttons: [
            {
                text: '取消',
                blod: true,
                close: true
            },
            {
                text: '确认',
                blod: true,
                close: true,
                onClick: function (inst) {
                    vote(musicId);
                }
            }
        ]
    });
}

function vote(selectedMusic) {
    if (true) {
        selectedMusic = selectedMusic.trim();
        user = getCookie("onlyCode");
        const usr = new AV.Query(voteItem + '_log');
        usr.equalTo('creatUid', user);
        usr.equalTo('type', 'voteMusic');
        usr.find().then((Usr) => {
            if (Usr.length == 0) {
                const query = new AV.Query(voteItem + '_main');
                query.get(selectedMusic).then((todo) => {
                    const currentVote = todo.get('vote');
                    const musicTitle = todo.get('musicTitle');
                    const musicArtist = todo.get('musicArtist');
                    const sync = AV.Object.createWithoutData(voteItem + '_main', selectedMusic);
                    sync.set('vote', currentVote + 1);
                    sync.save();
                    var user = getCookie("name");
                    var onlyCode = getCookie("onlyCode");
                    var userAgent = navigator.userAgent
                    const Log = AV.Object.extend(voteItem + '_log');
                    const log = new Log();
                    log.set('musicTitle', musicTitle);
                    log.set('musicArtist', musicArtist);
                    log.set('musicObjectId', selectedMusic);
                    log.set('type', 'voteMusic');
                    log.set('creatUser', user);
                    log.set('creatUid', onlyCode);
                    log.set('userAgent', userAgent);
                    log.set('userIp', returnCitySN["cip"]);
                    log.set('zipCode', returnCitySN["cid"]);
                    log.set('userCity', returnCitySN["cname"]);
                    log.save().then((log) => {
                        //console.log(`日志保存成功。objectId：${log.id}`);
                    });
                });
                mdui.snackbar("投票成功",);
            } else {
                mdui.snackbar("投票失败，您已经投票过了",);
            }
        });
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return decodeURI(c.substring(name.length, c.length));
    }
    return "";
}
