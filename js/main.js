var ctx,width=1200,height=600,ea,eb,ec,ed;
var airspace = [];
//空域中最大容量
var max=10;
//需指挥的飞机总数
var taskTotal=20;
var total=0,size=40,leave=0,runway,score=0;
//38 40 37 39 上下左右
var headings={38:"up",40:"down",37:"left",39:"right"};
//速度 H M S
var airspeed={0:"H",1:"M",2:"S"}
var magntude={"H":3,"M":2,"S":1}
var destination={0:"A",1:"B",2:"C",3:"D",4:"R"};
//states
var states={"cruise":"cruise","crash":"crash","landing":"landing","stop":"stop"}
ctx=document.getElementById("surface");
var headinglist={0:"up",1:"down",2:"left",3:"right"}//上下左右
var imglist={0:"plane.png",1:"down.png",2:"left.png",3:"right.png"}

 
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
    this.state="cruise";
    this.width=size;
    this.height=size;
    this.getCenter=getCenter;
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
    this.getCenter=getCenter;
}
function getCenter(){
    return{
        x:this.x+this.width/2,
        y:this.y+this.height/2
    }
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
 check(this);
}
//判断飞机是否相撞或离开
function check(plane){
  //先与其他飞机判断
  var otherplane=airspace.filter(n=>n.flightId!=plane.flightId&&n.flightId&&n.state!=states.crash);
  otherplane.forEach(function(p){
       if(plane.state!=states.crash&&isIntersect(p,plane)){
           console.warn(plane.flightId+"与"+p.flightId+"相撞了");
           info(plane.flightId+"与"+p.flightId+"相撞了");
           p.state=states.crash;
           plane.state=states.crash;
           p.selected=false;
           removePlane(plane.flightId);
           removePlane(p.flightId);
       }
  })
  //检查跑道 从左右两边进入
  //先判断是否与跑道相交
  if(isIntersect(plane,runway)&&plane.state==states.cruise){
    console.warn(plane.flightId+"进入跑道");
    //进入跑道的条件是 左边的两个点 和右边的两个点
    var y1=plane.y;
    var y2=plane.y+plane.height;
        //速度最慢，方向是跑道才能得分
    if(y1>runway.y&&y1<runway.y+runway.height&&y2>runway.y&&y2<runway.y+runway.height
      &&plane.D==destination[4]&&plane.speed==airspeed[2])
        {
        plane.state=states.landing;
        score+=5;
        info(plane.flightId+"正确降落跑道");
        showPlaneNum();
        plane.state=states.stop;
        removePlane(plane.flightId);
    }else{
        plane.state=states.crash;
        info(plane.flightId+"坠毁，航向"+plane.h+",速度"+plane.speed);
        removePlane(plane.flightId);
    }
      
  }
  
  //检查入口
  //得分
}
function isIntersect(p1,p2){
    var center=p1.getCenter();
    var c1=p2.getCenter();
     var dx=Math.abs(center.x-c1.x);
     var dy=Math.abs(center.y-c1.y);
     return dx<(p1.width/2+p2.width/2)&&dy<(p1.height/2+p2.height/2)
   }
function movePlane(dx,dy){
    if(this.state==states.crash||this.state==states.stop) return;
    this.x+=dx;
    this.y+=dy;
    //边界检查
    if(this.x<0||this.x>width||this.y<0||this.y>height){
       
        //判断四个入口
        var exit,key;
        switch(this.h){
            case "up":
            exit=ea;
            key="A";
            break;
            case "down":
            exit=ec;
            key="C";
            break;
            case "left":
            exit=ed;
            key="D";
            break;
            case "right":
            exit=eb;
            key="B";
            break;
        }
        var append="";
        if(isIntersect(this,exit)&&this.D==key&&this.speed!="H"){
           if((key=="A"||key=="C")&&(this.x>=exit.x&&this.x<=exit.x+exit.width)
        &&(this.x+this.width>=exit.x&&this.x+this.width<=exit.x+exit.width)){
            //得分
            score+=5;
            append="正确";
          }
          if((key=="B"||key=="D")&&(this.y>=exit.y&&this.y<=exit.y+exit.height)&&
        (this.y+this.height>=exit.y&&this.y+this.height<=exit.y+exit.height)){
            //得分
            score+=5;
            append="正确";
          }
        }
        console.log(this.flightId+"离开管制空域");
        info(this.flightId+append+"离开管制空域");
        removePlane(this.flightId);
        showPlaneNum();
    }
}
function removePlane(fid){
    var index=airspace.findIndex(item=>item.flightId==fid);
    airspace[index].selected=false;
    airspace.splice(index,1)
    leave++;
}
var ct;
function info(str){
 var span=document.getElementById("info");
 span.innerHTML=str;
 clearTimeout(ct);
 ct=setTimeout(function(){
  span.innerHTML="";
 },5000)   
}
function Exit(name,x,y){
  this.name=name;
  this.x=x;
  this.y=y;
  this.getCenter=getCenter;
  this.draw=function(){
    ctx.strokeStyle="green";
    if(this.name=="B"||this.name=="D"){
        this.width=size/2;
        this.height=size*1.5;
        ctx.strokeRect(this.x,this.y,size/2,size*1.5);
        ctx.fillText(this.name,this.x+5,this.y+(size*1.5)/2);
    }else{
        this.width=size*1.5;
        this.height=size/2;
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
    runway=new Runway("09",120,120,200,80);
    airspace.push(runway)

    //增加出口
    ea=new Exit("A",(width-size*1.5)/2,0);
    eb=new Exit("B",width-20,(height-size*1.5)/2);
    ec=new Exit("C",(width-size*1.5)/2,height-20);
    ed=new Exit("D",0,(height-size*1.5)/2);
    airspace.push(ea)
    airspace.push(eb)
    airspace.push(ec)
    airspace.push(ed)

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
      //范围 x,x+size y,y+size
      var maX=p.x+p.width;
      var maY=p.y+p.height;
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
        var key=magntude[hit.speed];
        switch(hit.h){
            case "up":
            hit.img="plane.png";
            hit.move(0,-key);
            break;
            case "down":
            hit.img="down.png";
            hit.move(0,key)
            break;
            case "left":
            hit.img="left.png";
            hit.move(-key,0)
            break;
            case "right":
            hit.img="right.png";
            hit.move(key,0)
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




function tower(){
    getRandomPlane();
    getRandomPlane();
   setInterval(function(){
    if(airspace.length-5<max&&total<taskTotal){
        getRandomPlane();
    }
   },5000)
}
function showPlaneNum(){
    var span=document.getElementById("total");
    span.innerHTML=total;
    var le=document.getElementById("leave");
    le.innerHTML=leave;

    var sc=document.getElementById("score");
    sc.innerHTML=score;
}

function control(code){
 console.log(code);
 if(!taget) {
     console.warn("还未选中飞机");
    return;
 }
 if(code>2){
     taget.h=headings[code];
 }else{
     taget.speed=airspeed[code];
 }

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
