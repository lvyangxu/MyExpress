import "babel-polyfill";
import $ from "jquery";

let dom = "";
let w = $(window).width();
let h = 566 / 1000 * w;

let blank = {
    marginLeft: 0.310 * w,
    marginTop: 0.416 * h,
    width: 0.377 * w,
    height: 0.212 * h
};

let imageWHRatio = 1;

let image = {
    height: Math.round(blank.height, 0),
    width: Math.round(blank.height * imageWHRatio)
};

for (let i = 1; i <= 29; i++) {
    let img = `<div class="img${i}" style="height:${image.height}px"><img style="width: ${image.width}px;height:${image.height}px" src="image/WechatIMG${i}.jpeg"></div>`;
    dom += img;
}

$(".list").css({
    left: blank.marginLeft,
    top: blank.marginTop,
    width: blank.width,
    height: image.height * 3
});
$(".list").html(dom);

let doScroll = ()=> {
    $(".img1").animate({"margin-top": -image.height * 29}, 6000, "linear", ()=> {
        $(".img1").css({"margin-top": "0px"});
        doScroll();
    });
};

doScroll();

