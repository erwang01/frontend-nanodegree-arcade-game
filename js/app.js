// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    
    //Place enemy on right hand side on any of the 3 stone paths.
    this.x = -Math.trunc(Math.random() * 30) - 80;
    setY(Math.trunc((Math.random()*3)) + 1, this);
    
    //randomize movement speed.
    this.movement = Math.trunc(Math.random()*100) + 50;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.movement*dt;
    //ensures the sprite is within the boundries
    //removing self once it goes off the map.
    if(this.x>canvasWidth || this.x + 101 < 0) {
        this.removeSelf();
    }
   // if(this.y<50 || this.y > 225) {
   //     this.removeSelf();
   // }
};


//Removes self from the allEnemies array and generates a new enemy
Enemy.prototype.removeSelf = function () {
    console.log(this.y + " " + this.x);
    var i = allEnemies.indexOf(this);
    allEnemies[i] = new Enemy();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//total number of enemies to be generated.
Enemy.count = 3;

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
    
    // set location of the player
    this.x = 200;
    setY(5, this);
};

//checks for collision and win or loss
Player.prototype.update = function() {
    var collision = false;
    // Is there a more efficient way than creating a referance to player such 
    // that it can still be accessed in the for each loop?
    var player = this; 

    //checking for collisions
    allEnemies.forEach(function(enemy) {
        if(enemy.y == player.y) {
            if (enemy.x > player.x) {
                collision = (player.x + 90 > enemy.x) || collision;
            }
            else {
                collision = (enemy.x + 90 > player.x) || collision;
            }
        }
    });
    
    if(this.x > canvasWidth-101) {
        this.x = canvasWidth - 101;
    }
    else if(this.x < 0) {
        this.x = 0;
    }
    
    //if collision, lost
    if (collision) {
        this.loss();
        return;
    }
    
    //if no collision and water, win
    if (this.y < 0) {
        this.win();
        return;
    }
};

//renders the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Moves the player
Player.prototype.handleInput = function(key) {
    if (key == "up") {
        incrementY(-1, this);
    }
    else if(key == "down") {
        incrementY(1, this);
    }
    else if(key == "left") {
        this.x -= 101;
    }
    else if(key == "right") {
        this.x += 101;
    }
};

//When the player wins
Player.prototype.win = function() {
    console.log("Win");
    this.reset();
};

//When the player loses
Player.prototype.loss = function() {
    console.log("Loss");
    this.reset();
};

//resetting the board
Player.prototype.reset = function() {
    setY(5, this);
    this.x = 200;
};

//Sets the y coordinate of the player/enemy depending on the row fed in.
var setY = function(y, object) {
    y = y*83 - 20;
    if (y >= -171 && y < canvasHeight-171) {
        object.y = y;
    }
};

//increments y coordinate
var incrementY = function(increment, object) {
    var y = object.y + increment*83;
    if (y >= -171 && y < canvasHeight-171) {
        object.y = y;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i = 0; i < Enemy.count; i++) {
    allEnemies.push(new Enemy());
}

// Place the player object in a variable called player
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
