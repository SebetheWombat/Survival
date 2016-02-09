// all tiles came from http://pousse.rapiere.free.fr/tome/

var canvas = document.getElementById("game");
var cntxt = canvas.getContext("2d");

var monstImg = new Image();
monstImg.src = "img/monster.png";
var playerImg = new Image();
playerImg.src = "img/player.png";
var playerRight = new Image();
playerRight.src = "img/playerRight.png";
var playerLeft = new Image();
playerLeft.src = "img/playerLeft.png";
var playerUp = new Image();
playerUp.src = "img/playerUp.png";

var dead = true;
var right = false;
var up = false;
var left = false;
var down = false;
var shoot = false;
var lastPressed = "right";
var bulletState;
var kills = 0;

document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);

var monster = {
	x:[],
	y:[],
	speed: [],
	state: []
};

var player = {
	x:200,
	y:10,
	speed: 4,
	angle: 0
};	

var bullet = {
	x: [],
	y: [],
	width: 5,
	height: 5,
	speed: 5,
	direction: [],
	state: []
};

var drawBullet = function(){
	for(var i = 0; i < bullet.x.length; i++){
		if(bullet.state[i]){
			cntxt.beginPath();
			cntxt.rect(bullet.x[i], bullet.y[i], bullet.width, bullet.height);
			cntxt.fillStyle = "black";
			cntxt.fill();
			cntxt.closePath();
		}
	}
}

function keyDown(e){
	if(e.keyCode === 37){
		left = true;
		lastPressed = "left";
	}
	if(e.keyCode === 38){
		up = true;
		lastPressed = "up";
	}
	if(e.keyCode === 39){
		right = true;
		lastPressed = "right";
	}
	if(e.keyCode === 40){
		down = true;
		lastPressed = "down";
	}
	if(e.keyCode === 32){
		bullet.x.push(player.x + playerImg.width/2);
		bullet.y.push(player.y + playerImg.height/2);
		bullet.direction.push(lastPressed);
		bullet.state.push(true);
	}
	if(e.keyCode === 83 && dead){
		dead = false;
		kills = 0;

	}
}

function keyUp(e){
	if(e.keyCode === 37){
		left = false;
	}
	if(e.keyCode === 38){
		up = false;
	}
	if(e.keyCode === 39){
		right = false;
	}
	if(e.keyCode === 40){
		down = false;
	}

}

var playerUpdate = function(){
	// loads image to face in direction of travel
	if(lastPressed === "down"){
		cntxt.drawImage(playerImg, player.x, player.y);
	}
	else if(lastPressed === "right"){
		cntxt.drawImage(playerRight, player.x, player.y);
	}
	else if(lastPressed === "left"){
		cntxt.drawImage(playerLeft, player.x, player.y);
	}
	else if(lastPressed === "up"){
		cntxt.drawImage(playerUp, player.x, player.y);
	}
	
	if(left && player.x > 0){
		player.x -= player.speed;
	}
	if(right && player.x + playerImg.width < canvas.width){
		player.x += player.speed;
	}
	if(up && player.y > 0){
		player.y -= player.speed;
	}
	if(down && player.y + playerImg.height < canvas.height){
		player.y += player.speed;
	}
}

// direction of bullet is determined by direction player was moving when space was pressed
var shoot = function(){
	for(var i = 0; i < bullet.x.length; i++){
		if(bullet.direction[i] === "left"){
			bullet.x[i] -= bullet.speed;
		}
		if(bullet.direction[i] === "right"){
			bullet.x[i] += bullet.speed;
		}
		if(bullet.direction[i] === "up"){
			bullet.y[i] -= bullet.speed;
		}
		if(bullet.direction[i] === "down"){
			bullet.y[i] += bullet.speed;
		}
	}
}
var monstSetup = function(){
	// add new monster to board
	if(Math.random() < .01){
		monster.x.push(Math.random() * 500);
		monster.y.push(380);
		monster.speed.push(2);
		monster.state.push(true);
	}
	else if(Math.random() > .995){
		monster.x.push(0);
		monster.y.push(Math.random() * 400);
		monster.speed.push(2);
		monster.state.push(true);
	}

	for(var m = 0; m < monster.x.length; m++){
		if(monster.state[m]){
			cntxt.drawImage(monstImg, monster.x[m], monster.y[m]);

			// monsters track player
			var dx = player.x - monster.x[m];
			var dy = player.y - monster.y[m];
			var distance = Math.sqrt(dx*dx+dy*dy);
			var velX = (dx/distance) * monster.speed[m];
			var velY = (dy/distance) * monster.speed[m];
			
			// player dies when contacted by monster
			if(player.x < monster.x[m] + monstImg.width && player.x + playerImg.width > monster.x[m]
			&& player.y < monster.y[m] + monstImg.height && player.y + playerImg.height > monster.y[m]){
				dead = true;
			}
			// if monster is hit by bullet it disappears
			for(var b = 0; b < bullet.x.length; b++){
				if(bullet.state[b] && monster.x[m] < bullet.x[b] + bullet.width && monster.x[m] + monstImg.width > bullet.x[b]
				 && monster.y[m] < bullet.y[b] + bullet.height && monster.y[m] + monstImg.height > bullet.y[b]){
					 monster.state[m] = false;
					 bullet.state[b] = false;
					 kills++;
				 }
			}
		}
		
		monster.x[m] += velX;
		monster.y[m] += velY;
	}
}
var resetGame = function(){
	player.x = 200;
	player.y = 20;
	monster.x = [];
	monster.y = [];
	monster.state = [];
	bullet.x = [];
	bullet.y = [];
	bullet.state = [];
	bullet.direction = [];
}

var main = function(){
	cntxt.clearRect(0, 0, canvas.width, canvas.height);
	if(!dead){
		monstSetup();
		playerUpdate();
		drawBullet();
		shoot();
	}
	else{
		cntxt.fillStyle = "#0d001a";
		cntxt.font = "16px Helvetica";
		cntxt.textAlign = "center";
		cntxt.fillText("Use arrow keys to move", canvas.width/2, 100);
		cntxt.fillText("Press space to spit", canvas.width/2, 125);
		cntxt.fillText("PRESS S TO START!", canvas.width/2, 300);
		if(kills > 0){
			cntxt.font = "18px Helvetica";
			cntxt.fillText("You took out " + kills + " spiders!", canvas.width/2, 50)
		}
		
		resetGame();
	}

	requestAnimationFrame(main);
}

main();