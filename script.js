class Vec
{
	constructor(x = 0, y = 0)
	{
		this.x = x;
		this.y = y;
	}
}

class Rect
{
	constructor(w, h)
	{
		this.pos = new Vec;
		this.size = new Vec(w, h);
	}
}

class Player
{
	constructor()
	{
		this.size_1 = new Vec(50, 5);
		this.size_2 = new Vec(30, 5);
		this.size_3 = new Vec(5, 5);
		this.vel = new Vec;
		this.pos = new Vec;
	}
}

class Game
{
	constructor(canvas, keyEvent)
	{
		this._canvas = canvas;
		this._context = canvas.getContext("2d");

		this.player = new Player;
		this.player.pos.x = 180;
		this.player.pos.y = 395;
		this.player.vel.x = 200;

		this.keyEvent = keyEvent;


		let lastTime;
		const callback = (millis) => {
			if(lastTime) {
				this.update((millis - lastTime) / 1000);
			}
			lastTime = millis;
			requestAnimationFrame(callback);
		};
		callback();
	}
	update(dt) {

		if(this.keyEvent.left) {
			this.player.pos.x -= this.player.vel.x * dt;
		}
		if(this.keyEvent.right) {
			this.player.pos.x += this.player.vel.x * dt;
		}

		this._context.fillStyle = "rgb(36, 177, 219)";
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

		this._context.fillStyle = "rgb(173, 105, 82)";
		this._context.fillRect(this.player.pos.x, this.player.pos.y, 
							this.player.size_1.x, this.player.size_1.y);
		this._context.fillRect(this.player.pos.x+10, this.player.pos.y-5, 
							this.player.size_2.x, this.player.size_2.y);
		this._context.fillRect(this.player.pos.x+23, this.player.pos.y-10, 
							this.player.size_3.x, this.player.size_3.y);
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

const canvas = document.getElementById("canvas");

const game = new Game(canvas, keyEvent);


