var ctx;
var airspace = [];

ctx=document.getElementById("surface");

function Plane(sx,sy){
    this.x=sx;
    this.y=sy;
    this.draw=drawPlane
    this.move=movePlane
}

function drawPlane(){
 ctx.beginPath();
 //ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, true);
 var img=new Image();
 img.src="down.png";
 ctx.drawImage(img,this.x,this.y,40,40);
 //ctx.closePath();
 //ctx.fillStyle = "blue";
 //ctx.fill();
}

function movePlane(dx,dy){
    this.x+=dx;
    this.y+=dy;
}

function start(){
    ctx=document.getElementById("surface").getContext('2d');
    //添加飞机
    for(var i=0;i<5;i++){
        var p=new Plane((i+1)*50,0);
        airspace.push(p);
    }
    setInterval(refrash,500);
}

setTimeout(start,1000)

function refrash(){
    ctx.clearRect(0,0, 1200, 600);
    for (var i = 0; i < airspace.length; i++) {
        airspace[i].move(1, 5);
        airspace[i].draw();
        ctx.restore();
      }
}

