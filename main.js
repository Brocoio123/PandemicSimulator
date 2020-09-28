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
var firstNames = ["Aaren","Aarika","Abagael","Abagail","Abbe","Abbey","Abbi","Bella","Benny","Beret",
                "Bernie","Berry","Bert","Billy","Britney","Clarie","Clarinda","Clea","Clem","Colly",
                "Connie","Constance","Dianna","Dido","Dominique","Elonore","Florry","Frances","Francesca",
                "Francine","Frank","Hope","Ingrid","Jacynth","Jade","Jaimie","Karmen","Karna","Karol",
                "Kathleen","Lauree","Lauren","Mandy","Manon","Manya","Ofelia","Quinn","Rahal","Randy","Shane",
                "Shannon","Shara","Shaun","Ted","Teddy","Vera","Veradis","Vere","Verena","Veronica","Vivyan"
            ];

var lastNames = ["Smith","Johnson","Williams","Brown","Jones","Miller","Davis","Garcia","Rodriguez",
                "Wilson","Martinez","Anderson","Taylor","Thomas","Hernandez","Moore","Martin","Jackson",
                "Thompson","White","Lopez","Lee","Gonzalez","Harris","Clark","Lewis","Robinson","Walker",
                "Perez","Hall","Young","Allen","Sanchez","Wright","King","Scott","Green","Baker","Adams",
                "Nelson","Hill","Ramirez","Campbell","Mitchell","Roberts","Carter","Phillips","Evans",
                "Turner","Torres","Parker","Collins","Edwards","Stewart","Flores","Morris","Nguyen",
            ]

console.log(firstNames)
console.log(lastNames)

var world = new Array(screenX + 1);
var turnInterval = 1000; //turn interval in milliseconds //3260
var preventionAvaiable = ["Hand washing", "Social distancing", "Mask", "Gloves", "Hazmat"];
var personsVar = [];
var groundCharacter = "A";
var shopCharacter = "P";
var blockerCharacter = "T";
var personCharacter = "R";
var personsOnScreen = 13; //have it be modifiable by an event such as a lockdown event. //user input
var population = 800000; //800 000  5% of those are on the streets
var numberOfStage1Infected = 0;
var numberOfStage2Infected = 0;
var numberOfStage3Infected = 0;
var numberOfHealthy = population;
var numberOfDead = 0;
var numberOfRecovered = 0;
var po = calculateNumberOfPeopleOutdoors(); //po : population outdoors. Percentage of the population that are outdoors
var ns = calculateNumberOfScreens();
var osi = 0; //offscreen infections
var hours = 0;
var infectedInOneDay = 0;
var infectedThePreviousDay = 0;
var hoursReset = 24;
var outdoorInfectionRate = 0;
var indoorInfectionRate = 0;
var mortalityRate;
var recoveryRate;
var nbOfSprites = 6;
var personsPositions = new Array();
//var lockdownLevel = 0; //0%
var jsonPersons;
var GVTL = 0.1; //global virus threat level(between 0 and 1)
var infectionEventWeight = 1;
var recoveryEventWeight = 1;
var mortalityEventWeight = 1;
var events;
var activeEvents = [];
var destinationSpots = [[3, 7], [12, 2], [5, 0], [2, 3], [12, 12], [7, 13], [7, 7]];
var blockerSpots =  [[4, 0], [5, 0], [4, 1], [5, 1], [4, 2], [5, 2], [3, 12], [4, 12],
                    [4, 13], [4, 14], [4, 15], [2, 12], [6, 0], [6, 7], [5, 7], [8,6], 
                    [8, 5], [9, 3], [9, 4], [9, 5]];

$.getJSON("events.json", function(json) {
    events = json;
    console.log(events)
});

function eventProcessing(){
    let hundredPercentRand;
    let tempJsonEffects;
    let tempEffects;
    events[GVTL.toFixed(1)].forEach(event => {
        hundredPercentRand = Math.random() * 100;
        if(!activeEvents.includes(event.Event_name)){
            if(hundredPercentRand <= event.Base_probability){
                activeEvents.push(event.Event_name);
                tempJsonEffects = event.Effect.split(',');
                tempJsonEffects.forEach(tempJsonEffect => {
                    tempEffects = tempJsonEffect.split(" ");
                    window[tempEffects[0]] += parseInt(tempEffects[1]);
                });
            }
        }
    });
}

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
    while(world[randY][randX] == "T" || world[randY][randX] == "P"){
        randX = Math.floor(Math.random() * (screenX));
        randY = Math.floor(Math.random() * (screenY));
    }
    personsVar[i] = new Person(randX, randY, i);
}

//display text map
arrayDisplay();

//update world in n milisecond turns
setInterval(turnUpdate, turnInterval);

function calculateMortalityAndRecoveryRates(){
    mortalityRate = ((GVTL/GVTL*10)/20)*mortalityEventWeight;
    recoveryRate = ((GVTL/GVTL*10)/20)*recoveryEventWeight;
}

function calculateOutdoorInfectionRate(){
    outdoorInfectionRate = (Math.random() * ((infectedInOneDay / personsOnScreen) - ((infectedInOneDay / personsOnScreen)/1.5) ) + ((infectedInOneDay / personsOnScreen)/1.5)/2.5)

}

function calculateIndoorInfectionRate(){//staying indoors reduce infection chance by up to 80%!
    indoorInfectionRate = Math.random() * (outdoorInfectionRate * (GVTL/3) - ((outdoorInfectionRate * (GVTL/3))/1.5) ) + ((outdoorInfectionRate * (GVTL/3))/2);

    if(indoorInfectionRate == 0){
         indoorInfectionRate = Math.random() * (((GVTL*GVTL)*(GVTL/3)) - ((GVTL*GVTL)*(GVTL/3)/1.5)) + ((GVTL*GVTL)*(GVTL/3)/1.5)

    }
}

function killOrRecoverOrAdvanceInfecion(){
    for (var i = 0; i < numberOfStage1Infected; i++) {
        if(Math.random() * 100 < recoveryRate){
            numberOfRecovered += 1;
            numberOfStage1Infected -= 1;
        }else if(Math.random() * 100 < mortalityRate*0.5){
            numberOfDead += 1;
            population -= 1;
            numberOfStage1Infected -= 1;
        }else if(Math.random() * 100 < indoorInfectionRate + (numberOfStage1Infected/1000)){
            numberOfStage1Infected -= 1;
            numberOfStage2Infected += 1;
        }
    }

    for (var i = 0; i < numberOfStage2Infected; i++) {
        if(Math.random() * 100 < recoveryRate){
            numberOfRecovered += 1;
            numberOfStage2Infected -= 1;
        }else if(Math.random() * 100 < mortalityRate){
            numberOfDead += 1;
            population -= 1;
            numberOfStage2Infected -= 1;
        }else if(Math.random() * 100 < indoorInfectionRate+ (numberOfStage2Infected/1000)){
            numberOfStage2Infected -= 1;
            numberOfStage3Infected += 1;
        }
    }

    for (var i = 0; i < numberOfStage3Infected; i++) {
        if(Math.random() * 100 < recoveryRate){
            numberOfRecovered += 1;
            numberOfStage3Infected -= 1;
        }else if(Math.random() * 100 < mortalityRate * 1.5){
            numberOfDead += 1;
            population -= 1;
            numberOfStage3Infected -= 1;
        }
    }
}

function calculateNumberOfInfected(){
    numberOfStage1Infected += infectedInOneDay;
    numberOfHealthy -= infectedInOneDay;
}

function calculateIndoorInfections(){
    return Math.round(((population - po) * indoorInfectionRate)/1.7); //indoor infections
}

function calculateOutdoorInfections(){
    return Math.round((po * outdoorInfectionRate)/10);
}

function calculateNumberOfPeopleOutdoors(){
    return population * 0.05; //0.05% is the percentage of the population that are outdoors at any given time on average
}

function calculateNumberOfScreens(){
    return po / personsOnScreen;
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

function ReplacePersons(){
    personsVar.forEach(person => {
        person.status = "healthy"
        person.calculatePanicIndex();
        person.calculateCautionIndex();
        person.calculatePreventionMeasures();
        person.calculatePreventionMutator();
        person.calculateInfectionChance();
        person.setSpriteId();
        canvasPersons[person.id].spriteId = person.spriteId;
        person.name = firstNames[Math.floor(Math.random() * firstNames.length)] + " " 
                    + lastNames[Math.floor(Math.random() * lastNames.length)];
    });
}

function turnUpdate(){
    hours++;
    eventProcessing();
    if(hours % hoursReset == 0){
        calculateMortalityAndRecoveryRates();
        calculateOutdoorInfectionRate();
        calculateIndoorInfectionRate();
        console.log(outdoorInfectionRate)
        console.log(indoorInfectionRate)
        console.log(calculateOutdoorInfections())
        console.log(calculateIndoorInfections())
        infectedInOneDay = infectedInOneDay + calculateIndoorInfections() + calculateOutdoorInfections();
        //recovered
        calculateNumberOfInfected();
        killOrRecoverOrAdvanceInfecion();
        infectedThePreviousDay = infectedInOneDay;
        infectedInOneDay = 0;
        refreshDestinations();
        refreshBlockers();
        ReplacePersons();
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
    displayWorldInformation();
}