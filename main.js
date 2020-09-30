$("#sliderSpeed").slider({
    orientation:"horizontal",
    range:"min",
    max:1000,
    value:turnInterval,
    slide:changeSimulationSpeed,
    change:changeSimulationSpeed
})
$("#sliderSpeed").slider()

//display text map
arrayDisplay();

//update world in n milisecond turns
setInterval(turnUpdate, turnInterval);

function turnUpdate(){
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