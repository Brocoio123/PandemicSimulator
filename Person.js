class Person{
    constructor(x, y){
        this.x = x;
        this.y = y;
        // this.radius = radius;
        this.status = "";

        const json = '{"shopping":true, "commuting":42, "going home":42}';
        let stringData = JSON.stringify(json);
        const obj = JSON.parse(stringData);

        this.action = "";
        console.log("Person created");
        arrayUpdate(world, this.x, this.y, "R");

        this.moveQueue = ["right","left","right","left","right"];

    }

    nextMove = function(){
        var i = this.moveQueue.pop();
        console.log("next move: " + i);

        this.movePerson(i);
        arrayUpdate(world, this.x, this.y, "R");
    }

    movePerson = function(direction){
        if(direction == "up") {
            console.log("UP");
            if(this.x != 0){
                this.x--;
            }
        }

        if(direction == "down") {
            console.log("DOWN");
            if(this.x < (screenX - 1)){
                this.x++;
            }
        }

        if(direction == "left") {
            console.log("LEFT");
            if(this.y != 0){
                this.y--;
            }
        }

        if(direction == "right") {
            console.log("RIGHT");
            if(this.y < (screenY - 1)){
                this.y++;
            }
        }
    }

    aStarPathFinding = function(){
        var aStarGrid = new Array(screenX + 1);
        var openedNodes = new Array();
        var closedNodes = new Array();
        var currentNode = [this.x, this.y];
        for (var i = 0; i < aStarGrid.length; i++) { 
            aStarGrid[i] = [30]; 
        }
        
        var shopNodes = new Array();
        var e = 0;
        //closest shop is selected as the end node
        for (var i = 0; i < screenX; i++) { 
            for (var j = 0; j < screenY; j++) {
                if(world[i][j] == "P"){
                    console.log("DKSQ")
                    shopNodes[e] = [i,j];
                    e++;
                }
            } 
        } 

        console.log("shopnodes: " + shopNodes)
        var ClosestShopCoordinates = shopNodes[0];
        shopNodes.forEach(shopCoordinates => {
            if(Math.abs(shopCoordinates[0] - this.x) + Math.abs(shopCoordinates[1] - this.y) < Math.abs(ClosestShopCoordinates[0] - this.x) + Math.abs(ClosestShopCoordinates[1] - this.y)){
                console.log("new closest!")
                ClosestShopCoordinates = shopCoordinates;
            }
        });

        //adding the blockers
        for (var i = 0; i < screenX; i++) { 
            for (var j = 0; j < screenY; j++) { 
                aStarGrid[i][j] = new Node([i, j], [this.x, this.y], ClosestShopCoordinates);
                //blockers
                if(world[i][j] == "T"){
                    aStarGrid[i][j] = "T";
                }
                //end node

            } 
        }
        //adding end node
        aStarGrid[ClosestShopCoordinates[0]][ClosestShopCoordinates[1]] = "P";

        //a star main loop
        while(aStarGrid[currentNode[0], currentNode[1]] != "P"){
            for (var i = 0; i < 8; i++) {
                switch(i) {
                    case 0:
                        if(aStarGrid[currentNode[0]][currentNode[1]-1] != undefined && aStarGrid[currentNode[0]][currentNode[1]-1] != "T" && aStarGrid[currentNode[0]][currentNode[1]-1] != "P"){
                            aStarGrid[currentNode[0]][currentNode[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNode[0]][currentNode[1]-1]);
                            console.log(aStarGrid[currentNode[0]][currentNode[1]-1].status);
                        }
                        break;
                    case 1:
                        if(aStarGrid[currentNode[0]-1][currentNode[1]-1] != undefined && aStarGrid[currentNode[0]-1][currentNode[1]-1] != "T" && aStarGrid[currentNode[0]-1][currentNode[1]-1] != "P"){
                            aStarGrid[currentNode[0]-1][currentNode[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNode[0]-1][currentNode[1]-1]);
                            console.log(aStarGrid[currentNode[0]-1][currentNode[1]-1].status)   
                        }
                        break;
                    case 2:
                        if(aStarGrid[currentNode[0]-1][currentNode[1]] != undefined && aStarGrid[currentNode[0]-1][currentNode[1]] != "T" && aStarGrid[currentNode[0]-1][currentNode[1]] != "P"){
                            aStarGrid[currentNode[0]-1][currentNode[1]].status = "open";
                            openedNodes.push(aStarGrid[currentNode[0]-1][currentNode[1]]);
                            console.log(aStarGrid[currentNode[0]-1][currentNode[1]].status)  
                        }
                        break;
                    case 3:
                        if(aStarGrid[currentNode[0]-1][currentNode[1]+1] != undefined && aStarGrid[currentNode[0]-1][currentNode[1]+1] != "T" && aStarGrid[currentNode[0]-1][currentNode[1]+1] != "P"){
                            aStarGrid[currentNode[0]-1][currentNode[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNode[0]-1][currentNode[1]+1]);
                            console.log(aStarGrid[currentNode[0]-1][currentNode[1]+1].status)  
                        }
                        break;
                    case 4:
                        if(aStarGrid[currentNode[0]][currentNode[1]+1] != undefined && aStarGrid[currentNode[0]][currentNode[1]+1] != "T" && aStarGrid[currentNode[0]][currentNode[1]+1] != "P"){
                            aStarGrid[currentNode[0]][currentNode[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNode[0]][currentNode[1]+1]);
                            console.log(aStarGrid[currentNode[0]][currentNode[1]+1].status) 
                        }
                        break;
                    case 5:
                        if(aStarGrid[currentNode[0]+1][currentNode[1]+1] != undefined && aStarGrid[currentNode[0]+1][currentNode[1]+1] != "T" && aStarGrid[currentNode[0]+1][currentNode[1]+1] != "P"){
                            aStarGrid[currentNode[0]+1][currentNode[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNode[0]+1][currentNode[1]+1]);
                            console.log(aStarGrid[currentNode[0]+1][currentNode[1]+1].status)  
                        }
                        break;
                    case 6:
                        if(aStarGrid[currentNode[0]+1][currentNode[1]] != undefined && aStarGrid[currentNode[0]+1][currentNode[1]] != "T" && aStarGrid[currentNode[0]+1][currentNode[1]] != "P"){
                            aStarGrid[currentNode[0]+1][currentNode[1]].status = "open";
                            openedNodes.push(aStarGrid[currentNode[0]+1][currentNode[1]]);
                            console.log(aStarGrid[currentNode[0]+1][currentNode[1]].status)  
                        }
                        break;
                    case 7:
                        if(aStarGrid[currentNode[0]+1][currentNode[1]-1] != undefined && aStarGrid[currentNode[0]+1][currentNode[1]-1] != "T" && aStarGrid[currentNode[0]+1][currentNode[1]-1] != "P"){
                            aStarGrid[currentNode[0]+1][currentNode[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNode[0]+1][currentNode[1]-1]);
                            console.log(aStarGrid[currentNode[0]+1][currentNode[1]-1].status) 
                        }
                        break;
                  }
            }
            var lowestFcost = openedNodes[0].Fcost;
            var nextNodeToClose = openedNodes[0];
            var iNode = 0;
            var iOpenNodeToDelete = 0; 
            openedNodes.forEach(node => {
                if(node.Fcost < lowestFcost && node != undefined){
                    lowestFcost = node.Fcost;
                    nextNodeToClose = node;
                    iOpenNodeToDelete = iNode;
                }
                iNode++;
            });

            iNode = 0;
            openedNodes.forEach(node => {
                if(node.Fcost == lowestFcost && node.HCost < nextNodeToClose.HCost && node != undefined){
                    nextNodeToClose = node;
                    iOpenNodeToDelete = iNode;
                }
                iNode++;
            });
            nextNodeToClose.status = "closed";
            closedNodes.push(nextNodeToClose);
            openedNodes[iOpenNodeToDelete] = undefined;
            currentNode = nextNodeToClose;
            break;
        }
        console.log(openedNodes);
        console.log(aStarGrid);
    }
}