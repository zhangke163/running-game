//绘制游戏人物对象
function person(canvas, cobj, runimg, jumpimg) {
    this.canvas = canvas;
    this.cobj = cobj;
    this.runimg = runimg;
    this.jumpimg = jumpimg;
    this.x = 0;
    this.y = 0;
    this.width = 83;
    this.height = 118;
    this.status = "runimg";
    this.state = 0; //保存人物奔跑过程中状态的下标

}
person.prototype = {  //人物上的方法
    draw: function () {  //将人物绘制到画布上
        var cobj=this.cobj;  //获取2d对象的上下文
        cobj.save(); //将状态保存起来
        cobj.translate(this.x,this.y);//人物移动的大小
        cobj.drawImage(this[this.status][this.state],0,0,827,1181,0,0,this.width,this.height);
        //将第一张人物图片绘制到画布中
        cobj.restore();//重新存储
    },
    animate: function (num,speed) { //人物移动的函数
           if(this.status=="runimg") { //如果是奔跑的图片，则不断更改奔跑的图片
               this.state = num % 7;  
           }else{
               this.state=0;//如果是不是奔跑的图片，则回到第一张图片的状态
           }
           this.x+=speed;  //不断得到移动的横向距离
           if(this.x>this.canvas.width/3){ //判断条件，如果移动的横向距离大于画布的三分之一时，停止继续向前移动
               this.x=this.canvas.width/3
           }

    },
    jump: function () { //人物跳起来的函数
        var that=this; 
        var flag=true;  //定义开关，防止人物不断的向上跳起
        touch.on(this.canvas,"touchstart",function(){ 
        	//调用touch.js使得其在移动端也可以使用

            if(!flag){
                return;
            }
            flag=false;
            var inita=0; //定义初始高度
            var speeda=10; //定义速度
            var currenty=that.y; //定义当前的跳起高度
            var r=100; 
            that.status="jumpimg"; //定义跳起来的图片是jump
            that.state=0;  //定义状态
            var t=setInterval(function(){ //每隔50ms向上跳起来
                inita+=speeda; //得到当前人物的高度
                if(inita>=180){ //如果人物向上跳起来的高度大于等于180时
                    that.status="runimg";//将图片更换成奔跑的图片
                    clearInterval(t);//清除时间函数
                    that.y=currenty; //得到跳起来的移动距离
                    flag=true;
                }else{

                    that.y=currenty- Math.sin(inita*Math.PI/180)*r;//？
                }

            },50)



        })
    }
}
// 障碍物
function hinder(canvas,cobj,hinderimg){
   this.canvas=canvas;
   this.cobj=cobj;
   this.hinderimg=hinderimg;
   this.x=0;
   this.y=0;
   this.width=56;
   this.height=40;
   this.state=0;
}
hinder.prototype={
    draw:function(){  //将障碍物画到页面中
        var cobj=this.cobj;
        cobj.save();
        cobj.translate(this.x,this.y);
        cobj.drawImage(this.hinderimg[this.state],0,0,564,400,0,0,this.width,this.height);
        cobj.restore();
    },
    animate:function(speed){ //障碍物的移动距离，人物向前移动，障碍物就向后移动
        this.x-=speed;
    }
}

// 得分项



//粒子动画，人物和障碍物撞击出现喷血效果

function lizi(canvas,cobj,x,y){
    this.x=x;
    this.y=y;
    this.canvas=canvas;
    this.cobj=cobj;
    this.r=2+2*Math.random();
    this.speedx=8*Math.random()-4;
    this.speedy=8*Math.random()-4;
    this.color="red";
    this.speedl=0.3;
}
lizi.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.fillStyle=this.color;
        this.cobj.beginPath();
        this.cobj.arc(0,0,this.r,0,2*Math.PI);
        this.cobj.fill();
        this.cobj.restore();
    },
    animate:function(){
        this.x+=this.speedx;
        this.y+=this.speedy;
        this.r-=this.speedl;
    }

}

function xue(canvas,cobj,x,y){
    var arr=[];
    for(var i=0;i<20;i++){
        arr.push(new lizi(canvas,cobj,x,y));
    }
    var t=setInterval(function(){
        for(var i=0;i<arr.length;i++){
            arr[i].draw();
            arr[i].animate();
            if(arr[i].r<0){
                arr.splice(i,1);
            }
        }
        if(arr.length<1){
            clearInterval(t);
        }

    },50)
}

function game(canvas, cobj, runimg, jumpimg,hinderimg) {  //游戏的函数
    this.canvas=canvas;  
    this.cobj=cobj;
    this.hinderimg=hinderimg;
    this.person = new person(canvas, cobj, runimg, jumpimg);  //调用游戏人物的函数
    this.speed=8;//定义速度
    this.hinderArr=[];//定义障碍物数组
    this.score=0;//定义得分
    this.currentscore=0; //定义当前分数
    this.life=3; //定义生命值
    this.step=2; //定义


}
game.prototype = {
    play: function () {  
        var that=this;
        var backpos=0;
        var personNum=0;
        var times=0;

        var randtime=Math.floor(3+6*Math.random())*1000;

        that.person.jump();
           setInterval(function(){
                times+=50;
               that.cobj.clearRect(0,0,that.canvas.width,that.canvas.height);

               if(times%randtime==0) {
                   randtime=Math.floor(3+6*Math.random())*1000;
                   var hidnderObj=new hinder(that.canvas, that.cobj, that.hinderimg);
                   hidnderObj.state=Math.floor(Math.random()*that.hinderimg.length);
                   hidnderObj.y=that.canvas.height-hidnderObj.height;
                   hidnderObj.x=that.canvas.width;
                   that.hinderArr.push(hidnderObj);
	                if(that.hinderArr.length>5){
	                    that.hinderArr.shift();
	                }
               }

               for(var i=0;i<that.hinderArr.length;i++){
                   that.hinderArr[i].draw();
                   that.hinderArr[i].animate(that.speed);

					//调用hitpix函数
                   if(hitPix(that.canvas,that.cobj,that.person,that.hinderArr[i])){
                       xue(that.canvas,that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2);
                       if(!that.hinderArr[i].hits){
                           that.life--;
                           if(that.life<0){

                               alert("game over!");
                               location.reload();
                           }
                           that.hinderArr[i].hits="hits";
                       }
                   }


                   if(that.hinderArr[i].x+that.hinderArr[i].width<that.person.x&&!that.hinderArr[i].hits){

                       if(!that.hinderArr[i].score) {
                           ++that.score;
                           ++that.currentscore;
                           if(that.currentscore%that.step==0){
                               that.step=that.currentscore*2;
                               that.currentscore=0;
                               that.speed+=1;

                           }



                           that.hinderArr[i].score="true";
                       }
                   }
               }
               personNum++
               that.person.draw();
               that.person.animate(personNum,that.speed);

               backpos-=that.speed;

               that.canvas.style.backgroundPositionX=backpos+"px";
           },50)

    }
}