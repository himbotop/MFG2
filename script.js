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
	constructor(w, h, x, y)
	{
		this.pos = new Vec(x, y);
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

		this.ships = [];
		this.countForShips = 0;
		this.frequency = 30;
		this.countShips = 5;
		this.speedShips = 50;

		this.shots = [];


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

		this.collision();
		this.shotsGeneration(dt);
		this.shipsGeneration(dt);
	}

	shipsGeneration(dt) {

		if( this.countForShips > this.frequency && this.ships.length < this.countShips) {

		    this.ships.push(new Rect(10, 10, Math.random() * 590|0, 0));
		    this.countForShips = 0;

		}
		this.countForShips++;

		for(let i = 0; i < this.ships.length; i++) {
			let ship = this.ships[i];
		    if(this._canvas.height > ship.pos.y) {
		    	ship.pos.y += this.speedShips * dt;
		    }
		    else {
		    	this.ships[i] = new Rect(10, 10, Math.random() * 590|0, 0);
		    }

		    this._context.fillStyle = "rgb(22, 105, 67)";
		    this._context.fillRect(ship.pos.x, ship.pos.y, ship.size.x, ship.size.y);
		}
	}

	shotsGeneration(dt) {

	  if(this.keyEvent.space) {
	    let length = this.shots.length;
	    if(length > 0) {
	      if((this.shots[length-1].pos.y + 7) < 380) {
	        this.shots.push(new Rect(5, 5, this.player.pos.x+23, 380));
	      }
	    } else {
	      this.shots.push(new Rect(5, 5, this.player.pos.x+23, 380));
	    }

	  }

	  for(let i = 0; i < this.shots.length; i++) {
	  	let shot = this.shots[i];
	  	this._context.fillStyle = "rgb(173, 105, 82)";
		this._context.fillRect(shot.pos.x, shot.pos.y, shot.size.x, shot.size.y);
		shot.pos.y -= 200 * dt;
	  }
	}

	collision() {
	  for(let i = 0; i < this.shots.length; i++) {
	    for(let j = 0; j < this.ships.length; j++) {
		  let shot = this.shots[i];
		  let ship = this.ships[j];	
	      if(shot.pos.y < ship.pos.y+10 && shot.pos.x+5 > ship.pos.x && shot.pos.x < ship.pos.x+10) {
	        this.ships.splice(j, 1);
	        this.shots.splice(i, 1);
	        break;
	      }
	    }
	  }
	  for(let i = 0; i < this.shots.length; i++) {
	      if(this.shots[i].pos.y < 0) {
	        this.shots.splice(i, 1);
	    }
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

const canvas = document.getElementById("canvas");

const game = new Game(canvas, keyEvent);


