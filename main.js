//resolution:640x480
//16x16 tiles
//40x30
//characters: A:Ground
//            R:Character
//            P:Shops
//            T:blockers
//For now only identical values, fix later
screenY = 6;
screenX = 6;
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
    world[i] = [31]; 
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
arrayUpdate(world, 5, 4, shopCharacter);
arrayUpdate(world, 0, 1, blockerCharacter);
arrayUpdate(world, 1, 1, blockerCharacter);
arrayUpdate(world, 2, 1, blockerCharacter);
arrayUpdate(world, 3, 1, blockerCharacter);

//Spawn persons
for (var i = 0; i < personsToSpawn; i++) { 
    var randX = Math.floor(Math.random() * (screenX));
    var randY = Math.floor(Math.random() * (screenY))
    while(world[randY][randX] == "T" || world[randY][randX] == "P"){
        randX = Math.floor(Math.random() * (screenX));
        randY = Math.floor(Math.random() * (screenY))
    }
    personsVar[i] = new Person(randY, randX);
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