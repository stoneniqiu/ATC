var ctx,width=1200,height=600;
var airspace = [];
var max=10;
var total=0,size=40,leave=0;
//38 40 37 39 上下左右
var headings={38:"up",40:"down",37:"left",39:"right"};
var airspeed={0:"H",1:"M",2:"S"}
var destination={0:"A",1:"B",2:"C",3:"D",4:"R"};
//速度 H M S

ctx=document.getElementById("surface");

var taget=null;

function Plane(id,sx,sy,heading,url){
    this.x=sx;
    this.y=sy;
    this.flightId=id;
    this.h=heading||"down";//up down left right
    this.img=url||"down.png";
    this.draw=drawPlane
    this.move=movePlane
    this.speed=airspeed[getRandom(3)];
    this.D=destination[getRandom(5)];
}
function getRandom(max,min){
    if(min&&min>=max){
        throw "min can't bigger than max!"
    }
    var ran=Math.round(max*Math.random());
    if(min&&ran<min){
      return getRandom(max,min);
    }
   return ran>=max?getRandom(max):ran;
}
function Runway(name,x,y,w,h){
    this.name=name;
    this.x=y;
    this.y=y;
    this.width=w;
    this.height=h;
    this.draw=drawRunway;
}

function drawRunway(){
   ctx.save();
 // console.log(this.x,this.y,this.width,this.height);
 ctx.beginPath();
 ctx.setLineDash([15,5]);
 ctx.lineWidth=2;
 ctx.strokeStyle="blue";
 ctx.moveTo(this.x,this.y+this.height/2);
 ctx.lineTo(this.x+this.width,this.y+this.height/2);
 ctx.stroke();
 ctx.restore();
 ctx.strokeStyle="black";
 ctx.strokeRect(this.x,this.y,this.width,this.height);
 ctx.fillText("R"+this.name,this.x+20,this.y+this.height/2);
 ctx.fillText("R27",this.x+this.width-40,this.y+this.height/2);
}
function drawPlane(){
// ctx.save();
 if(this.degree){
    ctx.translate(this.x,this.y);
    ctx.rotate(this.degree * Math.PI / 180);
 }
 var img=new Image();
 img.src=this.img;
 img.onclick=function(e){
     console.log(e)
 }
 ctx.drawImage(img,this.x,this.y,size,size);
 if(this.selected){
    ctx.strokeStyle="red";
    ctx.strokeRect(this.x,this.y,size,size)
 }

 if(this.degree){
    ctx.restore();
    ctx.translate(-this.x,-this.y);
 }

 //显示名字
 ctx.fillText(this.flightId+"_"+this.speed+"_"+this.D,this.x,this.y-5);

}

function movePlane(dx,dy){
    this.x+=dx;
    this.y+=dy;
    //边界检查
    if(this.x<0||this.x>width||this.y<0||this.y>height){
        console.log(this.flightId+"离开管制空域");
        airspace.splice(airspace.findIndex(item=>item.flightId==this.flightId),1)
        leave++;
        showPlaneNum();
    }
}
function Exit(name,x,y){
  this.name=name;
  this.x=x;
  this.y=y;
  this.draw=function(){
    ctx.strokeStyle="green";
    if(this.name=="B"||this.name=="D"){
        ctx.strokeRect(this.x,this.y,20,size*1.5);
        ctx.fillText(this.name,this.x+5,this.y+(size*1.5)/2);
    }else{
        ctx.strokeRect(this.x,this.y,size*1.5,20);
        ctx.fillText(this.name,this.x+size*1.5/2-5,this.y+15);
    }
    ctx.strokeStyle="black";
    
  }
}


var moving;
function start(){
    var canvas=document.getElementById("surface");
    ctx=canvas.getContext('2d');
    width=canvas.width;
    height=canvas.height;
    //增加跑道
    var runway=new Runway("09",120,120,200,80);
    airspace.push(runway)

    //增加出口
    airspace.push(new Exit("A",(width-size*1.5)/2,0))
    airspace.push(new Exit("B",width-20,(height-size*1.5)/2))
    airspace.push(new Exit("C",(width-size*1.5)/2,height-20))
    airspace.push(new Exit("D",0,(height-size*1.5)/2))

    moving= setInterval(refrash,200);
    eventDispature(canvas); 
    tower();
}
function eventDispature(canvas){
  canvas.onclick=function(e){
     console.log(e.offsetX,e.offsetY,e.type)
     detectEvent(e.offsetX,e.offsetY,e.type)
  }
}

function detectEvent(x,y,type){
  //判断是否击中
  airspace.forEach(function(p){
      //范围 x,x+size
      //y,y+size
      var maX=p.x+size;
      var maY=p.y+size;
      if(x>=p.x&&x<=maX&&y>=p.y&&y<=maY){
          p.selected=true;
          taget=p;
          console.log("选中",p.flightId,p.x,p.y)
          airspace.filter(n=>n.flightId!=p.flightId).forEach(n=>n.selected=false);
      }
  })

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
  
  headings[e.keyCode]&&(taget.h=headings[e.keyCode]);
  //38 40 37 39 上下左右
}


var headinglist={0:"up",1:"down",2:"left",3:"right"}//上下左右
var imglist={0:"plane.png",1:"down.png",2:"left.png",3:"right.png"}

 

function tower(){
    getRandomPlane();
    getRandomPlane();
   setInterval(function(){
    if(airspace.length<max){
        getRandomPlane();
    }
   },5000)
}
function showPlaneNum(){
    var span=document.getElementById("total");
    span.innerHTML=total;
    var le=document.getElementById("leave");
    le.innerHTML=leave;
}

function getRandomPlane(){
    //方向
    var heading=getRandom(4);
    var x,y,h;
    h=headinglist[heading];
    var img=imglist[heading];
    var min=20;
    switch (heading){
        case 0://上
        y=height-min;
        x=getRandom(width-min,min);
        break;
        case 1://下
        y=min;
        x=getRandom(width-min,min);
        break;
        case 2://左
        x=width-min;;
        y=getRandom(height-min,min);
        break;
        case 3://右
        x= min;
        y=getRandom(height-min,min);
        break;
    }

    //还要检查飞机
    var str="P"+ total++;
    var plane=new Plane(str,x,y,h,img);
    console.log(x,y,plane);
    airspace.push(plane);
    
    showPlaneNum();
    //位置
}


//---------------------------------------
