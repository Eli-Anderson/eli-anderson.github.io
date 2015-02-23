var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var player = {
	x: 360,
	y: 240,
	w: 50,
	h: 50,
	speed: 3,
	gun: {
		speed: 10,
		bps: 1,
		spread: 0,
		damage: 10,
		sps: 5,
	},
	hp: 100,
	chance: 0,
	kills: 0,
	shooting: false,
}
var mouse = {
	x: 0,
	y: 0,
	angle: 0,
}
var enemies = []
var bullets = []
var hyp;
var leftKey = false;
var rightKey = false;
var upKey = false;
var downKey = false;
//
//
//
//
function init(){
	createEnemy(1)
	loop()
}


function setAngle(e){
	mouse.x = e.clientX -10;
	mouse.y = e.clientY -10;
	hyp = Math.round(Math.sqrt((Math.pow(mouse.y-player.y,2))+(Math.pow(mouse.x-player.x,2))))
	mouse.angle = Math.round((180/Math.PI)*Math.asin((mouse.y-player.y)/hyp))
}

function drawPlayer(){
	ctx.fillStyle='rgb('+(255-2*player.hp)+',0,0)'
	ctx.beginPath();
	ctx.arc(player.x,player.y,player.w/2,0,2*Math.PI)
	ctx.closePath();
	ctx.fill();
	//ctx.fillRect(player.x,player.y,player.w,player.h)
	//ctx.rect(player.x,player.y,mouse.x,mouse.y)
}
function animatePlayer(){
	if(leftKey){player.x-= player.speed}
	else if(rightKey){player.x+= player.speed}
	if(upKey){player.y-= player.speed}
	else if(downKey){player.y+= player.speed}
	
	var tick = tick || 0;
	tick ++
	if(player.hp <= 0){gameOver()}
	if(tick % 60 == 0){player.hp ++}
	
	player.chance = player.kills
}

function createEnemy(amount){
	for(var i=0; i<amount; i++){
		var ran = Math.random()
		var ran2 = 450-Math.floor(Math.random()*450)
		if(ran < .25){
			var x = ran2 + 360
			var y = Math.sqrt((450*450)-(ran2*ran2)) + 240
		}
		else if(ran > .25 && ran <= .5){
			var x = -ran2 + 360
			var y = Math.sqrt((450*450)-(ran2*ran2)) + 240
		}
		else if(ran > .5 && ran <= .75){
			var x = -ran2 + 360
			var y = -Math.sqrt((450*450)-(ran2*ran2)) + 240
		}
		else{
			var x = ran2 + 360
			var y = -Math.sqrt((450*450)-(ran2*ran2)) + 240
		}
		var speed = Math.floor(Math.random()*4)+1
		var hp = 75 - (5*speed)
		enemies.push([x,y,speed,hp])
	}
}
function drawEnemy(){
	ctx.fillStyle='rgb(0,0,0)'
	for (var i=0; i<enemies.length; i++){
		ctx.beginPath();
		ctx.arc(enemies[i][0],enemies[i][1],15,0,2*Math.PI)
		ctx.closePath();
		ctx.fill();
	}
}
function animateEnemy(){
	for (var i=0; i<enemies.length; i++){
		var x = enemies[i][0];
		var y = enemies[i][1];
		var s = enemies[i][2];
		var dirx = player.x - x;
		var diry = player.y - y;
		var hyp = Math.sqrt((dirx*dirx)+(diry*diry));
		dirx /= hyp;
		diry /= hyp;
		enemies[i][0] += dirx*s;
		enemies[i][1] += diry*s;

		if(enemies[i][3] <= 0){
			enemies.splice(i,1);
			player.kills++
			var ran = Math.floor(Math.random()*100)
			if(ran <= player.chance){
				createEnemy(2);
			}
			else{createEnemy(1)}
		}
	}
}
var lastShot = new Date()
lastShot.getDate();
function shoot(){
	var thisShot = new Date();
	thisShot.getDate();
	
	if(thisShot-lastShot > 1000/player.gun.sps){
		var angle = mouse.angle
		var dirx = mouse.x - player.x;
		var diry = mouse.y - player.y;
		var hyp = Math.sqrt((dirx*dirx)+(diry*diry))
		dirx /= hyp
		diry /= hyp
		bullets.push([player.x,player.y,dirx,diry,player.gun.speed])
		lastShot = thisShot
	}
}
function drawBullets(){
	for (var i=0; i<bullets.length; i++){
		ctx.fillRect(bullets[i][0],bullets[i][1],5,5)
		bullets[i][0] += bullets[i][2]*bullets[i][4];
		bullets[i][1] += bullets[i][3]*bullets[i][4];
	}
}

function checkCollision(){
	for (var j=0; j<enemies.length; j++){
		var ex = enemies[j][0];
		var ey = enemies[j][1];
		for (var i=0; i<bullets.length; i++){
			var bx = bullets[i][0];
			var by = bullets[i][1];
			var dist = Math.sqrt((ey-by)*(ey-by)+(ex-bx)*(ex-bx))
			if(dist < 15){enemies[j][3]-= player.gun.damage;bullets.splice(i,1);console.log('hit')}
		}
		var dist2 = Math.sqrt((player.y-ey)*(player.y-ey)+(player.x-ex)*(player.x-ex))
		if(dist2 < 40){player.hp--}
	}
}

function gameOver(){
	alert('game over\nkills: '+player.kills)
	enemies = []
	bullets = []
	player.x = 360
	player.y = 240
	player.hp = 100
	rightKey = false;
	leftKey = false;
	upKey = false;
	downKey = false;
	if(player.kills > 0){
		clearInterval(autofire)
	}
	player.kills = 0;
	createEnemy(1)
	
}

canvas.addEventListener('mousemove',setAngle)
document.addEventListener('keydown',keyDown)
document.addEventListener('keyup',keyUp)
document.addEventListener('mousedown',function(){player.shooting=true})
document.addEventListener('mouseup',function(){player.shooting=false})

function keyDown(e){
	//console.log(e.keyCode)
	if(e.keyCode == 65){leftKey = true}
	else if(e.keyCode == 87){upKey = true}
	if(e.keyCode == 68){rightKey = true}
	else if(e.keyCode == 83){downKey = true}
}
function keyUp(e){
	if(e.keyCode == 65){leftKey = false}
	else if(e.keyCode == 87){upKey = false}
	if(e.keyCode == 68){rightKey = false}
	else if(e.keyCode == 83){downKey = false}
}

function loop(){
	ctx.clearRect(0,0,720,480)
	ctx.beginPath();
	ctx.arc(360,240,450,0,2*Math.PI)
	ctx.stroke();
	animatePlayer()
	animateEnemy()
	checkCollision()
	drawBullets()
	drawPlayer()
	drawEnemy()
	if(player.shooting){shoot()}
	
	requestAnimationFrame(loop)
}
window.onload=init()