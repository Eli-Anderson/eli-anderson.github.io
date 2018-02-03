class Monster extends PanelImage {
	constructor (transform, image, cropRect) {
		super(transform, image, cropRect, undefined, 0, false)
		this.speed = 0
		this.health = 0
		this.bounty = 0
		this.damage = 1
		this.direction = new Vector2(1,0)
		this.effects = []
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
	}
	addEffect (effect) {
		this.effects.push(effect)
		effect.onContact(this)
	}
	removeEffect (effect) {
		effect.onRelease(this)
		this.effects.splice(this.effects.indexOf(this, 1))
	}
	remove () {
		this.parent.remove(this)
		game.map.monsters.splice(game.map.monsters.indexOf(this), 1)
	}
	kill () {
		game.gold += this.bounty
		remove()
	}
	damageBase () {
		game.life -= this.damage
		remove()
	}
	update (dt) {
		if (this._health <= 0) {
			this.kill()
		} else {
			for (const index in this.effects) {
				this.effects[index]._onUpdate(this, dt)
			}
			var angle = Math.atan2(this.direction.y,this.direction.x)
	    	if (angle < Math.PI) {
	    		angle += (2*Math.PI)
	    	}
	    	this.rotateTowards(angle - Math.PI/2, dt/(100 / this.speed))

			var tile = game.map.getTileAtPos(this.transform.rect.center.x, this.transform.rect.center.y)
			if (tile != null) {
				const V_PATH = new Rect(32,0,32,32)
				const H_PATH = new Rect(0,96,32,32)
				const R_D_PATH = new Rect(0,32,32,32)
				const D_R_PATH = new Rect(0,64,32,32)
				const R_U_PATH = new Rect(32,64,32,32)
				const U_R_PATH = new Rect(32,32,32,32)

				var distFromCenter = Vector2.SUB(this.transform.rect.center, tile.transform.rect.center)
				if (tile.cropRect.equals(R_D_PATH)) {
					if (distFromCenter.x > 0){
						this.direction = new Vector2(0,1)
						this.moveCenterTo(Vector2.ADD(tile.transform.rect.center, this.direction))
					}
				} else if (tile.cropRect.equals(R_U_PATH)) {
					if (distFromCenter.x > 0) {
						this.direction = new Vector2(0,-1)
						this.moveCenterTo(Vector2.ADD(tile.transform.rect.center, this.direction))
					}
				} else if (tile.cropRect.equals(U_R_PATH)) {
					if (distFromCenter.y < 0) {
						this.direction = new Vector2(1,0)
						this.moveCenterTo(Vector2.ADD(tile.transform.rect.center, this.direction))
					}
				} else if (tile.cropRect.equals(D_R_PATH)) {
					if (distFromCenter.y > 0) {
						this.direction = new Vector2(1,0)
						this.moveCenterTo(Vector2.ADD(tile.transform.rect.center, this.direction))
					}
				}
			}
			this.move(Vector2.MULT(this.direction, this.speed))
			if (this.transform.x >= game.map.transform.rect.right) {
				damageBase()
			}
		}
	}
}
class Goblin extends Monster {
	constructor (transform) {
		super (transform, Monster.image, new Rect(2,35,12,13))
		this.speed = 1
		this.originalSpeed = this.speed
		this.health = 8
		this.bounty = 2
	}
}
class Scout extends Monster {
	constructor (transform) {
		super (transform, Monster.image, new Rect(17,33,14,15))
		this.speed = 2
		this.originalSpeed = this.speed
		this.health = 5
		this.bounty = 1
		this.damage = 2
	}
}
class Mage extends Monster {
	constructor (transform) {
		super (transform, Monster.image, new Rect(17,33,14,15))
		this.speed = 1
		this.originalSpeed = this.speed
		this.health = 8
		this.bounty = 2
		this.damage = 2
	}
}
Monster.image = new Image()
Monster.image.src = "monsters.png"