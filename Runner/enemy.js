function Enemy(x,y,w,h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.dx = 0;
	this.dy = 0;

}
Enemy.prototype.animate = function(){
	
}
function BasicEnemy(x,y,w,h){
	Enemy.call(this,x,y,w,h)

	this.test2 = 'b'
}

BasicEnemy.prototype = Object.create(Enemy.prototype)

var aaa = new BasicEnemy(0,0,0,0)