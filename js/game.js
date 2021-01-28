window.onload = function(){
    var game = document.getElementById("game");
    var birdEle = document.getElementById("bird");
    
    var soundFly = document.createElement("audio");//点击bird飞翔音乐
    
    var soundCheck = document.createElement("audio");//bird碰撞音乐
    soundCheck.setAttribute("src","audio/check.mp3");
    
    var soundHint = document.createElement("audio");//过一个管道提示音乐
    soundHint.setAttribute("src","audio/hint.mp3");

    var scoreNum = document.getElementById("score-num");
    scoreNum.innerHTML = '0';

    var newGame = document.getElementById("newGame");//新游戏按钮
    newGame.addEventListener('click',function(){
        window.parent.location.reload()
    });

    var playOrpause = document.getElementById("playOrpause");//暂停游戏按钮
    playOrpause.addEventListener('click',function(){
        if(runing){
            runing = false;
            gamePause('pause');
            playOrpause.children[0].innerHTML = "继续";
        }else{
            if(!document.querySelector('.gameoverImg')){ //如果不存在游戏结束画面，则继续游戏
                runing = true;
                gamePause('play');
                playOrpause.children[0].innerHTML = "暂停"; 
            }else{ //否则显示game over!
                alert("game over!");
            }
        }
    });
    
    //初始化背景图参数
    var sky = {
        x : 0 //水平速度(后面移动速度为小鸟的水平移动速度)
    }

    //初始化bird鸟参数
    var bird = {
        speedX : 5, //水平速度
        speedY : 0, //垂直速度
        x : birdEle.offsetLeft,//x轴偏移量
        y : birdEle.offsetTop,//y轴偏移量
    
        selfWidth : birdEle.offsetWidth,//自身宽(不带单位)
        selfHeight : birdEle.offsetHeight,//自身高(不带单位)
    }

    //初始化游戏计分数据
    var gameNum = { 
        score : 0 , //游戏分数
    }

    var runing = true;//初始化游戏状态
    //定时器（动画）
    var gameStart = window.setInterval(function(){
        if(runing == true){
            //小鸟向前运动(背景图向后移动)
            sky.x -= bird.speedX;
            game.style.backgroundPositionX = sky.x +'px';
            //小鸟像下运动
            bird.speedY += 1; //加速度
            bird.y += bird.speedY;
            
            if(bird.y <= 0){ //小鸟触碰上边界
                runing = false;
                bird.y = 0;
                playSound("check");
                bangImg();
                gameover();
            }
            if(bird.y + birdEle.offsetHeight > game.offsetHeight){ //小鸟触碰下边界
                runing = false;
                bird.y = game.offsetHeight - birdEle.offsetHeight;
                playSound("check");
                bangImg();
                gameover();
            }
        
            birdEle.style.top = bird.y + 'px'; 
        }
    },30);

    //点击事件，小鸟向上运动
    game.addEventListener('click',function(){
        playSound('fly');
        bird.speedY = -10;
        birdEle.style.background = "url('images/birds.png') -113px -8px no-repeat";
        window.setTimeout(function(){
            birdEle.style.background = "url('images/birds.png') -10px -8px no-repeat";
        },100);
    });

    //创建管道
    for(let i=0; i< 5; i++){
        createPipe((i+3)*170);
    }

    //创建管道方法(形参position 创建管道位置)
    function createPipe(position){
        //参数
        var pipe = {};
        pipe.x = position,//水平位置
        //规定管道高度200~300之间 ，上下管道间隔为200
        pipe.uHeight = 200 + parseInt(Math.random()*100); //上管道高度
        pipe.dHeight = 600 - pipe.uHeight -200;//下管道高度
        pipe.dTop = pipe.uHeight + 200;//下管道的top偏移量
    
        //上管道
        var uPipe = document.createElement("div");
        uPipe.style.width = '52px';
        uPipe.style.height = pipe.uHeight + 'px';
        uPipe.style.background = "url('images/pipe2.png') no-repeat center bottom";
        uPipe.style.position = 'absolute';
        uPipe.style.top = 0 +'px';
        uPipe.style.left = pipe.x +'px';
        game.appendChild(uPipe);//在game节点创建子节点元素(上管道)
    
        //下管道
        var dPipe = document.createElement("div");
        dPipe.style.width = '52px';
        dPipe.style.height = pipe.dHeight + 'px';
        dPipe.style.background = "url('images/pipe1.png') no-repeat center top";
        dPipe.style.position = 'absolute';
        dPipe.style.top = pipe.dTop +'px';
        dPipe.style.left = pipe.x +'px';
        game.appendChild(dPipe);//在game节点创建子节点元素(下管道)
    
        //让管道运动
        window.setInterval(function(){
            if(runing == true){
                pipe.x -= bird.speedX/7 ;//管道移动速度
                uPipe.style.left = pipe.x +'px';
                dPipe.style.left = pipe.x +'px';
                if(pipe.x < -uPipe.offsetWidth){
                    pipe.x = 800;
                }
                if(bird.x + bird.selfWidth == uPipe.offsetLeft + uPipe.offsetWidth+10 ){ //记分策略
                    playSound("hint");  
                    gameNum.score += 1;
                    scoreNum.innerHTML = gameNum.score;
                }
                var uCheck = bird.x + bird.selfWidth > pipe.x && bird.x < pipe.x + uPipe.offsetWidth && bird.y < pipe.uHeight;
                var dCheck = bird.x + bird.selfWidth > pipe.x && bird.x < pipe.x + dPipe.offsetWidth && bird.y+bird.selfWidth > pipe.dTop;
                if(uCheck || dCheck){ //碰撞上管道或下管道，停止游戏
                    runing = false;
                    playSound("check");
                    bangImg();
                    gameover();
                }
            }
        },10);
    }

    //播放动作音乐方法
    function playSound(act){
        if(act == 'fly'){
            soundFly.setAttribute("src","audio/fly.mp3");
            soundFly.play();
        }
        if(act == 'check'){
            soundCheck.play();
        }
        if(act == 'hint'){
            soundHint.play();
        }
    }
    
    //游戏暂停或继续方法
    function gamePause(act){
        if(act == 'pause'){
            var gamepauseImg = document.createElement("div");
            document.querySelector(".tv-left").style.position = "relative";
            gamepauseImg.setAttribute('class','gamepauseImg');
            gamepauseImg.style.width = "800px";
            gamepauseImg.style.height ="600px";
            gamepauseImg.style.background = "url('images/pause.png')";
            gamepauseImg.style.zIndex = "99999999";
            gamepauseImg.style.position = 'absolute';
            gamepauseImg.style.top = "0";
            gamepauseImg.style.left = "0";
            game.style.opacity = "0.2";
            document.querySelector(".tv-left").appendChild(gamepauseImg);
        }
        if(act == 'play'){
            document.querySelector(".tv-left").removeChild(document.querySelector(".gamepauseImg"));
            game.style.opacity = "1";
        }
    }
    //游戏结束方法
    function gameover(){
        if(game.style.display =='none'){ //若已关机，则不显示游戏结束
            return;
        }
        document.querySelector(".tv-left").style.position = "relative";
        var gameoverImg = document.createElement("div");
        gameoverImg.setAttribute('class','gameoverImg');
        gameoverImg.style.width = "800px";
        gameoverImg.style.height ="600px";
        gameoverImg.style.background = "url('images/gameover.png')";
        gameoverImg.style.zIndex = "99999999";
        gameoverImg.style.position = 'absolute';
        gameoverImg.style.top = "0";
        gameoverImg.style.left = "0";
        let i=9;
        var opacityTimer = setInterval(()=>{
            i--;
            if(i==2){
                game.style.opacity = "0."+i+"";
                clearInterval(opacityTimer);
            }else{
                game.style.opacity = "0."+i+"";
            }
        },30);
        document.querySelector(".tv-left").appendChild(gameoverImg);
    }

    //显示爆炸动画方法
    function bangImg(){
        let i=0;
        var bangTimer = window.setInterval(function(){
            i++;
            if(i==17){
                birdEle.style.background = "url('images/bangImg/e"+i-1+".gif') -2px -1px no-repeat";
                birdEle.style.backgroundSize = "80% auto";
                window.clearInterval(bangTimer);
                return ;
            }else{
                birdEle.style.background = "url('images/bangImg/e"+i+".gif') -2px -1px no-repeat";
                birdEle.style.backgroundSize = "80% auto";
            }
        },150);
    }
}