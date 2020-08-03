//resolution:640x480
//16x16 tiles
//40x30
//characters: A:Ground
//            R:Character
//            P:Shops
//            T:blockers
//For now only identical values, fix later
screenY = 14;
screenX = 14;
// Create one dimensional array 
var world = new Array(screenX + 1);
var turnInterval = 1000; //turn interval in milliseconds
var personsToSpawn = 2;
var personsVar = [];
var groundCharacter = "A";
var shopCharacter = "P";
var blockerCharacter = "T";
var personCharacter = "R";
// Loop to create 2D array using 1D array 

for (var i = 0; i < world.length; i++) { 
    world[i] = [31]; 
} 
var h = 0; 

// Loop to initilize 2D array elements. 
for (var i = 0; i < screenY; i++) { 
    for (var j = 0; j < screenX; j++) { 
  
        world[j][i] = "A";
    } 
} 
//initialize shop
arrayUpdate(world, 2, 0, shopCharacter);
//arrayUpdate(world, 24, 23, shopCharacter);
arrayUpdate(world, 0, 1, blockerCharacter);
arrayUpdate(world, 1, 1, blockerCharacter);
arrayUpdate(world, 2, 1, blockerCharacter);
arrayUpdate(world, 3, 1, blockerCharacter);
arrayUpdate(world, 4, 1, blockerCharacter);
arrayUpdate(world, 5, 1, blockerCharacter);
arrayUpdate(world, 6, 1, blockerCharacter);
arrayUpdate(world, 7, 1, blockerCharacter);
arrayUpdate(world, 6, 3, blockerCharacter);
arrayUpdate(world, 7, 3, blockerCharacter);
arrayUpdate(world, 8, 3, blockerCharacter);
arrayUpdate(world, 9, 3, blockerCharacter);
arrayUpdate(world, 10, 3, blockerCharacter);
arrayUpdate(world, 11, 3, blockerCharacter);
arrayUpdate(world, 12, 3, blockerCharacter);
arrayUpdate(world, 13, 3, blockerCharacter);

//Spawn persons
for (var i = 0; i < personsToSpawn; i++) { 
    var randX = Math.floor(Math.random() * (screenX));
    var randY = Math.floor(Math.random() * (screenY));
    while(world[randY][randX] == "T" || world[randY][randX] == "P"){
        randX = Math.floor(Math.random() * (screenX));
        randY = Math.floor(Math.random() * (screenY));
    }
    personsVar[i] = new Person(randX, randY);
} 

function personsUpdateMovement(){
    var oldY = 0;
    var oldX = 0;
    //change to foreach
    for (var i = 0; i < personsVar.length; i++) {
        oldY = personsVar[i].y;
        oldX = personsVar[i].x;
        personsVar[i].nextMove();
        if(personsVar[i].y != oldY || personsVar[i].x != oldX){
            arrayUpdate(world, oldX , oldY, groundCharacter);
        }
    } 
}

function arrayDisplay(Y = screenY, X = screenX){
    document.getElementById("world").innerHTML = '';
    for (var i = 0; i < Y; i++) {
        for (var j = 0; j < X; j++)
        {
            ///////////////////////////////////////////////////////////////////
            ///Why does it displays correctly only when i write world[i][j]?///
            ///////////////////////////////////////////////////////////////////
            document.getElementById("world").innerHTML += world[i][j] + " ";
        }
        document.getElementById("world").innerHTML += "<br>";
    }
}

function arrayUpdate(array, y, x, content){
    array[y][x] = content;
}

function calculatePathForAllPersons(personToCalculatePath){
    // if(personToCalculatePath.moveQueue.length == 0){
    //     personToCalculatePath.aStarPathFinding();
    // }
    personsVar.forEach(person => {
        person.aStarPathFinding();
    });
}

function turnUpdate(){
    personsUpdateMovement();
    arrayDisplay();
    calculatePathForAllPersons();
}

//function infect(healthyPerson)

console.log(world)
//display first world
arrayDisplay()

//update world in 1000 milisecond turns
setInterval(turnUpdate, turnInterval);