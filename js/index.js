var powerStatus = true;//初始化电源状态
$(document).ready(function(){
    let iconOldCss = {
        "color":$("#powerIcon").css("color"),
    };
    $(".power").bind('click',function(){
        powerStatus = !powerStatus;
        if(powerStatus){
            //执行开机
            $("#powerIcon").css({"color":"#01AAED"});
            $(".tv-left").children().fadeIn();
        }else{
            //执行关机
            $("#powerIcon").css({"color":"#393D49"});
            $(".tv-left").children().fadeOut();
        }
    });
});