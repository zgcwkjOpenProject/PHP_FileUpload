//显示通知内容
if (getData('bulletin') == null) {
    setData('bulletin', true);
    document.getElementsByClassName('content')[0].style.display = 'block';
    document.getElementsByClassName('operating')[2].style.display = 'block';
    setTimeout(function () {
        document.getElementsByClassName('content')[0].style.display = 'none';
        document.getElementsByClassName('operating')[0].style.display = 'none';
        document.getElementsByClassName('operating')[1].style.display = 'none';
        document.getElementsByClassName('operating')[2].style.display = 'none';
    }, '3000');
}
//关闭接收打开发送
function goOpenSend() {
    document.getElementsByClassName('operating')[1].style.width = 0 + 'px';
    document.getElementsByClassName('operating')[1].style.height = 0 + 'px';
    document.getElementsByClassName('operating')[0].style.width = 300 + 'px';
    document.getElementsByClassName('operating')[0].style.height = 300 + 'px';
    document.getElementsByClassName('content')[0].style.display = 'block';
    document.getElementsByClassName('operating')[1].style.display = 'none';
    document.getElementsByClassName('operating')[0].style.display = 'block';
    goCloseOk = false;
}
//关闭发送打开接收
function goOpenReceive() {
    document.getElementsByClassName('operating')[0].style.width = 0 + 'px';
    document.getElementsByClassName('operating')[0].style.height = 0 + 'px';
    document.getElementsByClassName('operating')[1].style.width = 300 + 'px';
    document.getElementsByClassName('operating')[1].style.height = 300 + 'px';
    document.getElementsByClassName('content')[0].style.display = 'block';
    document.getElementsByClassName('operating')[0].style.display = 'none';
    document.getElementsByClassName('operating')[1].style.display = 'block';
    goCloseOk = false;
}
//关闭标识
var goCloseOk = false;
//阻止关闭
function setCloseOk() {
    goCloseOk = true;
}
//全部关闭
function goClose() {
    if (goCloseOk) { goCloseOk = false; return; }
    document.getElementsByClassName('operating')[0].style.width = 0 + 'px';
    document.getElementsByClassName('operating')[0].style.height = 0 + 'px';
    document.getElementsByClassName('operating')[1].style.width = 0 + 'px';
    document.getElementsByClassName('operating')[1].style.height = 0 + 'px';
    setTimeout(function () {
        document.getElementsByClassName('content')[0].style.display = 'none';
        document.getElementsByClassName('operating')[0].style.display = 'none';
        document.getElementsByClassName('operating')[1].style.display = 'none';
        document.getElementsByClassName('operating')[2].style.display = 'none';
        document.getElementsByClassName('load')[0].style.display = 'none';
    }, '200');
    goCloseOk = false;
}
//浏览器数据库
function getData(key) {
    return localStorage.getItem(key);
}
function setData(key, values) {
    localStorage.setItem(key, values);
}
function delData(key) {
    localStorage.removeItem(key);
}