var ctx,width=1200,height=600;
var airspace = [];
var max=10;
//38 40 37 39 上下左右
var headings={38:"up",40:"down",37:"left",39:"right"};

ctx=document.getElementById("surface");

var taget=0;

function Plane(sx,sy,heading,url){
    this.x=sx;
    this.y=sy;
    this.h=heading||"down";//up down left right
    this.img=url||"down.png";
    this.draw=drawPlane
    this.move=movePlane
}

function drawPlane(){
 //ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, true);
 ctx.save();

 if(this.degree){
    ctx.translate(this.x,this.y);
    ctx.rotate(this.degree * Math.PI / 180);
 }

 var img=new Image();
 img.src=this.img;
 img.onclick=function(e){
     console.log(e)
 }
 ctx.drawImage(img,this.x,this.y,40,40);
 if(this.degree){
    ctx.restore();
    ctx.translate(-this.x,-this.y);
 }
}

function movePlane(dx,dy){
    this.x+=dx;
    this.y+=dy;
}

var moving;
function start(){
    ctx=document.getElementById("surface").getContext('2d');
    moving= setInterval(refrash,200);
    tower();
}

window.onload=start;

function refrash(){
    ctx.clearRect(0,0, width, height);
    for (var i = 0; i < airspace.length; i++) {
        var hit=airspace[i];
        switch(hit.h){
            case "up":
            hit.img="plane.png";
            hit.move(0,-2);
            break;
            case "down":
            hit.img="down.png";
            hit.move(0,2)
            break;
            case "left":
            hit.img="left.png";
            hit.move(-2,0)
            break;
            case "right":
            hit.img="right.png";
            hit.move(2,0)
            break;
        }
        hit.draw();
      }
}

function rotate(n,deg){
    var plane=airspace[n];
    plane.degree=deg
    console.log(plane.x,plane.y)
}

function stop(){
    clearInterval(moving);
}

window.onkeyup=function(e){
  console.log(e.keyCode,headings[e.keyCode]);
  headings[e.keyCode]&&(airspace[taget].h=headings[e.keyCode]);
  //38 40 37 39 上下左右
}

function getRandom(max){
    var ran=Math.round(max*Math.random());
   return ran>=max?getRandom(max):ran;
}
var headinglist={0:"up",1:"down",2:"left",3:"right"}//上下左右
var imglist={0:"plane.png",1:"down.png",2:"left.png",3:"right.png"}

 

function tower(){
    
    getRandomPlane();
    getRandomPlane();

   setInterval(function(){
    if(airspace.length<max-2){
        getRandomPlane();
        getRandomPlane();
    }
   },5000)
}


function getRandomPlane(){
    //方向
    var heading=getRandom(4);
    var x,y,h;
    h=headinglist[heading];
    var img=imglist[heading];
    var times=100;
    var min=20;
    switch (heading){
        case 0://上
        y=height-100;
        x=getRandom(10)*times;
        break;
        case 1://下
        y=min;
        x=getRandom(10)*times;
        break;
        case 2://左
        x=width-300;;
        y=getRandom(6)*times;
        break;
        case 3://右
        x= min;
        y=getRandom(6)*times;
        break;
    }

    //还要检查飞机
    var plane=new Plane(x,y,h,img);
    console.log(x,y,plane);
    airspace.push(plane);
    //位置
}


//---------------------------------------
