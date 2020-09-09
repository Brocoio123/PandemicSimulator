//resolution:640x480
//16x16 tiles
//40x30
//characters: A:Ground
//            R:Character
//            P:Shops
//            T:blockers
//For now only identical values, fix later
var screenY = 15;
var screenX = 15;

// Create one dimensional array 
var world = new Array(screenX + 1);
var turnInterval = 1000; //turn interval in milliseconds //3260
var personsVar = [];
var groundCharacter = "A";
var shopCharacter = "P";
var blockerCharacter = "T";
var personCharacter = "R";
var numberOfInfected = 0;
var personsOnScreen = 13; //have it be modifiable by an event such as a lockdown event. //user input
var population = 800000; //800 000  5% of those are on the streets
var numberOfHealthy = population;
var nonActiveScreens = 100;
var po = calculateNumberOfPeopleOutdoors(); //po : population outdoors. Percentage of the population that are outdoors
var ns = calculateNumberOfScreens();
var osi = 0; //offscreen infections
var cycle = 0;
var infectedInCycle = 0;
var cyclesToReset = 10;
var outdoorInfectionRate = calculateOutdoorInfectionRate();
var turnPassed = false;
var nbOfSprites = 6;
var personsPositions = new Array();
var GVTL = 0.9; //global virus threat level(between 0 and 1)
var destinationSpots = [[3, 7], [12, 2], [5, 0], [2, 3], [12, 12], [7, 13], [7, 7]];
var blockerSpots =  [[4, 0], [5, 0], [4, 1], [5, 1], [4, 2], [5, 2], [3, 12], [4, 12],
                    [4, 13], [4, 14], [4, 15], [2, 12], [6, 0], [6, 7], [5, 7], [8,6], 
                    [8, 5], [9, 3], [9, 4], [9, 5]];
// Loop to create 2D array using 1D array 
for (var i = 0; i < world.length; i++) { 
    world[i] = [31]; 
}

// Loop to initilize 2D array elements. 
for (var i = 0; i < screenY; i++) {
    for (var j = 0; j < screenX; j++) {
        world[j][i] = "A";
    } 
}

refreshDestinations();
refreshBlockers();

//Spawn persons
for (var i = 0; i < personsOnScreen; i++) { 
    var randX = Math.floor(Math.random() * (screenX));
    var randY = Math.floor(Math.random() * (screenY));
    var randSpriteId = Math.floor(Math.random() * (nbOfSprites));
    while(world[randY][randX] == "T" || world[randY][randX] == "P"){
        randX = Math.floor(Math.random() * (screenX));
        randY = Math.floor(Math.random() * (screenY));
    }
    personsVar[i] = new Person(randX, randY, i, randSpriteId);
}

//display text map
arrayDisplay();

//update world in n milisecond turns
setInterval(turnUpdate, turnInterval);

function calculateNumberOfPeopleOutdoors(){
    return population * 0.05; //0.05% is the percentage of the population that are outdoors at any given time on average
}

function calculateNumberOfScreens(){
    return po / personsOnScreen;
}

function calculateOutdoorInfectionRate(){
    return (infectedInCycle / (cyclesToReset * personsOnScreen)) * 10;
}

function calculateOffScreenInfectionsInCycle(){
    return ((population - po) / 100) * outdoorInfectionRate;
}

function refreshDestinations(){
    destinationSpots.forEach(destinationSpot => {
        arrayUpdate(world, destinationSpot[0], destinationSpot[1], shopCharacter);
    });
}

function refreshBlockers(){
    blockerSpots.forEach(blockerSpot => {
        arrayUpdate(world, blockerSpot[0], blockerSpot[1], blockerCharacter);
    });
}

function personsUpdateMovement(){
    //console.log("ERROR main!!!!!!!!!!")
    let oldY = 0;
    let oldX = 0;
    for (var i = 0; i < personsVar.length; i++) {
        oldY = personsVar[i].y;
        oldX = personsVar[i].x;
        personsVar[i].nextMove();
        if(personsVar[i].y != oldY || personsVar[i].x != oldX){
            if(world[oldX][oldY] != blockerCharacter){
                arrayUpdate(world, oldX , oldY, groundCharacter);
            }
        }
    } 
}

function arrayDisplay(Y = screenY, X = screenX){
    document.getElementById("world").innerHTML = '';
    for (var i = 0; i < Y; i++) {
        for (var j = 0; j < X; j++)
        {
            document.getElementById("world").innerHTML += world[i][j] + " ";
        }

        document.getElementById("world").innerHTML += "<br>";
    }
}

function arrayUpdate(array, y, x, content){
    array[y][x] = content;
}

function calculatePathForAllPersons(){
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
            personObject = person;
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
                adjacentPersonsCoordinates.push(personCoordinatesCompare);
            }
        });
    });

    adjacentPersonsCoordinates.forEach(adjacentPersonCoordinates => {
        personObject = findPersonByCoordinates(adjacentPersonCoordinates[1], adjacentPersonCoordinates[0]);
    });
    if(personObject != undefined){
        personObject.attemptToInfect();
    }
}

function turnUpdate(){
    turnPassed = true;
    cycle++;
    if(cycle % cyclesToReset == 0){
        infectedInCycle = infectedInCycle + calculateOffScreenInfectionsInCycle();
        numberOfInfected = numberOfInfected + infectedInCycle;
        numberOfHealthy = numberOfHealthy - infectedInCycle;
        //reset persons on screen
        infectedInCycle = 0;
        refreshDestinations();
        refreshBlockers();
        console.log("REFRESHED!!!!!");
    }
    updatePreviousPositionValues();
    resetThePersonsPositions();
    personsUpdateMovement();
    arrayDisplay();
    calculatePathForAllPersons();
    InfectAdjacentPersons();
    synchronizePersonsAndCanvasPersons();
    animateCanvasPersons();
}