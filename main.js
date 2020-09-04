//resolution:640x480
//16x16 tiles
//40x30
//characters: A:Ground
//            R:Character
//            P:Shops
//            T:blockers
//For now only identical values, fix later
screenY = 15;
screenX = 15;

// Create one dimensional array 
var world = new Array(screenX + 1);
var turnInterval = 1000; //turn interval in milliseconds
var personsVar = [];
var groundCharacter = "A";
var shopCharacter = "P";
var blockerCharacter = "T";
var personCharacter = "R";
var numberOfInfected = 0;
var personsOnScreen = 8; //have it be modifiable by an event such as a lockdown event. //user input
var population = 800000;//800 000  5% of those are on the streets
var numberOfHealthy = population;
var nonActiveScreens = 100;
var po = calculateNumberOfPeopleOutdoors(); //po : population outdoors. Percentage of the population that are outdoors
var ns = calculateNumberOfScreens();
var osi = 0; //offscreen infections
var cycle = 0;
var infectedInCycle = 0;
var cyclesToReset = 10;
var outdoorInfectionRate = calculateOutdoorInfectionRate();

function calculateNumberOfPeopleOutdoors(){
    return population * 0.05; //0.05% is the percentage of the population that are outdoors at any given time on average
}

function calculateNumberOfScreens(){
    return po / personsOnScreen;
}

function calculateOutdoorInfectionRate(){
    return (infectedInCycle / (cyclesToReset * personsOnScreen)) * 10
}

function calculateOffScreenInfectionsInCycle(){
    return ((population - po) / 100) * outdoorInfectionRate
}

//global virus threat level(between 0 and 1)
var GVTL = 0.9

// Loop to create 2D array using 1D array 
var personsPositions = new Array();

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
arrayUpdate(world, 3, 7, shopCharacter);
arrayUpdate(world, 8, 8, shopCharacter);
//initialize blockers
arrayUpdate(world, 1, 1, blockerCharacter);
arrayUpdate(world, 4, 1, blockerCharacter);
arrayUpdate(world, 5, 1, blockerCharacter);
arrayUpdate(world, 6, 1, blockerCharacter);
arrayUpdate(world, 7, 1, blockerCharacter);
arrayUpdate(world, 6, 3, blockerCharacter);
arrayUpdate(world, 7, 3, blockerCharacter);
arrayUpdate(world, 8, 3, blockerCharacter);

//Spawn persons
for (var i = 0; i < personsOnScreen; i++) { 
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
        if(person.moveQueue.length == 0){
            person.aStarPathFinding("random");
        }
    });
}

function resetThePersonsPositions(){
    personsPositions = new Array();
}

function findPersonByCoordinates(x, y){
    let personObject;
    personsVar.forEach(person => {
        if(person.y == y && person.x == x){
            //console.log(person)
            personObject = person
        }
    });
    return personObject;
}

function InfectAdjacentPersons(){
    var personObject;
    let adjacentPersonsCoordinates = new Array();
    personsPositions.forEach(personCoordinates => {
        personsPositions.forEach(personCoordinatesCompare => {
            let addedDifferenceBetweenPersonsCoordinates = (Math.abs(personCoordinates[1] - personCoordinatesCompare[1])) + (Math.abs(personCoordinates[0] - personCoordinatesCompare[0])); 
            if(addedDifferenceBetweenPersonsCoordinates == 1 || addedDifferenceBetweenPersonsCoordinates == 2){
                adjacentPersonsCoordinates.push(personCoordinatesCompare)
            }
        });
    });

    adjacentPersonsCoordinates.forEach(adjacentPersonCoordinates => {
        console.log(adjacentPersonCoordinates)
        personObject = findPersonByCoordinates(adjacentPersonCoordinates[1], adjacentPersonCoordinates[0]);
        console.log(personObject)
    });
    if(personObject != undefined){
        personObject.attemptToInfect();
    }

}

function turnUpdate(){
    cycle++;
    if(cycle == cyclesToReset){
        infectedInCycle = infectedInCycle + calculateOffScreenInfectionsInCycle();
        numberOfInfected = numberOfInfected + infectedInCycle;
        numberOfHealthy = numberOfHealthy - cycleInfections;
        //reset persons on screen
        infectedInCycle = 0;
    }

    resetThePersonsPositions();
    personsUpdateMovement();
    arrayDisplay();
    calculatePathForAllPersons();
    InfectAdjacentPersons();
    console.log(personsPositions);
    console.log(world);
    personsVar.forEach(person => {
        console.log(person.status);

    });
    console.log("numberOfHealthy: " + numberOfHealthy)
    console.log("numberOfInfected: " + numberOfInfected)

}

//function infect(healthyPerson)

console.log(world)

//display first world
arrayDisplay()

//update world in 1000 milisecond turns
setInterval(turnUpdate, turnInterval);