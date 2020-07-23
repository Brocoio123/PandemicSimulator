class Person{
    constructor(y, x){
        this.y = y;
        this.x = x;
        // this.radius = radius;
        this.status = "";

        const json = '{"shopping":true, "commuting":42, "going home":42}';
        let stringData = JSON.stringify(json);
        const obj = JSON.parse(stringData);

        this.action = "";
        console.log("Person created");
        arrayUpdate(world, this.x, this.y, "R");

        this.moveQueue = ["right","left","right","left","right", "up"];
    }

    nextMove = function(){
        var i = this.moveQueue.pop();
        console.log("next move: " + i);

        this.movePerson(i);
        arrayUpdate(world, this.x, this.y, "R");
    }

    deletePerson = function(){
        arrayUpdate(world, this.x, this.y, groundCharacter)
        delete this;
    }

    movePerson = function(direction){
        if(direction == "left") {
            console.log("LEFT");
            if(this.y != 0){
                this.y--;
            }
        }

        if(direction == "left-up") {
            console.log("left-up");
            if(this.y != 0 && this.x != 0){
                this.y--;
                this.x--;
            }
        }

        if(direction == "up") {
            console.log("UP");
            if(this.x != 0){
                this.x--;
            }
        }

        if(direction == "right-up") {
            console.log("right-up");
            if(this.y < (screenY - 1) && this.x != 0){
                this.y++;
                this.x--;
            }
        }

        if(direction == "right") {
            console.log("RIGHT");
            if(this.y < (screenY - 1)){
                this.y++;
            }
        }

        if(direction == "right-down") {
            console.log("right-down");
            if(this.y < (screenY - 1) && this.x < (screenX - 1)){
                this.y++;
                this.x++;
            }
        }

        if(direction == "down") {
            console.log("DOWN");
            if(this.x < (screenX - 1)){
                this.x++;
            }
        }

        if(direction == "left-down") {
            console.log("left-down");
            if(this.y != 0 && this.x < (screenX - 1)){
                this.y--;
                this.x++;
            }
        }
    }

    aStarPathFinding = function(){
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

        //closest shop is selected as the end node
        for (var i = 0; i < screenY; i++) {
            for (var j = 0; j < screenX; j++) {
                if(world[j][i] == "P"){
                    shopNodes[e] = [j,i];
                    e++;
                }
            } 
        } 

        var ClosestShopCoordinates = shopNodes[0];
        shopNodes.forEach(shopCoordinates => {
            if(Math.abs(shopCoordinates[1] - this.y) + Math.abs(shopCoordinates[0] - this.x) < Math.abs(ClosestShopCoordinates[1] - this.y) + Math.abs(ClosestShopCoordinates[0] - this.x)){
                ClosestShopCoordinates = shopCoordinates;
            }
        });

        //adding the blockers
        for (var i = 0; i < screenY; i++) { 
            for (var j = 0; j < screenX; j++) { 
                aStarGrid[j][i] = new Node([j, i], [this.x, this.y], ClosestShopCoordinates);
                //blockers
                if(world[j][i] == "T"){
                    aStarGrid[j][i] = "T";
                }
            } 
        }

        //adding end node
        aStarGrid[ClosestShopCoordinates[0]][ClosestShopCoordinates[1]] = "P";

        //closing the first node
        aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]].status = "closed";

        //a star main loop
        while(true){
            for (var i = 0; i < 8; i++) {
                switch(i) {
                    case 0:
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != undefined && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != "T" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != "P" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status != "closed" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1]);
                        }
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] == "P"){pathEnd = true;i = 8;}
                        break;
                    case 1:
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != undefined && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != "T" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != "P" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status != "closed" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1]);
                        }
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] == "P"){pathEnd = true;i = 8;}
                        break;
                    case 2:
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != undefined && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != "T" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != "P" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status != "closed" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]]);
                        }
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] == "P"){pathEnd = true;i = 8;}
                        break;
                    case 3:
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != undefined && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != "T" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != "P" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status != "closed" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1]);
                        }
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] == "P"){pathEnd = true;i = 8;}
                        break;
                    case 4:
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != undefined && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != "T" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != "P" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status != "closed" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1]);
                        }
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] == "P"){pathEnd = true;i = 8;}
                        break;
                    case 5:
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != undefined && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != "T" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != "P" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != 30 && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status != "closed" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1]);
                        }
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] == "P"){pathEnd = true;i = 8;}
                        break;
                    case 6:
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != undefined && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != "T" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != "P" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != 30 && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status != "closed" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]]);
                        }
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] == "P"){pathEnd = true;i = 8;}
                        break;
                    case 7:
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != undefined && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != "T" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != "P" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != 30 && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status != "closed" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1]);
                        }
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] == "P"){pathEnd = true;i = 8;}
                        break;
                  }
            }

            // break loop if arrived to path
            if(pathEnd == true){break;}
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
            openedNodes[iOpenNodeToDelete] = undefined;
            currentNodeCoordinates = nextNodeToClose.NodeCoordinates;
        }

        var stopLoop = false
        var directions;
        var inversePath = new Array();
        var scanOut;       
        var closedNodesTemp = closedNodes.slice(0);
        var currentNodeInversePath = closedNodesTemp[closedNodesTemp.length - 1]; 
        var previousNode;
        var iPreviousNode;
        var aStarGridTemp = aStarGrid.slice(0);
        console.log(currentNodeInversePath)
        console.log(closedNodesTemp)
        try {
            aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1]] = undefined;
        }
        catch(TypeError) {
            console.log("catched!")
            this.deletePerson();
            return;
        }
        inversePath = new Array();
        while(true){
            scanOut = new Array(); 
            directions = new Array();
             for (var i = 0; i < 8; i++) {
                switch(i) {
                    case 0:
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] - 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] - 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] - 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] - 1]);
                            directions.push("LEFT")
                        }
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] - 1] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
                        break;
                    case 1:
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] - 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] - 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] - 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]-1][currentNodeInversePath.NodeCoordinates[1]-1]);
                            directions.push("LEFT-UP")
                        }
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] - 1] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
                        break;
                    case 2:
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1]] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1]] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1]].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1]]);
                            directions.push("UP")
                        }
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1]] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
                        break;
                    case 3:
                        if(currentNodeInversePath.NodeCoordinates[0] != 0 && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] + 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] + 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] + 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] + 1]);
                            directions.push("RIGHT-UP")
                        }
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] - 1][currentNodeInversePath.NodeCoordinates[1] + 1] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
                        break;
                    case 4:
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] + 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] + 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] + 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] + 1]);  
                            directions.push("RIGHT")                      
                        }
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0]][currentNodeInversePath.NodeCoordinates[1] + 1] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
                        break;
                    case 5:
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] + 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] + 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] + 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] + 1]);  
                            directions.push("RIGHT-DOWN")                      
                        }
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] + 1] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
                        break;
                    case 6:
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1]] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1]] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1]].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1]]);    
                            directions.push("DOWN")                    
                        }
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1]] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
                        break;
                    case 7:
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] - 1] != undefined && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] - 1] instanceof Node && aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] - 1].status == "closed"){
                            scanOut.push(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] - 1]);    
                            directions.push("LEFT-DOWN")                    
                        }
                        if(aStarGridTemp[currentNodeInversePath.NodeCoordinates[0] + 1][currentNodeInversePath.NodeCoordinates[1] - 1] == currentNodeInversePath.StartingNodeCoordinates){stopLoop = true}
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
                        iPreviousNode++
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
        console.log(finalPath)

        return;
    }
}