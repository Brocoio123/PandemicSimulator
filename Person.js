class Person{
    constructor(y, x, id, spriteId){
        this.y = y;
        this.x = x;
        this.id = id;
        this.spriteId = spriteId;
        this.PI;
        this.CI;
        this.preventionMeasures = []; //this indicates whether this person wears a mask, gloves, practices social distancing, etc...
        this.preventionMutator = 0; //this changes the variable IC below according to life choices made by this person
        this.IC;
        this.status = "healthy";
        this.name = firstNames[Math.floor(Math.random() * firstNames.length)] + " " 
                    + lastNames[Math.floor(Math.random() * lastNames.length)];
        this.currentMovementVector = [];
        this.moveQueue = [];
        arrayUpdate(world, this.x, this.y, personCharacter);
        this.calculatePanicIndex();
        this.calculateCautionIndex();
        this.calculatePreventionMeasures();
        this.calculatePreventionMutator();
        this.calculateInfectionChance();
        this.setSpriteId()
    }

    setSpriteId = function(){
        this.spriteId = Math.floor(Math.random() * (nbOfSprites));
    }

    calculatePreventionMeasures = function(){
        this.preventionMeasures = [];
        this.preventionMeasures.length = 0;
        console.log(this.preventionMeasures)
        let preventionRand = 0;
        let hundredPercentRand;
        if(this.CI >= 10){
            for (var i = 0, len = preventionAvaiable.length; i < len; i++) {
                switch(preventionAvaiable[i]) {
                    case "Hand washing":
                        preventionRand = Math.random() * (this.CI + 70);
                        break;
                    case "Social distancing":
                        preventionRand = Math.random() * (this.CI + 30);
                        break;
                    case "Mask":
                        preventionRand = Math.random() * (this.CI + 10);
                        break;
                    case "Gloves":
                        preventionRand = Math.random() * (this.CI + 5);
                        break;
                    case "Hazmat":
                        preventionRand = Math.random() * (this.CI - 60);
                        break;
                }
                hundredPercentRand = Math.random() * 100;
                if(hundredPercentRand <= preventionRand){
                    this.preventionMeasures.push(preventionAvaiable[i]);
                }
            }
        }
    }

    calculatePreventionMutator = function(){
        this.preventionMutator = 0;
        for (var i = 0, len = this.preventionMeasures.length; i < len; i++) {
            switch(this.preventionMeasures[i]) {
                case "Hand washing":
                    this.preventionMutator += 0.14;
                    break;
                case "Social distancing":
                    this.preventionMutator += 0.15;
                    break;
                case "Mask":
                    this.preventionMutator += 0.14;
                    break;
                case "Gloves":
                    this.preventionMutator += 0.02;
                    break;
                case "Hazmat":
                    this.preventionMutator += 0.9;
                    break;
            }
        }
        if(this.preventionMutator >= 1){
            this.preventionMutator = 0.99;
        }
    }

    deletePerson = function(){
        arrayUpdate(world, this.x, this.y, groundCharacter);
        delete this;
    }

    attemptToInfect = function(){
        // console.log("Attempting to infect...")
        // console.log("IC: " + this.IC)
        let infectRand = Math.random() * 100;
        // console.log("infectRand: " + infectRand)
        if(infectRand <= this.IC){
            this.status = "infected";
            numberOfHealthy--;
            numberOfStage1Infected++;
            infectedInOneDay++;
        }
    }

    //calculate the panic of people, since people react differently to crisies, the value is randomized
    //according the overral state of the crisis
    calculatePanicIndex = function(){
        // this.PI =  Math.random() * (GVTL*100);
        this.PI = Math.random() * ((GVTL*100) - ((GVTL*100)/1.5)) + ((GVTL*100)/1.5)
    }

    calculateCautionIndex = function(){
        //this.CI =  (this.PI/2) / GVTL;
        this.CI = Math.random() * ((this.PI*1.5) - (this.PI/1.5)) + (this.PI/1.5)
    }

    //calculate the infection chance of this person
    //maxInfectionPercentage = (WI+CI+PI)*GVTL
    calculateInfectionChance = function(){
        this.IC =  ((this.CI + this.PI) * GVTL) - (((this.CI + this.PI) * GVTL) * this.preventionMutator);
    }

    nextMove = function(){
        let nextMovevar = this.moveQueue.pop();
        this.movePerson(nextMovevar);
    }

    movePerson = function(direction){
        switch (direction) {
            case "left":
                if(this.y != 0){
                    if(world[this.x][this.y - 1] == personCharacter || world[this.x][this.y - 1] == shopCharacter || world[this.x][this.y - 1] == blockerCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("random");
                        return;
                    }

                    this.y--;
                    this.currentMovementVector = [0, -1];
                }
                else{
                    this.moveQueue.push("left");
                }
                break;
            case "left-up":
                if(this.y != 0 && this.x != 0){
                    if(world[this.x - 1][this.y - 1] == personCharacter || world[this.x - 1][this.y - 1] == shopCharacter || world[this.x - 1][this.y - 1] == blockerCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("random");
                        return;
                    }

                    this.y--;
                    this.x--;
                    this.currentMovementVector = [-1, -1];
                }
                else{
                    this.moveQueue.push("left-up");
                }
                break;
            case "up":
                if(this.x != 0){
                    if(world[this.x - 1][this.y] == personCharacter || world[this.x - 1][this.y] == shopCharacter || world[this.x - 1][this.y] == blockerCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("random");
                        return;
                    }

                    this.x--;
                    this.currentMovementVector = [-1, 0];
                }
                else{
                    this.moveQueue.push("up");
                }
                break;
            case "right-up":
                if(this.y < (screenY - 1) && this.x != 0){
                    if(world[this.x - 1][this.y + 1] == personCharacter || world[this.x - 1][this.y + 1] == shopCharacter || world[this.x - 1][this.y + 1] == blockerCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("random");
                        return;
                    }

                    this.y++;
                    this.x--;
                    this.currentMovementVector = [-1, 1];
                }
                else{
                    this.moveQueue.push("right-up");
                }
                break;
            case "right":
                if(this.y < (screenY - 1)){
                    if(world[this.x][this.y + 1] == personCharacter || world[this.x][this.y + 1] == shopCharacter || world[this.x][this.y + 1] == blockerCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("random");
                        return;
                    }

                    this.y++;
                    this.currentMovementVector = [0, 1];
                }
                else{
                    this.moveQueue.push("right");
                }
                break;
            case "right-down":
                if(this.y < (screenY - 1) && this.x < (screenX - 1)){
                    if(world[this.x + 1][this.y + 1] == personCharacter || world[this.x + 1][this.y + 1] == shopCharacter || world[this.x + 1][this.y + 1] == blockerCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("random");
                        return;
                    }

                    this.y++;
                    this.x++;
                    this.currentMovementVector = [1, 1];
                }
                else{
                    this.moveQueue.push("right-down");
                }
                break;
            case "down":
                if(this.x < (screenX - 1)){
                    if(world[this.x + 1][this.y] == personCharacter || world[this.x + 1][this.y] == shopCharacter || world[this.x + 1][this.y] == blockerCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("random");
                        return;
                    }

                    this.x++;
                    this.currentMovementVector = [1, 0];
                }
                else{
                    this.moveQueue.push("down");
                }
                break;
            case "left-down":
                if(this.y != 0 && this.x < (screenX - 1)){
                    if(world[this.x][this.y - 1] == personCharacter || world[this.x][this.y - 1] == shopCharacter || world[this.x][this.y - 1] == blockerCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("random");
                        return;
                    }

                    this.y--;
                    this.x++;
                    this.currentMovementVector = [1, -1];
                }
                else{
                    this.moveQueue.push("left-down");
                }
                break;
          }

          personsPositions.push([this.y, this.x]);
          arrayUpdate(world, this.x, this.y, personCharacter);
    }

    //Algorithm to find the shortest path to its destination
    //destination should be either "random" or "closest"
    aStarPathFinding = function(destination = "closest"){
        let aStarGrid = new Array(screenY + 1);
        let openedNodes = new Array();
        let closedNodes = new Array();
        let currentNodeCoordinates = [this.x, this.y];
        let pathEnd = false;
        let nextNodeToClose = openedNodes[0];
        let shopNodes = new Array();
        let e = 0;
        let ClosestShopCoordinates;

        
        for (let i = 0; i < aStarGrid.length; i++) {
            aStarGrid[i] = [30];
        }

        //Shop is selected as the end node based on closeness to the Person or randomness
        for (let i = 0; i < screenY; i++) {
            for (let j = 0; j < screenX; j++) {
                if(world[j][i] == shopCharacter){
                    shopNodes[e] = [j,i];
                    e++;
                }
            }
        }

        ClosestShopCoordinates = shopNodes[0];
            // console.log(shopNodes)
            shopNodes.forEach(shopCoordinates => {
                if(Math.abs(shopCoordinates[1] - this.y) + Math.abs(shopCoordinates[0] - this.x) < Math.abs(ClosestShopCoordinates[1] - this.y) + Math.abs(ClosestShopCoordinates[0] - this.x)){
                    ClosestShopCoordinates = shopCoordinates;
                }
            });
        if(destination == "random"){
            let randDestIndex = Math.round(Math.random() * (shopNodes.length - 1));
            while(shopNodes[randDestIndex] == ClosestShopCoordinates){
                randDestIndex = Math.round(Math.random() * (shopNodes.length - 1));
            }
            ClosestShopCoordinates = shopNodes[randDestIndex];
        }

        //adding the nodes
        for (let i = 0; i < screenY; i++) { 
            for (let j = 0; j < screenX; j++) { 
                aStarGrid[j][i] = new Node([j, i], [this.x, this.y], ClosestShopCoordinates);
                //adding the blockers
                if(world[j][i] == blockerCharacter){
                    aStarGrid[j][i] = blockerCharacter;
                }
            }
        }

        //adding end node
        aStarGrid[ClosestShopCoordinates[0]][ClosestShopCoordinates[1]] = shopCharacter;

        //closing the first node
        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]] instanceof Node){
            aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]].status = "closed";
        }

        // console.log(JSON.parse(JSON.stringify(aStarGrid)))
        //a star main loop
        while(true){
            for (let i = 0; i < 8; i++) {
                switch(i) {
                    //left
                    case 0:
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != undefined && world[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != blockerCharacter && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != blockerCharacter && world[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != personCharacter && world[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status != "closed" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1]);
                        }
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] == shopCharacter){pathEnd = true;i = 8;}
                        break;
                    //left-up
                    case 1:
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != undefined && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != blockerCharacter && world[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != blockerCharacter && world[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != personCharacter && world[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != shopCharacter  && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status != "closed" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1]);
                        }
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] == shopCharacter){pathEnd = true;i = 8;}
                        break;
                    //up
                    case 2:
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != undefined && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != blockerCharacter && world[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != blockerCharacter && world[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != personCharacter && world[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != shopCharacter && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != shopCharacter && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status != "closed" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]]);
                        }
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] == shopCharacter){pathEnd = true;i = 8;}
                        break;
                    //right-up
                    case 3:
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != undefined && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != blockerCharacter && world[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != blockerCharacter && world[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != personCharacter && world[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status != "closed" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1]);
                        }
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] == shopCharacter){pathEnd = true;i = 8;}
                        break;
                    //right
                    case 4:
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != undefined && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != blockerCharacter && world[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != blockerCharacter && world[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != personCharacter && world[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status != "closed" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1]);
                        }
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] == shopCharacter){pathEnd = true;i = 8;}
                        break;
                    //right-down
                    case 5:
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != undefined && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != blockerCharacter && world[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != blockerCharacter && world[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != personCharacter && world[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != 30 && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status != "closed" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1]);
                        }
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] == shopCharacter){pathEnd = true;i = 8;}
                        break;
                    //down
                    case 6:
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != undefined && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != blockerCharacter && world[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != blockerCharacter && world[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != personCharacter && world[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != shopCharacter && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != shopCharacter && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != 30 && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status != "closed" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]]);
                        }
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] == shopCharacter){pathEnd = true;i = 8;}
                        break;
                    //left-down
                    case 7:
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != undefined && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != blockerCharacter && world[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != blockerCharacter && world[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != personCharacter && world[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != 30 && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status != "closed" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1]);
                        }
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] == shopCharacter){pathEnd = true;i = 8;}
                        break;
                  }
            }

            // break loop if arrived to path
            if(pathEnd == true){
                break;
            }
            
            let lowestFcost = 1000;
            let iNode = 0;
            let iOpenNodeToDelete = 0;
            openedNodes.forEach(node => {
                if(node != undefined && node.status != "closed" && node.FCost < lowestFcost){
                    lowestFcost = node.FCost;
                    nextNodeToClose = node;
                    iOpenNodeToDelete = iNode;
                }
                iNode++;
            });

            iNode = 0;
            openedNodes.forEach(node => {
                if(node != undefined && node.status != "closed" && node.FCost == lowestFcost && node.HCost < nextNodeToClose.HCost){
                    nextNodeToClose = node;
                    iOpenNodeToDelete = iNode;
                }
                iNode++;
            });
            try{
                nextNodeToClose.status = "closed";
                closedNodes.push(nextNodeToClose);
                currentNodeCoordinates = nextNodeToClose.NodeCoordinates;
            }
            catch(TypeError){
                // console.log("ERROR 1!!!!!!!!!!!!!!!!!!!!!!!!");
                this.moveQueue=[];
                this.aStarPathFinding("random");
                return;
            }
        }

        //Create a direct path out of the closed nodes
        let directions;
        let inversePath;
        let scanOut;
        let closedNodesTemp = closedNodes.slice(0);
        let currentNodeInversePath = closedNodesTemp[closedNodesTemp.length - 1];
        let previousNode;
        let iPreviousNode;
        let aStarGridTemp = aStarGrid.slice(0);
        
        //Spawned in a invalid dead-end node sqm
        try {
            aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1]] = undefined;
        }
        catch(TypeError) {
            this.moveQueue=[];
            this.aStarPathFinding("random");
            return;
        }

        //console.log(JSON.parse(JSON.stringify(aStarGrid)))
        inversePath = new Array();
        while(true){
            scanOut = new Array(); 
            directions = new Array();
             for (let i = 0; i < 8; i++) {
                switch(i) {
                    //left
                    case 0:
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] - 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] - 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] - 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] - 1]);
                            directions.push("LEFT");
                        }
                        break;
                    //left-up
                    case 1:
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] - 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] - 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] - 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]-1][currentNodeInversePath.NodeCoordinates[1]-1]);
                            directions.push("LEFT-UP");
                        }
                        break;
                    //up
                    case 2:
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1]] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1]] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1]].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1]]);
                            directions.push("UP");
                        }
                        break;
                    //left-up
                    case 3:
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] + 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] + 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] + 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] + 1]);
                            directions.push("RIGHT-UP");
                        }
                        break;
                    //right
                    case 4:
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] + 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] + 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] + 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] + 1]);  
                            directions.push("RIGHT");                   
                        }
                        break;
                    //right-down
                    case 5:
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] + 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] + 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] + 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] + 1]);  
                            directions.push("RIGHT-DOWN");                      
                        }
                        break;
                    //down
                    case 6:
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1]] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1]] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1]].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1]]);    
                            directions.push("DOWN");                    
                        }
                        break;
                    //left-down
                    case 7:
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] - 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] - 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] - 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] - 1]);    
                            directions.push("LEFT-DOWN");                    
                        }
                        break;
                  }
            }

            if(scanOut.length > 1){
                let iPreviousNodeToChoose;
                iPreviousNode = -1;
                previousNode = scanOut[0];
                currentNodeInversePath = scanOut[0];
                scanOut.forEach(node => {
                    if(node.GCost < previousNode.GCost){
                        currentNodeInversePath = node;
                        iPreviousNode++;
                        iPreviousNodeToChoose = iPreviousNode;
                    }else{
                        iPreviousNode++;
                    }
                });
                inversePath.push(directions[iPreviousNodeToChoose]);
            }
            else{
                currentNodeInversePath = scanOut[0];
                inversePath.push(directions[0]);
            }

            try{
                aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1]] = undefined;
            }
            catch(TypeError){
                // console.log("ERROR 2!!!!!!!!!!!!!!!!!!!!!!!!");
                this.moveQueue=[];
                this.aStarPathFinding("random");
                return;
            }

            if(currentNodeInversePath.NodeCoordinates[0] == currentNodeInversePath.StartingNodeCoordinates[0] && currentNodeInversePath.NodeCoordinates[1] == currentNodeInversePath.StartingNodeCoordinates[1]){
                break;
            }
        }

        let path = inversePath.reverse();
        let finalPath = new Array();
        path.forEach(pathDirection => {
            switch(pathDirection) {
                case "LEFT":
                    finalPath.push("right");
                  break;
                case "LEFT-UP":
                    finalPath.push("right-down");
                break;
                case "UP":
                    finalPath.push("down");
                break;
                case "RIGHT-UP":
                    finalPath.push("left-down");
                break;
                case "RIGHT":
                    finalPath.push("left");
                break;
                case "RIGHT-DOWN":
                    finalPath.push("left-up");
                break;
                case "DOWN":
                    finalPath.push("up");
                break;
                case "LEFT-DOWN":
                    finalPath.push("right-up");
                break;
              }
        });
        this.moveQueue = finalPath.reverse();
        return;
    }
}