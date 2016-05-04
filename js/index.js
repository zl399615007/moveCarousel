var ary = ["img/banner1.jpg", "img/banner2.jpg", "img/banner3.jpg", "img/banner4.jpg", "img/banner5.jpg"], count = ary.length;
var winW = document.documentElement.clientWidth;

var banner = document.getElementById("banner"),
    bannerInner = banner.firstElementChild,
    bannerTip = banner.lastElementChild;

var divList = bannerInner.getElementsByTagName("div"),
    imgList = bannerInner.getElementsByTagName("img"),
    tipList = bannerTip.getElementsByTagName("li");

//->�����ֲ�ͼ����Ŀ��:ͼƬ������+2(ǰ����Ҫ�෽һ��) * ��Ļ�Ŀ��
bannerInner.style.width = winW * (count + 2) + "px";

//->���ݰ�:ƴ���ַ���
~function () {
    var str = "", str2 = "";
    //ƴ�ӵ����ֲ�ͼ�����HTML
    str += "<div><img src='' trueImg='" + ary[count - 1] + "'/></div>";
    for (var i = 0; i < count; i++) {
        str += "<div><img src='' trueImg='" + ary[i] + "'/></div>";
        //->ƴ�ӽ���������ַ���
        var strClass = i === 0 ? "bg" : null;
        str2 += "<li class='" + strClass + "'></li>";
    }
    str += "<div><img src='' trueImg='" + ary[0] + "'/></div>";
    bannerInner.innerHTML = str;
    bannerTip.innerHTML = str2;
}();

//->����ÿһ��ͼƬ����Ŀ��ֵ
[].forEach.call(divList, function (curDiv, index) {
    curDiv.style.width = winW + "px";
});

//->ͼƬ���ӳټ���
window.setTimeout(function () {
    [].forEach.call(imgList, function (curImg, index) {
        var oImg = new Image;
        oImg.src = curImg.getAttribute("trueImg");
        oImg.onload = function () {
            curImg.src = this.src;
            curImg.className = "imgMove";
            oImg = null;
        }
    });
}, 500);

//->�������
function changeTip() {
    var temp = step;
    temp > count ? temp = 1 : null;
    temp < 1 ? temp = count : null;
    [].forEach.call(tipList, function (curTip, index) {
        curTip.className = index + 1 === temp ? "bg" : null;
    });
}

//->�Զ��ֲ�
var step = 1, interval = 2000, autoTimer = null, autoDelay = null;
autoTimer = window.setInterval(autoMove, interval);
function autoMove() {
    bannerInner.style.webkitTransitionDuration = "0.3s";
    step++;
    bannerInner.style.left = -winW * step + "px";
    //->���˶������һ��ͼƬ��ʱ��,��������ع鵽��ʵ�ĵ�һ��ͼƬλ��
    if (step > count) {
        window.setTimeout(function () {
            bannerInner.style.webkitTransitionDuration = "0s";
            bannerInner.style.left = -winW + "px";
            step = 1;
        }, 300);
    }
    changeTip();
}

//->ʵ�������л�
//->���ҳ���е�ĳһ��Ԫ�ذ�touchmove�����Ϊ,��Ҫ��ǰ�������touchmove����¼�Ĭ�ϵ���Ϊ����ֹ��
document.addEventListener("touchmove", function (e) {
    e.preventDefault();
}, false);

["start", "move", "end"].forEach(function (item, index) {
    bannerInner.addEventListener("touch" + item, eval(item), false);
});

function start(e) {
    window.clearInterval(autoTimer);
    window.clearInterval(autoDelay);

    var touchPoint = e.touches[0];
    this["strX"] = touchPoint.clientX;
    this["strY"] = touchPoint.clientY;
    this["strL"] = parseFloat(window.getComputedStyle(this, null)["left"]);
}

function move(e) {
    var touchPoint = e.touches[0];
    this["curX"] = touchPoint.clientX;
    this["curY"] = touchPoint.clientY;

    //->��⵱ǰ�Ƿ��ǻ���
    this["isFlag"] = swipeFlag(this["strX"], this["curX"], this["strY"], this["curY"]);
    if (this["isFlag"]) {
        //->��ȡ�����ķ���,ֻ�����һ�����ʱ�����ǲŽ�����صĲ���
        this["swipeDir"] = swipeDirection(this["strX"], this["curX"], this["strY"], this["curY"]);
        if (/^(Left|Right)$/.test(this["swipeDir"])) {
            this["changeX"] = this["curX"] - this["strX"];
            this["curL"] = this["changeX"] + this["strL"];
            //->�߽��ж�
            this.style.webkitTransitionDuration = "0s";
            if (this["curL"] > 0) {
                this.style.left = "0px";
            } else if (this["curL"] < -(count + 1) * winW) {
                this.style.left = -(count + 1) * winW + "px";
            } else {
                this.style.left = this["curL"] + "px";
            }
        }
    }
}

function end(e) {
    //->��������,���ǹ�һ��ʱ���ڿ����Զ��ֲ�
    autoDelay = window.setTimeout(function () {
        autoTimer = window.setInterval(autoMove, interval);
    }, interval);
    //->���û�з����ƶ�,���ǲ���Ҫ��ִ�������Ĳ�����
    if (!this["isFlag"]) {
        return;
    }

    if (this["swipeDir"] === "Left") {//->����
        if (Math.abs(this["changeX"]) > winW / 4) {
            step++;
        }
    } else {//->���һ�
        if (Math.abs(this["changeX"]) > winW / 4) {
            step--;
        }
    }
    this.style.webkitTransitionDuration = "0.3s";
    this.style.left = -step * winW + "px";
    changeTip();

    var _this = this;
    if (step < 1) {//->�Ѿ�������߽�
        window.setTimeout(function () {
            _this.style.webkitTransitionDuration = "0s";
            step = count;
            _this.style.left = -step * winW + "px";
        }, 300);
    } else if (step > count) {//->�Ѿ������ұ߽�
        window.setTimeout(function () {
            _this.style.webkitTransitionDuration = "0s";
            step = 1;
            _this.style.left = -step * winW + "px";
        }, 300);
    }

    //->���������õ��Զ����������
    ["strX", "strY", "strL", "curX", "curY", "curL", "changeX", "isFlag", "swipeDir"].forEach(function (item) {
        this[item] = null;
    }, this);
}

//->����Ƿ�Ϊ����
//x1:x�����ʼλ�� x2:x��Ľ���λ�� y1:y�����ʼλ�� y2:y��Ľ���λ��
    function swipeFlag(x1, x2, y1, y2) {
        return Math.abs(x2 - x1) > 30 || Math.abs(y2 - y1) > 30;
    }
    
    //->�������ǻ����ķ���
    function swipeDirection(x1, x2, y1, y2) {
        var changeX = x2 - x1, changeY = y2 - y1;
        return Math.abs(changeX) > Math.abs(changeY) ? (changeX < 0 ? "Left" : "Right") : (changeY < 0 ? "Up" : "Down");
    }