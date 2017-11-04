//Tile size
var TILE_WIDTH = 101,
    TILE_HEIGHT = 83;

//Character Base object - Implement before usage
//constructor parameters: sprite image, x initial, y initial
var Character = function(sprite, x, y) {
    this.sprite = sprite;
    this.setX(x);
    this.setY(y);
};

//validates x coord before setting
Character.prototype.setX = function(x) {
    if (x >= -200 && x <= canvasWidth + TILE_WIDTH) {
        this.x = x;
    }
};

//validates y coord before setting
Character.prototype.setY = function(y) {
    if (y >= -20 && y <= canvasHeight - 2*TILE_HEIGHT) {
        this.y = y;
    }
};

// Draw the character on the screen, required method for game
Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function() {
    //Place enemy on right hand side on any of the 3 stone paths.
    var x = -Math.trunc(Math.random() * 30) - 80;
    var y = calcY(Math.trunc((Math.random()*3)) + 1);
    
    Character.call(this, 'images/enemy-bug.png', x, y);
    
    //randomize movement speed.
    this.movement = Math.trunc(Math.random()*100) + 50;
};

//Extend Character
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.setX(this.movement*dt + this.x);
    //ensures the sprite is within the boundries
    //removing self once it goes off the map.
    if(this.x>canvasWidth || this.x + TILE_WIDTH < 0) {
        this.removeSelf();
    }
    
    //Calculate collisions
    //checking for collisions. If collided with player, player loses.

    if(this.y == player.y) {
        if (this.x > player.x) {
            if(player.x + 90 > this.x) {
                player.loss();
            }
        }
        else {
            if(this.x + 90 > player.x) {
                player.loss();
            }
        }
    }
    
};


//Removes self from the allEnemies array and generates a new enemy
Enemy.prototype.removeSelf = function () {
    console.log(this.y + " " + this.x);
    var i = allEnemies.indexOf(this);
    allEnemies[i] = new Enemy();
};

//total number of enemies to be generated.
Enemy.count = 3;


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    var sprite = 'images/char-boy.png';
    
    // set location of the player
    var x = 200;
    var y = calcY(5);
    
    Character.call(this, sprite, x, y);
};

//Extend Character
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

//update setX to stay on map
Player.prototype.setX = function(x) {
    
    if (x <= canvasWidth - 101 && x >= -20) {
        this.x = x;
    }
};

//checks for collision and win or loss
Player.prototype.update = function() {
    //if water, win
    if (this.y < 0) {
        this.win();
        return;
    }
};

//Moves the player
Player.prototype.handleInput = function(key) {
    if (key == "up") {
        this.setY(this.y + incY(-1));
    }
    else if(key == "down") {
        this.setY(this.y + incY(1));
    }
    else if(key == "left") {
        this.setX(this.x- 101);
    }
    else if(key == "right") {
        this.setX(this.x + 101);
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
    this.x = 200;
    this.y = calcY(5);
};

//y starting coordinate
var calcY = function(y) {
    return y*83 - 20;
};

//y incrementation
var incY = function(y) {
    return y*83;
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
