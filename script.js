class Game
{
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.world = new Set();
		this._last = 0;
		this.count = 0;
		this.world.add(new Player(this.canvas.width/2-30, this.canvas.height-30, 30, 20, "rgb(173, 105, 82)", 200));
		this.world.add(new Attack(50));
		this.lastObjShot = false;
		this._step = (now) => {
			this._loop = requestAnimationFrame(this._step);
			this.delta = Math.min(now - this._last, 100) / 1000;
			this._last = now;
			this.update();
			this.render();
		};
		this._step(0);
	}

	update() {
		for (let entity of this.world) if (entity.update) entity.update(this);
	}

	render() {
		this.ctx.fillStyle = "rgb(36, 177, 219)";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		for (let entity of this.world) if (entity.render) entity.render(this);
	}

	collide(entity1, type) {
		for (let entity2 of this.world) {
			if (entity1 != entity2  &&
				entity1.x <= entity2.x + entity2.w &&
				entity1.x + entity1.w >= entity2.x &&
				entity1.y <= entity2.y + entity2.h &&
				entity1.h + entity1.y >= entity2.y) 
				{
					if(entity1.type == (SHOT || SHIP) && entity2.type == (SHIP || SHOT))
					{
						this.world.delete(entity1);
						this.world.delete(entity2);
					}
					if(entity1.type == PLAYER && entity2.type == SHIP)
					{
						this.stop();
					}
				}	
		}
	}

	stop() {
		if (this._loop) this._loop = cancelAnimationFrame(this._loop);
	}
}

class Rect
{
	constructor() {
	}

	render(game) {
		game.ctx.fillStyle = this.color;
		game.ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}

const PLAYER = 1, SHIP = 2, SHOT = 4, LINE = 8;

class Player extends Rect
{
	constructor(px, py, pw, ph, c, v, game) {
		super();
		Object.assign(this, { type: PLAYER, rate: 0.1, delay: 0, x : px, y : py, w : pw, h : ph, color : c, vel : v });
	}

	update(game) {

		if(keyEvent.left) {
			this.x -= this.vel * game.delta;
		}
		if(keyEvent.right) {
			this.x += this.vel * game.delta;
		}
		this.delay -= game.delta;
		if (keyEvent.space && this.delay < 0) {
			this.delay = this.rate;
			game.world.add(new Shot(this.x+11, this.y-8, 7, 7, 'red', 200));
		}
		game.collide(this);
	}
}

class Ship extends Rect
{
	constructor(px, py, pw, ph, c, v, game) {
		super();
		Object.assign(this, { type: SHIP, x : px, y : py, w : pw, h : ph, color : c, vel : v });
		game.ship = this;
	}

	update(game) {
		this.y += this.vel * game.delta;
		game.collide(this);
	}
}

class Shot extends Rect
{
	constructor(px, py, pw, ph, c, v) {
		super();
		Object.assign(this, { type: SHOT, x : px, y : py, w : pw, h : ph, color : c, vel : v });
	}

	update(game) {
		this.y -= this.vel * game.delta;
		game.collide(this);
		if(this.y < 0) game.world.delete(this);
	}
}

class Attack {
	constructor(s) {
		Object.assign(this, { size: s, rate: 0.5, delay: 0 });
	}
	update(game) {
		this.delay -= game.delta;
		if (this.delay < 0) {
			this.delay = this.rate;
			game.world.add(new Ship(Math.random() * 590, 5, 10, 10, 'green', 100, game));
			if (!--this.size) game.world.delete(this);
		}
	}
}

const keyEvent = {
	left : false,
	right : false,
	space : false
};

window.onkeydown = function(e) {
  switch(e.keyCode) {
  	case 37 : keyEvent.left = true; break;
  	case 39 : keyEvent.right = true; break;
  	case 32 : keyEvent.space = true; break;
  }
};

window.onkeyup = function(e) {
  switch(e.keyCode) {
  	case 37 : keyEvent.left = false; break;
  	case 39 : keyEvent.right = false; break;
  	case 32 : keyEvent.space = false; break;
  }
};

const game = new Game(document.getElementById('canvas'));