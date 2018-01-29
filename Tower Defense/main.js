const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const MONSTER = 5
const PROJECTILE = 6
const TOWER = 7
const UI = 30

class Game {
	constructor () {
		var _this = this
		this._camera = new Camera (new Transform(0,0,0,720,480))
		this._scene = new Scene()
		this.map = new Map(23, 13)
		this._paused = false
		this.tooltips = []

		this.countdownText = new Text("",
			new Transform(this.camera.transform.rect.center.x, this.camera.transform.rect.center.y,UI+5,1,1),
			new Font("Arial", 128, new Color('white'), 'center', 'center'),
			true
		)
		this.countdownText.enabled = false
		this.scene.add(this.countdownText)

		this.currentWave = 0
		this._gold = 25
		this._life = 25
		this._selectedTower = null

		this.waveCounter = new Text("Wave: "+this.currentWave,
			new Transform(620,420,UI+1,0,0),
			new Font("Arial", 18, new Color('white'), 'left', 'center'),
			true
		)
		this.goldCounter = new Text("Gold: "+this.gold,
			new Transform(620,440,UI+1,0,0),
			new Font("Arial", 18, new Color('yellow'), 'left', 'center'),
			true
		)
		this.lifeCounter = new Text("Life: "+this.life,
			new Transform(620,460,UI+1,0,0),
			new Font("Arial", 18, new Color('red'), 'left', 'center'),
			true
		)
		this.hurtThisWave = false

		this.pauseButton = new Button(new Transform(678,10,UI+4,32,32), new Color('black'))
		this.pauseButton.onClick = () => {_this.paused = !_this.paused}
		this.scene.add(this.pauseButton)
		
		this.scene.add(new Panel(new Transform(0,0,0,720,480), new Color('white')))
		this.scene.add(this.map)

		this.towerTray = new Panel(new Transform(0,400,UI-1,720,80), new Color('gray'), true)
		this.towerTray.add(this.waveCounter)
		this.towerTray.add(this.goldCounter)
		this.towerTray.add(this.lifeCounter)
		this.highlight = new Panel(new Transform(0,0,TOWER-1,32,32), new Color(255,255,255,0.25), false)
		this.highlight.enabled = false
		this.rangeHighlight = new PanelCircle(new Transform(0,0,TOWER-1,0,0), new Color(255,255,255,0.3), false)
		this.rangeHighlight.enabled = false
		this.scene.add(this.highlight)
		this.scene.add(this.rangeHighlight)
		
		this.createTowerButtons()

		this.scene.add(this.towerTray)

		this.targetWeakestButton = new Button(new Transform(438,424,UI+2,32,32), new Color('purple'), true)
		this.targetStrongestButton = new Button(new Transform(480,424,UI+2,32,32), new Color('teal'), true)
		this.targetClosestButton = new Button(new Transform(522,424,UI+2,32,32), new Color(0,255,120), true)
		this.targetButtonSelected = new Text("X", new Transform(454,440,UI+3,32,32), new Font("Arial", 32, new Color('black'), 'center', 'center'))
		this.scene.add(this.targetButtonSelected)
		this.targetWeakestButton.onClick = ()=>{
			if (_this.selectedTower){
				_this.selectedTower.targeting = _this.selectedTower.getWeakestMonster
				_this.targetButtonSelected.enabled = true
				_this.targetButtonSelected.transform.x = _this.targetWeakestButton.transform.rect.center.x
			}
		}
		this.targetStrongestButton.onClick = ()=>{
			if (_this.selectedTower){
				_this.selectedTower.targeting = _this.selectedTower.getStrongestMonster
				_this.targetButtonSelected.enabled = true
				_this.targetButtonSelected.transform.x = _this.targetStrongestButton.transform.rect.center.x
			}
		}
		this.targetClosestButton.onClick = ()=>{
			if (_this.selectedTower){
				_this.selectedTower.targeting = _this.selectedTower.getClosestMonster
				_this.targetButtonSelected.enabled = true
				_this.targetButtonSelected.transform.x = _this.targetClosestButton.transform.rect.center.x
			}
		}
		var targetWeakestTip = new Tooltip(
			new Transform(438,400,UI+10,128,128),
			new Text("Target weakest", new Transform(0,0,UI+11,0,0), new Font("Arial", 16, new Color('white'), 'center', 'center')),
			new Color(128,128,128,0.25),
			true
		)
		this.targetWeakestButton.add(targetWeakestTip)
		var targetStrongestTip = new Tooltip(
			new Transform(480,400,UI+10,128,128),
			new Text("Target strongest", new Transform(0,0,UI+11,0,0), new Font("Arial", 16, new Color('white'), 'center', 'center')),
			new Color(128,128,128,0.25),
			true
		)
		this.targetStrongestButton.add(targetStrongestTip)
		var targetClosestTip = new Tooltip(
			new Transform(522,400,UI+10,128,128),
			new Text("Target closest", new Transform(0,0,UI+11,0,0), new Font("Arial", 16, new Color('white'), 'center', 'center')),
			new Color(128,128,128,0.25),
			true
		)
		this.targetClosestButton.add(targetClosestTip)


		this.sellButton = new Button(new Transform(564,424,UI+2,32,32), new Color('red'), true)
		this.sellAmount = new Text("", new Transform(580,440,UI+3,32,32), new Font("Arial", 16, new Color('yellow'), 'center', 'center'))
		this.sellButton.add(this.sellAmount)
		var sellTip = new Tooltip(
			new Transform(564,400,UI+10,128,128),
			new Text("Sell a tower", new Transform(0,0,UI+11,0,0), new Font("Arial", 16, new Color('white'), 'center', 'center')),
			new Color(128,128,128,0.25),
			true
		)
		this.sellButton.add(sellTip)
		this.tooltips.push(sellTip)
		this.tooltips.push(targetWeakestTip)
		this.tooltips.push(targetStrongestTip)
		this.tooltips.push(targetClosestTip)
		this.sellButton.onClick = ()=>{
			if (_this.selectedTower) {
				_this.selectedTower.sell()
				_this.selectedTower = null
				_this.sellAmount.text = ""
				_this.highlight.enabled = false
			}
			

		}
		this.scene.add(this.targetWeakestButton)
		this.scene.add(this.targetStrongestButton)
		this.scene.add(this.targetClosestButton)
		this.scene.add(this.sellButton)

	}

	get scene () {
		return this._scene
	}
	get camera () {
		return this._camera
	}
	get paused () {
		return this._paused
	}
	get gold () {
		return this._gold
	}
	get life () {
		return this._life
	}
	get selectedTower () {
		return this._selectedTower
	}

	set scene (scene) {
		this._scene = scene
	}
	set camera (camera) {
		this._camera = camera
	}
	set paused (paused) {
		this._paused = paused
	}
	set gold (gold) {
		this._gold = gold
		this.goldCounter.text = "Gold: "+gold
	}
	set life (life) {
		if (life < this.life) this.hurtThisWave = true
		this._life = life
		this.lifeCounter.text = "Life: "+life
		if (this.life <= 0) {
			window.alert("Game Over!")
			game = new Game()
		}
	}
	set selectedTower (selectedTower) {
		this._selectedTower = selectedTower
	}

	createTowerButtons () {
		var basicTowerCreator = new BasicTowerCreator(new Transform(32,424,UI+2,32,32))
		var sniperTowerCreator = new SniperTowerCreator(new Transform(96,424,UI+2,32,32))
		var rapidTowerCreator = new RapidTowerCreator(new Transform(160,424,UI+2,32,32))
		console.log(basicTowerCreator, sniperTowerCreator, rapidTowerCreator)
		this.towerTray.add(basicTowerCreator)
		this.towerTray.add(sniperTowerCreator)
		this.towerTray.add(rapidTowerCreator)
	}
}

class Tooltip extends Panel {
	constructor (transform, text, color, dynamicSize) {
		super(transform, color)
		this._dynamic = dynamicSize
		this.tipText = text
		this.add(text)
		this.enabled = false
	}
	get tipText () {
		return this._tipText
	}
	set tipText (tipText) {
		this._tipText = tipText
		if (this._dynamic) {
			this.tipText.draw(ctx, new Vector2(-1000,-1000))
			this.transform.width = this.tipText.transform.width
			this.transform.height = this.tipText.transform.height
			if (this.tipText.font.alignment == 'center')
				this.tipText.transform.x = this.transform.rect.center.x
			if (this.tipText.font.vertAlignment == 'center')
				this.tipText.transform.y = this.transform.rect.center.y
		}
	}

	update (dt, point) {
		this.enabled = Collision.pointIsInRect(point, this.parent.transform)
	}
}

function startWave (n) {
	game.waveCounter.text = "Wave: "+game.currentWave
	for (var i = 0; i < n*n; i++) {
		var m = new Monster(new Transform(Math.random()*(-132)+((i+1)*-32),192,MONSTER,32,32))
		m.health += (2*n)
		//m.speed += (m.speed+Math.floor(Math.sqrt(n))-1) < 32 ? Math.floor(Math.sqrt(n))-1 : (32 - m.speed)
		game.map.addMonster(m)
	}
	
}

function countdown (n) {
	game.countdownText.enabled = true
	game.countdownText.text = n
	if (n <= 0) {
		startWave(++game.currentWave)
		game.countdownText.enabled = false
		return
	} else {
		setTimeout(function(){
			countdown(game.paused ? n : --n)
		}, 1000)
	}
	
}

var game
window.onload = function () {
	game = new Game()
	var dt
	var lastTime = Date.now()
	function loop () {
		dt = Date.now() - lastTime
		if (!game.paused) {
			if (game.map.monsters.length == 0 && game.countdownText.enabled == false) {
				game.gold += Math.round(game.currentWave * (this.hurtThisWave ? 1.5 : 0.75))
				this.hurtThisWave = false
				countdown(5)
			}
			for (const index in game.map.monsters) {
				if (game.map.monsters[index] != undefined) {
					// if game was reset mid loop, make sure these are not called
					game.map.monsters[index].update(dt)
				}
			}
			for (const rowIndex in game.map.towers) {
				for (const colIndex in game.map.towers[rowIndex]) {
					if (game.map.towers[rowIndex][colIndex] != null) {
						game.map.towers[rowIndex][colIndex].update(dt)
					}
				}
			}
			for (const index in game.map.projectiles) {
				if (game.map.projectiles[index] != undefined) {
					// if game was reset mid loop, make sure these are not called
					game.map.projectiles[index].update(dt)
				}
			}
			for (const index in game.tooltips) {
				game.tooltips[index].update(dt, mouse)
			}
		}
		game.scene.draw(ctx, game.camera)
		lastTime = Date.now()
		requestAnimationFrame(loop)
	}
	loop()
}
var mouse = new Vector2()
var input = {
	'left': 	false,
	'right': 	false,
	'up': 		false,
	'down': 	false,
	'mousedown': false,
}
document.addEventListener('mousemove', function (e) {
	mouse.x = e.clientX - canvas.offsetLeft
	mouse.y = e.clientY - canvas.offsetTop
	Button.handleInput('move', mouse, game.scene)
})
document.addEventListener('mousedown', function (e) {
	Button.handleInput('down', mouse, game.scene)
	input.mousedown = true
})
document.addEventListener('mouseup', function (e) {
	Button.handleInput('up', mouse, game.scene)
	input.mousedown = false
})
document.addEventListener('keydown', function (e) {
	if (e.key == 'a')
		input.left = true
	else if (e.key == 'd')
		input.right = true
	if (e.key == 'w')
		input.up = true
	else if (e.key == 's')
		input.down = true
	if (e.key == 'Escape') {

	}
})
document.addEventListener('keyup', function (e) {
	if (e.key == 'a')
		input.left = false
	if (e.key == 'd')
		input.right = false
	if (e.key == 'w')
		input.up = false
	if (e.key == 's')
		input.down = false
})