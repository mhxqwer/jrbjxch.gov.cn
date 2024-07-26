var whenReady = (function () {               //这个函数返回whenReady()函数
    var funcs = [];             //当获得事件时，要运行的函数
    var ready = false;          //当触发事件处理程序时,切换为true

    //当文档就绪时,调用事件处理程序
    function handler(e) {
        if (ready) return;       //确保事件处理程序只完整运行一次

        //如果发生onreadystatechange事件，但其状态不是complete的话,那么文档尚未准备好
        if (e.type === 'onreadystatechange' && document.readyState !== 'complete') {
            return;
        }

        //运行所有注册函数
        //注意每次都要计算funcs.length
        //以防这些函数的调用可能会导致注册更多的函数
        for (var i = 0; i < funcs.length; i++) {
            funcs[i].call(document);
        }
        //事件处理函数完整执行,切换ready状态, 并移除所有函数
        ready = true;
        funcs = null;
    }
    //为接收到的任何事件注册处理程序
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', handler, false);
        document.addEventListener('readystatechange', handler, false);            //IE9+
        window.addEventListener('load', handler, false);
    } else if (document.attachEvent) {
        document.attachEvent('onreadystatechange', handler);
        window.attachEvent('onload', handler);
    }
    //返回whenReady()函数
    return function whenReady(fn) {
        if (ready) { fn.call(document); }
        else { funcs.push(fn); }
    }
})();
whenReady(function () {
    console.log("DOMContentLoaded");
    var baseUrl = "//gov.govwza.cn/dist";
    var ariaAppId = window.ariaAppId || "883afef935e80177c6866006f0026248";
    //addAriaBtn(); 增加无障碍和适老化按钮
    if (typeof aria != "undefined") {
        document.getElementById("ariascripts").remove();
        window.aria = null;
    }
    localStorage.removeItem('aria');
    window.ariaAppId = null;
    loadAriaJS(function () {    //增加最新aria.js
        loadAudiovisualJs(function () { //增加视听js
            var title = document.getElementsByClassName("header");
            if (title.length > 0) {
                title = title[0];
                title = title.getElementsByTagName("h1");
                title = title[0];
                title.setAttribute("aria-playertitle", "true");
            }
            //增加 朗读与视听按钮
            addBtn();
        });
    })
    function loadAriaJS(callback) {
        if (window.aria) {
            callback();
            return;
        }
        var script = document.createElement('script'),
            fn = callback || function () { };
        script.type = 'text/javascript';
        script.setAttribute('id', 'ariadevscripts');
        script.setAttribute('aria-autofixedbtn', 'true');
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    fn();
                }
            };
        } else {
            script.onload = function () {
                fn();
            };
        }
        script.setAttribute('charset', 'utf-8')
        script.src = baseUrl + '/aria.js?appid=' + ariaAppId + '&v=' + Math.random();
        document.body.appendChild(script);
    }
    var loadAudiovisualJs = function (fn) {
        var script = document.createElement('script')
        script.type = 'text/javascript';
        script.id = "Aria-Audiovisual"
        script.setAttribute('charset', 'utf-8')
        script.setAttribute('useAbstract', 'false')
        script.src = baseUrl + '/audiovisual.js?v=' + Math.random();
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    fn();
                }
            };
        } else {
            script.onload = function () {

                fn();
            };
        }
        document.body.appendChild(script);
    }
})



function addBtn() {
    var style = document.createElement("style");
    style.innerText = `.header-right-box{line-height: 40px;
    text-align: center;    height: 40px;    left: 50%;
    position: relative;
    transform: translate(-50%, 10px);}`
    document.head.appendChild(style);
    var sdiv = document.getElementsByClassName("xiangqing");
    if (!sdiv) {
        return;
    }
    sdiv = sdiv[0]
    return audiovisual.addBtn(sdiv, ".xiangqing");
    // return audiovisual.addBtn(sdiv, downLoadWordFileFileBs);
}

function addAriaBtn() {
    var div = document.getElementsByClassName("header-menu");
    if (div.length == 0) {
        return;
    }
    div = div[0];
    var ul = div.getElementsByTagName("ul")
    if (ul.length == 0) {
        return;
    }
    ul = ul[0];

    var li1 = document.createElement("li");
    li1.innerHTML = "<a href='javascript:void(0)' onclick='top.aria.oldFixedStart()'>关怀版</a>"
    ul.append(li1);
    var li = document.createElement("li");
    li.innerHTML = "<a href='javascript:void(0)' onclick='top.aria.start()'>网站无障碍</a>"
    ul.append(li);
}


