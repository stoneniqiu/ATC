var ctx,width=1200,height=600;
var airspace = [];
//38 40 37 39 上下左右
var headings={38:"up",40:"down",37:"left",39:"right"};

ctx=document.getElementById("surface");

var taget=0;

function Plane(sx,sy,heading){
    this.x=sx;
    this.y=sy;
    this.h=heading||"down";//up down left right
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
 img.src="down.png";
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
    //添加飞机
    for(var i=0;i<2;i++){
        var p=new Plane((i+1)*50,0);
        airspace.push(p);
    }
    moving= setInterval(refrash,500);
}

window.onload=start;

function refrash(){
    ctx.clearRect(0,0, width, height);
    for (var i = 0; i < airspace.length; i++) {
        var hit=airspace[i];
        switch(hit.h){
            case "up":
            hit.move(0,-2);
            break;
            case "down":
            hit.move(0,2)
            break;
            case "left":
            hit.move(-2,0)
            break;
            case "right":
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


//---------------------------------------
