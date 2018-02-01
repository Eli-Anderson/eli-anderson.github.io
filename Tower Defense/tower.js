class Tower extends ButtonImage {
	constructor (transform, image, cropRect) {
		super (transform, image, cropRect, new Vector2(1,1), 0, false)
		this._speed = 5
		this._range = 128
		this._reloadTime = 1000
		this._cost = 10
		this._damage = 5
		this._targeting = this.getWeakestMonster
		this._target = null

		this._timeSinceLastShot = 0;
		this.tooltip = new Tooltip(
			Transform.zero(),
			new Text("", Transform.zero(), new Font("Arial", 16, new Color('white'), 'left','bottom')),
			new Color(128,128,128,0),
			false
		)
		this.tooltip.add(new PanelCircle(
			new Transform(this.transform.rect.center.x,this.transform.rect.center.y,TOWER-1,this.range,this.range),
			new Color(255,255,255,0.2),
			0,
			false
		))
		this.add(this.tooltip)
		game.tooltips.push(this.tooltip)
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
	get target () {
		return this._target
	}

	set speed (speed) {
		this._speed = speed
	}
	set range (range) {
		this._range = range
		
		this.tooltip.children[1].transform.width = range
		this.tooltip.children[1].transform.height = range
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
	set target (target) {
		this._target = target
	}

	sell () {
		game.map.removeTower(this.transform.x/32, this.transform.y/32)
		game.gold += this.cost/2
	}

	attemptFire () {
		this.target = this.targeting()
		if (this.target != null) { // has a target
			var distanceVector = Vector2.SUB(this.transform.rect.center, this.target.transform.rect.center)
			if (this._timeSinceLastShot > this._reloadTime) { // is not reloading
				if (distanceVector.magnitude < this._range) { // target is within range
					var angle = Math.atan2(-distanceVector.y, -distanceVector.x)
					if (angle < 0) {
						angle += (2*Math.PI)
					}
					//console.log(Math.abs(this.rotation - angle), Math.PI/64)
					//if (Math.abs(this.rotation - angle) < Math.PI/64) { // is looking at target
						this.fire()
						this._timeSinceLastShot = 0
					//}
				}
			}
		}
	}

	fire () {
		var size = 6
		var direction = new Vector2(Math.cos(this.rotation), Math.sin(this.rotation))
		game.map.addProjectile(new this.projectile(
			new Transform(this.transform.rect.center.x-(size / 2),this.transform.rect.center.y-(size / 2),PROJECTILE,size,size),
			//Vector2.MULT(Vector2.SUB(this.target.transform.rect.center, this.transform.rect.center).normalized, this.speed),
			Vector2.MULT(direction, this.speed),
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
		var inRange = this.getMonstersInRange()
		if (inRange.length <= 0)
			return null
		var closest = inRange[0]
		for (const index in inRange) {
			if (Vector2.SUB(this.transform, inRange[index].transform).magnitude < 
				Vector2.SUB(this.transform, closest.transform).magnitude) {
				closest = inRange[index]
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
		if (this.target != null) {
			var distanceVector = Vector2.SUB(this.target.transform.rect.center, this.transform.rect.center).normalized
			var angle = Math.atan2(distanceVector.y, distanceVector.x)
	    	if (angle < 0) {
	    		angle += (2*Math.PI)
	    	}
	    	this.rotateTowards(angle, (dt/1000)*20)
		}
		
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
			new this.towerClass(new Transform(position.x,position.y,TOWER,32,32)),
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
		this.moveTo(this.originalPosition)
	}
}


class BasicTower extends Tower {
	constructor (transform) {
		super(transform, BasicTower.image, new Rect(0,0,64,64))
		this.speed = 12
		this.range = 128
		this.damage = 5
		this.reloadTime = 1000
		this.cost = 10
		this.projectile = BasicProjectile
	}
	static get tooltipText () {
		return 	"Basic Tower\n\n"+
				"Damage: 5\n"+
				"Fire Rate: 1000\n\n\n"+
				"Cost: 10"
	}
}
BasicTower.image = new Image()
BasicTower.image.src = 'basicTower.png'

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
		this.speed = 24
		this.range = 256
		this.reloadTime = 3000
		this.cost = 25
		this.damage = 10
		this.projectile = PiercingProjectile
	}
	static get tooltipText () {
		return 	"Sniper Tower\n\n"+
				"Pierces Enemies\n"+
				"Damage: 10\n"+
				"Fire Rate: 3000\n\n"+
				"Cost: 25"
	}
}
SniperTower.image = new Image()
SniperTower.image.src = 'sniperTower.png'

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
		this.speed = 10
		this.reloadTime = 100
		this.damage = 1.5
		this.cost = 15
		this.range = 64
		this.projectile = BasicProjectile
	}

	static get tooltipText () {
		return 	"Rapid Tower\n\n"+
				"Damage: 1.5\n"+
				"Fire Rate: 100\n\n\n"+
				"Cost: 15"
	}
}
RapidTower.image = new Image()
RapidTower.image.src = 'rapidTower.png'

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
