class Monster extends PanelImage {
	constructor (transform) {
		super(transform, Monster.image, new Rect(2,35,12,13), undefined, 0, false)
		this.speed = 1
		this.health = 10
		this.bounty = 1
		this.direction = new Vector2(1,0)
	}
	get speed () {
		return this._speed
	}
	get health () {
		return this._health
	}
	get bounty () {
		return this._bounty
	}
	get direction () {
		return this._direction
	}

	set bounty (bounty) {
		this._bounty = bounty
	}
	set speed (speed) {
		this._speed = speed
	}
	set health (health) {
		this._health = health
	}
	set direction (direction) {
		this._direction = direction
		var angle = Math.atan2(direction.y,direction.x)
    	if (angle < Math.PI) {
    		angle += (2*Math.PI)
    	}
    	//this.rotation = angle - Math.PI/2

	}
	update (dt) {
		if (this._health <= 0) {
			game.gold += this.bounty
			this.parent.remove(this)
			game.map.monsters.splice(game.map.monsters.indexOf(this), 1)
		} else {
			
			var angle = Math.atan2(this.direction.y,this.direction.x)
	    	if (angle < Math.PI) {
	    		angle += (2*Math.PI)
	    	}
	    	this.rotateTowards(angle - Math.PI/2, dt/100)


			var tile = game.map.getTileAtPos(this.transform.rect.center.x, this.transform.rect.center.y)
			if (tile != null) {
				const V_PATH = new Rect(32,0,32,32)
				const H_PATH = new Rect(0,96,32,32)
				const R_D_PATH = new Rect(0,32,32,32)
				const D_R_PATH = new Rect(0,64,32,32)
				const R_U_PATH = new Rect(32,64,32,32)
				const U_R_PATH = new Rect(32,32,32,32)
				if (Vector2.SUB(this.transform.rect.center, tile.transform.rect.center).magnitude < this.speed) {
					if (tile.cropRect.equals(R_D_PATH)) {
						this.direction = new Vector2(0,1)
					} else if (tile.cropRect.equals(R_U_PATH)) {
						this.direction = new Vector2(0,-1)
					} else if (tile.cropRect.equals(U_R_PATH) || tile.cropRect.equals(D_R_PATH)) {
						this.direction = new Vector2(1,0)
					}
				}
				
			}
			this.transform.add(Vector2.MULT(this.direction, this.speed))
			if (this.transform.x >= game.map.transform.rect.right) {
				game.life --
				this.parent.remove(this)
				game.map.monsters.splice(game.map.monsters.indexOf(this), 1)
			}
		}
	}
}
Monster.image = new Image()
Monster.image.src = "monsters.png"