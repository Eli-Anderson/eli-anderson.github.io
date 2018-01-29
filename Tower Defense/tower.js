class Tower extends ButtonImage {
	constructor (transform, image, cropRect) {
		super (transform, image, cropRect, new Vector2(1,1), 0, false)
		this._speed = 5
		this._range = 128
		this._reloadTime = 1000
		this._cost = 10
		this._damage = 5
		this._targeting = this.getWeakestMonster

		this._timeSinceLastShot = 0;
	}
	get speed () {
		return this._speed
	}
	get range () {
		return this._range
	}
	get reloadTime () {
		return this._reloadTime
	}
	get cost () {
		return this._cost
	}
	get targeting () {
		return this._targeting
	}
	get damage () {
		return this._damage
	}

	set speed (speed) {
		this._speed = speed
	}
	set range (range) {
		this._range = range
	}
	set reloadTime (reloadTime) {
		this._reloadTime = reloadTime
	}
	set cost (cost) {
		this._cost = cost
	}
	set damage (damage) {
		this._damage = damage
	}
	set targeting (targetingFunc) {
		this._targeting = targetingFunc
	}

	sell () {
		game.map.removeTower(this.transform.x/32, this.transform.y/32)
		game.gold += this.cost/2
	}

	attemptFire () {
		var target = this.targeting()
		if (target != undefined) {
			var distanceVector = Vector2.SUB(this.transform, target.transform)
			var angle = Math.atan2(-distanceVector.y,-distanceVector.x)
	    	if (angle < Math.PI) {
	    		angle += (2*Math.PI)
	    	}
	    	this.rotation = angle + Math.PI/2
			if (this._timeSinceLastShot > this._reloadTime)
				if (distanceVector.magnitude < this._range) {
					this.fire(target)
					this._timeSinceLastShot = 0
				}
		}
	}

	fire (target) {
		game.map.addProjectile(new this.projectile(
			new Transform(this.transform.rect.center.x,this.transform.rect.center.y,4,6,6),
			Vector3.MULT(Vector3.SUB(target.transform, this.transform).normalized, this.speed),
			this.damage
		))
	}

	getMonstersInRange () {
		var inRange = []
		for (const index in game.map.monsters) {
			if (Vector2.SUB(this.transform, game.map.monsters[index].transform).magnitude < this.range) {
				inRange.push(game.map.monsters[index])
			}
		}
		return inRange
	}
	getClosestMonster () {
		if (game.map.monsters.length <= 0)
			return null
		var closest = game.map.monsters[0]
		for (const index in game.map.monsters) {
			if (Vector2.SUB(this.transform, game.map.monsters[index].transform).magnitude < 
				Vector2.SUB(this.transform, closest.transform).magnitude) {
				closest = game.map.monsters[index]
			}
		}
		return closest
	}
	getWeakestMonster () {
		var inRange = this.getMonstersInRange()
		var weakest = inRange[0]
		for (const index in inRange) {
			if (inRange[index].health < weakest.health) {
				weakest = inRange[index]
			}
		}
		return weakest
	}
	getStrongestMonster () {
		var inRange = this.getMonstersInRange()
		var strongest = inRange[0]
		for (const index in inRange) {
			if (inRange[index].health > strongest.health) {
				strongest = inRange[index]
			}
		}
		return strongest
	}

	update (dt) {
		this._timeSinceLastShot += dt
		this.attemptFire()
	}

	onClick (point) {
		game.selectedTower = this
		game.sellAmount.text = this.cost/2
		game.highlight.enabled = true
		game.highlight.transform.x = this.transform.x
		game.highlight.transform.y = this.transform.y
		var correspondingTargetButton
		if (this.targeting == this.getWeakestMonster)
			correspondingTargetButton = game.targetWeakestButton
		if (this.targeting == this.getStrongestMonster)
			correspondingTargetButton = game.targetStrongestButton
		if (this.targeting == this.getClosestMonster)
			correspondingTargetButton = game.targetClosestButton
		game.targetButtonSelected.transform.x = correspondingTargetButton.transform.rect.center.x
	}
}

class TowerDraggable extends DraggableImage {
	constructor (transform, image, cropRect) {
		super(transform, image, cropRect, new Vector2(1,1), 0, true)
		this._cost = 10
		this._range = 128
	}
	get cost () {
		return this._cost
	}
	get range () {
		return this._range
	}

	set cost (cost) {
		this._cost = cost
	}
	set range (range) {
		this._range = range
	}

	onDrag (point) {
		if (game.gold < this._cost) return
		if (point.y < game.towerTray.transform.y && Collision.pointIsInRect(point, game.camera.transform.rect)){
			var pos = new Vector2(this.transform.rect.center.x, this.transform.rect.center.y)
			var w = this.transform.width
			var h = this.transform.height
			pos.x -= pos.x % 32
			pos.y -= pos.y % 32
			game.highlight.transform.x = pos.x
			game.highlight.transform.y = pos.y
			game.rangeHighlight.transform.x = game.highlight.transform.rect.center.x
			game.rangeHighlight.transform.y = game.highlight.transform.rect.center.y
			game.rangeHighlight.transform.width = this._range
			game.rangeHighlight.transform.height = this._range
			
			if (game.map.isTileBuildable(pos.x/32, pos.y/32)) {
				game.highlight.enabled = true
				game.rangeHighlight.enabled = true
			} else {
				game.highlight.enabled = false
				game.rangeHighlight.enabled = false
			}
			
		} else {
			game.highlight.enabled = false
			game.rangeHighlight.enabled = false
		}
	}

	buildTower (position) {
		game.map.addTower(
			new this.towerClass(new Transform(position.x,position.y,2,32,32)),
			position.x/32,
			position.y/32
		)
	}

	onRelease (point) {
		if (point.y < game.towerTray.transform.y && Collision.pointIsInRect(point, game.camera.transform.rect)){
			var pos = game.highlight.transform
			if (game.highlight.enabled) {
				this.buildTower(pos)
				game.gold -= this.cost
			}
		}
		game.highlight.enabled = false
		game.rangeHighlight.enabled = false
		this.transform.x = this.originalPosition.x
		this.transform.y = this.originalPosition.y
	}
}


class BasicTower extends Tower {
	constructor (transform) {
		var image = new Image()
		image.src = 'basicTower.png'
		super(transform, image, new Rect(0,0,64,64))
		this.speed = 4
		this.range = 128
		this.reloadTime = 1000
		this.cost = 10
		this.projectile = BasicProjectile
	}
}

class BasicTowerCreator extends TowerDraggable {
	constructor (transform) {
		var image = new Image()
		image.src = 'basicTower.png'
		super(transform, image, new Rect(0,0,64,64))
		this.towerClass = BasicTower
		this.cost = 10
		this.range = 128
	}
}

class SniperTower extends Tower {
	constructor (transform) {
		var image = new Image()
		image.src = 'sniperTower.png'
		super(transform, image, new Rect(0,0,64,64))
		this.speed = 7
		this.range = 256
		this.reloadTime = 3000
		this.cost = 25
		this.damage = 10
		this.projectile = PiercingProjectile
	}
}

class SniperTowerCreator extends TowerDraggable {
	constructor (transform) {
		var image = new Image()
		image.src = 'sniperTower.png'
		super(transform, image, new Rect(0,0,64,64))
		this.towerClass = SniperTower
		this.cost = 25
		this.range = 256
	}
}

class RapidTower extends Tower {
	constructor (transform) {
		var image = new Image()
		image.src = 'rapidTower.png'
		super(transform, image, new Rect(0,0,64,64))
		this.speed = 6
		this.reloadTime = 100
		this.damage = 1.5
		this.cost = 15
		this.range = 64
		this.projectile = BasicProjectile
	}
}

class RapidTowerCreator extends TowerDraggable {
	constructor (transform) {
		var image = new Image()
		image.src = 'rapidTower.png'
		super(transform, image, new Rect(0,0,64,64))
		this.towerClass = RapidTower
		this.cost = 15
		this.range = 64
	}
}
