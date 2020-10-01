if(turnInterval/1000 == 1){
    document.getElementById("speedText").innerHTML = "Hour duration: " + (turnInterval/1000) + " second";
}else{
    document.getElementById("speedText").innerHTML = "Hour duration: " + (turnInterval/1000) + " seconds";
}

var mainInterval;

$("#sliderSpeed").slider({
    orientation:"horizontal",
    range:false,
    max:10000,
    value:turnInterval,
    // slide:updateSpeedOnScreen,
    change:SliderValueChange
})
$("#sliderSpeed").slider()

//display text map
arrayDisplay();

//update world in n milisecond turns
mainInterval = setInterval(turnUpdate, turnInterval);

//choose better name, there's already one "update".
function updateTheScreen(){
    changeSpeedTrigger = false;
    simulationSpeedChange()
    drawInCanvas();
    clearInterval(mainInterval);
    mainInterval = setInterval(turnUpdate, turnInterval);
}


function turnUpdate(){
    if(changeSpeedTrigger){
        updateTheScreen();
        return;
    }
    console.log(turnInterval)
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