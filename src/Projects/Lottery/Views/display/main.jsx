import "babel-polyfill";
import $ from "jquery";

$(document).ready(()=> {
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
    let nameArr = ["koala", ""];

    let end = 32;
    for (let i = 1; i <= end; i++) {
        let srcIndex = i == end ? 1 : i;
        let img = `<div class="img${i}" style="height:${image.height}px">`;
        img += `<img style="width:${image.width}px;height:${image.height}px" src="image/WechatIMG${srcIndex}.jpeg">`;
        img += `</div>`;
        dom += img;
    }

    $(".controll").css({
        left: 0.55 * w,
        top: blank.marginTop,
    });
    $(".controll").children(".line").children("button").css({
        width: 0.105 * w,
        height: 0.06 * h
    });
    $(".controll").children(".line").css({
        marginBottom: blank.height * 0.1
    });

    $(".controll").children(".speed").children("input").css({
        width: 0.105 * w - 20,
        height: 0.03 * h
    });

    $(".controll").children(".speed").children("input").delegate("", "input", function () {
        speed = $(this).val() == "" ? speed : $(this).val();
    });

    $(".list").css({
        left: blank.marginLeft + 0.05 * w,
        top: blank.marginTop,
        width: blank.width,
        height: image.height
    });
    $(".list").html(dom);

    let isScrolling = false;
    let speed = 50;
    let index = 1;

    $(".controll").children(".line").first().children("button").delegate("", "click", ()=> {
        if (!isScrolling) {
            isScrolling = true;
            doScroll();
        }
    });

    $(".controll").children(".line").last().children("button").delegate("", "click", ()=> {
        isScrolling = false;
    });

    let doScroll = ()=> {
        if (isScrolling) {
            $(".img1").animate({"margin-top": -image.height * index}, Number.parseInt(speed), "linear", ()=> {
                if (index == end) {
                    index = 1;
                    $(".img1").css({"margin-top": "0px"});
                } else {
                    index++;
                }
                doScroll();
            });
        }

    };

    doScroll();
});


