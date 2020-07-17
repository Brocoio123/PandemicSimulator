//resolution:640x480
//16x16 tiles
//40x30
//characters: A:Ground
//            R:Character
//            P:Shops
//            T:blockers
screenX = 20;
screenY = 25;
// Create one dimensional array 
var world = new Array(screenX + 1); 
var turnInterval = 400000; //turn interval in milliseconds
var personsToSpawn = 1;
var personsVar = [];
var groundCharacter = "A";
var shopCharacter = "P";
var blockerCharacter = "T";
// Loop to create 2D array using 1D array 

for (var i = 0; i < world.length; i++) { 
    world[i] = [30]; 
} 
var h = 0; 

// Loop to initilize 2D array elements. 
for (var i = 0; i < screenX; i++) { 
    for (var j = 0; j < screenY; j++) { 
  
        world[i][j] = "A";
    } 
} 
//initialize shop
arrayUpdate(world, 0, 0, shopCharacter);
arrayUpdate(world, 0, 20, shopCharacter);
arrayUpdate(world, 9, 20, shopCharacter);
arrayUpdate(world, 15, 23, shopCharacter);
arrayUpdate(world, 0, 1, blockerCharacter);
arrayUpdate(world, 1, 1, blockerCharacter);
arrayUpdate(world, 2, 1, blockerCharacter);
arrayUpdate(world, 3, 1, blockerCharacter);
arrayUpdate(world, 4, 1, blockerCharacter);
arrayUpdate(world, 5, 1, blockerCharacter);
arrayUpdate(world, 6, 1, blockerCharacter);
arrayUpdate(world, 7, 1, blockerCharacter);
arrayUpdate(world, 8, 1, blockerCharacter);
arrayUpdate(world, 9, 1, blockerCharacter);

//Spawn persons
for (var i = 0; i < personsToSpawn; i++) { 
    personsVar[i] = new Person(Math.floor(Math.random() * (screenX)), Math.floor(Math.random() * (screenY)));
} 

function personsUpdateMovement(){
    var oldX = 0;
    var oldY = 0;
    for (var i = 0; i < personsVar.length; i++) {
        oldX = personsVar[i].x;
        oldY = personsVar[i].y;
        personsVar[i].nextMove();
        // console.log("oldX: " + oldX);
        // console.log("oldY: " + oldY);
        // console.log("newX: " + personsVar[i].x);
        // console.log("newY: " + personsVar[i].y);
        if(personsVar[i].x != oldX || personsVar[i].y != oldY){
            arrayUpdate(world, oldX, oldY, groundCharacter);
        }
        
    } 
}

function arrayDisplay(X = screenX, Y = screenY){
    console.log(Date.now());
    document.getElementById("world").innerHTML = '';
    for (var i = 0; i < X; i++) {
        for (var j = 0; j < Y; j++)
        {
            // window.onload = function() {
                document.getElementById("world").innerHTML += world[i][j] + " "; //document.write(world[i][j] + " ");
                
            // }
        }
        document.getElementById("world").innerHTML += "<br>";
    }
}

function arrayUpdate(array, x, y, content){
    array[x][y] = content;
}

function turnUpdate(){
    personsUpdateMovement();
    arrayDisplay();

}



console.log(world)
//display first world
arrayDisplay()

//update world in 1000 milisecond turns
setInterval(turnUpdate, turnInterval);

personsVar[0].aStarPathFinding();