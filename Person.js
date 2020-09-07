class Person{
    constructor(y, x, id){
        this.y = y;
        this.x = x;
        this.id = id;
        this.PI = this.calculatePanicIndex();
        this.CI = this.calculateCautionIndex();
        this.IC = this.calculateInfectionChance();
        this.status = "healthy";
        this.action = "";
        // console.log("Person created");
        arrayUpdate(world, this.x, this.y, personCharacter);
        this.currentMovementVector = []
        this.moveQueue = [];
    }

    nextMove = function(){
        var i = this.moveQueue.pop();
        //console.log("next move: " + i);

        this.movePerson(i);
        arrayUpdate(world, this.x, this.y, personCharacter);
    }

    deletePerson = function(){
        arrayUpdate(world, this.x, this.y, groundCharacter)
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
            numberOfInfected++;
            infectedInCycle++;
            console.log("numberOfInfected: " + numberOfInfected)
        }
    }

    calculatePanicIndex = function(){
        return 6 + GVTL
    }

    calculateCautionIndex = function(){
        return this.PI / (GVTL * 3)
    }

    //calculate the infection chance of this person
    //maxInfectionPercentage = (WI+CI+PI)*GVTL
    calculateInfectionChance = function(){
        return (this.CI + this.PI) * GVTL
    }

    movePerson = function(direction){
        switch (direction) {
            case "left":
                if(this.y != 0){
                    if(world[this.x][this.y - 1] == personCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("closest");
                        return;
                    }
                    this.y--;
                    this.currentMovementVector = [0, -1]
                }
                else{
                    this.moveQueue.push("left");
                }
                break;
            case "left-up":
                if(this.y != 0 && this.x != 0){
                    if(world[this.x - 1][this.y - 1] == personCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("closest");
                        return;
                    }
                    this.y--;
                    this.x--;
                    this.currentMovementVector = [-1, -1]

                }
                else{
                    this.moveQueue.push("left-up");
                }
                break;
            case "up":
                if(this.x != 0){
                    if(world[this.x - 1][this.y] == personCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("closest");
                        return;
                    }
                    this.x--;
                    this.currentMovementVector = [-1, 0]
                }
                else{
                    this.moveQueue.push("up");
                }
                break;
            case "right-up":
                if(this.y < (screenY - 1) && this.x != 0){
                    if(world[this.x - 1][this.y + 1] == personCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("closest");
                        return;
                    }
                    this.y++;
                    this.x--;
                    this.currentMovementVector = [-1, 1]
                }
                else{
                    this.moveQueue.push("right-up");
                }
                break;
            case "right":
                if(this.y < (screenY - 1)){
                    if(world[this.x][this.y + 1] == personCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("closest");
                        return;
                    }
                    this.y++;
                    this.currentMovementVector = [0, 1]
                }
                else{
                    this.moveQueue.push("right");
                }
                break;
            case "right-down":
                if(this.y < (screenY - 1) && this.x < (screenX - 1)){
                    if(world[this.x + 1][this.y + 1] == personCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("closest");
                        return;
                    }
                    this.y++;
                    this.x++;
                    this.currentMovementVector = [1, 1]
                }
                else{
                    this.moveQueue.push("right-down");
                }
                break;
            case "down":
                if(this.x < (screenX - 1)){
                    if(world[this.x + 1][this.y] == personCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("closest");
                        return;
                    }
                    this.x++;
                    this.currentMovementVector = [1, 0]
                }
                else{
                    this.moveQueue.push("down");
                }
                break;
            case "left-down":
                if(this.y != 0 && this.x < (screenX - 1)){
                    if(world[this.x][this.y - 1] == personCharacter){
                        this.moveQueue=[];
                        this.aStarPathFinding("closest");
                        return;
                    }
                    this.y--;
                    this.x++;
                    this.currentMovementVector = [1, -1]
                }
                else{
                    this.moveQueue.push("left-down");
                }
                break;
          }
        //   console.log(this.currentMovementVector)
          personsPositions.push([this.y, this.x]);
    }

    //Algorithm to find the shortest path to its destination
    //destination should be either "random" or "closest"
    aStarPathFinding = function(destination = "closest"){
        var aStarGrid = new Array(screenY + 1);
        var openedNodes = new Array();
        var closedNodes = new Array();
        var currentNodeCoordinates = [this.x, this.y];
        var pathEnd = false;
        var nextNodeToClose = openedNodes[0];
        for (var i = 0; i < aStarGrid.length; i++) {
            aStarGrid[i] = [30];
        }
        
        var shopNodes = new Array();
        var e = 0;

        //Shop is selected as the end node based on closeness to the Person or randomness
        for (var i = 0; i < screenY; i++) {
            for (var j = 0; j < screenX; j++) {
                if(world[j][i] == shopCharacter){
                    shopNodes[e] = [j,i];
                    e++;
                }
            }
        }

        var ClosestShopCoordinates
        ClosestShopCoordinates = shopNodes[0];
            // console.log(shopNodes)
            shopNodes.forEach(shopCoordinates => {
                if(Math.abs(shopCoordinates[1] - this.y) + Math.abs(shopCoordinates[0] - this.x) < Math.abs(ClosestShopCoordinates[1] - this.y) + Math.abs(ClosestShopCoordinates[0] - this.x)){
                    ClosestShopCoordinates = shopCoordinates;
                }
            });
        if(destination == "random"){
            var randDestIndex = Math.round(Math.random() * (shopNodes.length - 1))
            while(shopNodes[randDestIndex] == ClosestShopCoordinates){
                randDestIndex = Math.round(Math.random() * (shopNodes.length - 1))
            }
            ClosestShopCoordinates = shopNodes[randDestIndex];
        }

        //adding the nodes
        for (var i = 0; i < screenY; i++) { 
            for (var j = 0; j < screenX; j++) { 
                aStarGrid[j][i] = new Node([j, i], [this.x, this.y], ClosestShopCoordinates);
                //adding the blockers
                if(world[j][i] == "T"){
                    aStarGrid[j][i] = "T";
                }
            }
        }

        //adding end node
        aStarGrid[ClosestShopCoordinates[0]][ClosestShopCoordinates[1]] = shopCharacter;

        //closing the first node
        aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]].status = "closed";

        // (aStarGrid);
        //a star main loop
        while(true){
            for (var i = 0; i < 8; i++) {
                switch(i) {
                    //left
                    case 0:
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != undefined && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != "T" && world[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != personCharacter && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status != "closed" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1]);
                        }
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] == shopCharacter){pathEnd = true;i = 8;}
                        break;
                    //left-up
                    case 1:
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != undefined && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != "T" && world[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != personCharacter && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status != "closed" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1]);
                        }
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] == shopCharacter){pathEnd = true;i = 8;}
                        break;
                    //up
                    case 2:
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != undefined && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != "T" && world[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != personCharacter && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != shopCharacter && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status != "closed" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]]);
                        }
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] == shopCharacter){pathEnd = true;i = 8;}
                        break;
                    //right-up
                    case 3:
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != undefined && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != "T" && world[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != personCharacter && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status != "closed" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1]);
                        }
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] == shopCharacter){pathEnd = true;i = 8;}
                        break;
                    //right
                    case 4:
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != undefined && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != "T" && world[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != personCharacter && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status != "closed" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1]);
                        }
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] == shopCharacter){pathEnd = true;i = 8;}
                        break;
                    //right-down
                    case 5:
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != undefined && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != "T" && world[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != personCharacter && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != 30 && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status != "closed" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1]);
                        }
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] == shopCharacter){pathEnd = true;i = 8;}
                        break;
                    //down
                    case 6:
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != undefined && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != "T" && world[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != personCharacter && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != shopCharacter && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != 30 && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status != "closed" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]]);
                        }
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] == shopCharacter){pathEnd = true;i = 8;}
                        break;
                    //left-down
                    case 7:
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != undefined && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != "T" && world[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != personCharacter && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != shopCharacter && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != 30 && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status != "closed" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status != "open"){
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

            nextNodeToClose.status = "closed";
            closedNodes.push(nextNodeToClose);
            //linha desnecessaria?
            //openedNodes[iOpenNodeToDelete] = undefined;
            currentNodeCoordinates = nextNodeToClose.NodeCoordinates;
        }

        //Create a direct path out of the closed nodes
        var stopLoop = false
        var directions;
        var inversePath;
        var scanOut;
        var closedNodesTemp = closedNodes.slice(0);
        var currentNodeInversePath = closedNodesTemp[closedNodesTemp.length - 1];
        var previousNode;
        var iPreviousNode;
        var aStarGridTemp = aStarGrid.slice(0);
        // console.log(currentNodeInversePath)
        // console.log(closedNodesTemp)
        
        //Spawned in a invalid dead-end node sqm

        try {
            aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1]] = undefined;
        }
        catch(TypeError) {
            // console.log("catched!")
            // console.log("person deleted!")
            //this.deletePerson();
            return;
        }
        //console.log(JSON.parse(JSON.stringify(aStarGrid)))

        inversePath = new Array();
        while(true){
            scanOut = new Array(); 
            directions = new Array();
             for (var i = 0; i < 8; i++) {
                switch(i) {
                    //left
                    case 0:
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] - 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] - 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] - 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] - 1]);
                            directions.push("LEFT")
                        }
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] - 1] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
                        break;
                    //left-up
                    case 1:
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] - 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] - 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] - 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]-1][currentNodeInversePath.NodeCoordinates[1]-1]);
                            directions.push("LEFT-UP")
                        }
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] - 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] - 1] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
                        break;
                    //up
                    case 2:
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1]] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1]] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1]].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1]]);
                            directions.push("UP")
                        }
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1]] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1]] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
                        break;
                    //left-up
                    case 3:
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] + 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] + 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] + 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] + 1]);
                            directions.push("RIGHT-UP")
                        }
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] + 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] + 1] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
                        break;
                    //right
                    case 4:
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] + 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] + 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] + 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] + 1]);  
                            directions.push("RIGHT")                      
                        }
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] + 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] + 1] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
                        break;
                    //right-down
                    case 5:
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] + 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] + 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] + 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] + 1]);  
                            directions.push("RIGHT-DOWN")                      
                        }
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] + 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] + 1] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
                        break;
                    //down
                    case 6:
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1]] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1]] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1]].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1]]);    
                            directions.push("DOWN")                    
                        }
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1]] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1]] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
                        break;
                    //left-down
                    case 7:
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] - 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] - 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] - 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] - 1]);    
                            directions.push("LEFT-DOWN")                    
                        }
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] - 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] - 1] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
                        break;
                  }
            }

            if(scanOut.length > 1){
                iPreviousNode = -1;
                let iPreviousNodeToChoose;
                previousNode = scanOut[0];
                currentNodeInversePath = scanOut[0];
                scanOut.forEach(node => {
                    if(node.GCost < previousNode.GCost){
                        currentNodeInversePath = node;
                        iPreviousNode++;
                        iPreviousNodeToChoose = iPreviousNode;
                    }else{
                        iPreviousNode++
                    }
                });
                inversePath.push(directions[iPreviousNodeToChoose]);
            }
            else{
                currentNodeInversePath = scanOut[0];
                inversePath.push(directions[0]);
            }

            aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1]] = undefined;
            if(currentNodeInversePath.NodeCoordinates[0] == currentNodeInversePath.StartingNodeCoordinates[0] && currentNodeInversePath.NodeCoordinates[1] == currentNodeInversePath.StartingNodeCoordinates[1]){
                break;
            }
        }

        var path = inversePath.reverse();
        var finalPath = new Array();
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
        this.moveQueue = finalPath.reverse()
        //console.log(finalPath)
        //console.log("PATH CALCULATED!!!!")
        return;
    }
}