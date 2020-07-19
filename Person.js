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
        arrayUpdate(world, this.y, this.x, "R");
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
        console.log(openedNodes)

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
        for (var i = 0; i < screenX; i++) { 
            for (var j = 0; j < screenY; j++) {
                if(world[i][j] == "P"){
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
        console.log(openedNodes)

        console.log(aStarGrid);
        //a star main loop
        //closing the first node
        aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]].status = "closed";
        while(true){
            for (var i = 0; i < 8; i++) {
                // console.log("ITERATION: " + i)
                switch(i) {
                    case 0:
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != undefined && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != "T" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != "P" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status != "closed" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1]);
                            console.log(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status);
                        }
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                    case 1:
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != undefined && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != "T" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != "P" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status != "closed" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1]);
                            console.log(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status)   
                        }
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                    case 2:
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != undefined && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != "T" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != "P" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status != "closed" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]]);
                            console.log(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status)  
                        }
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                    case 3:
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != undefined && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != "T" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != "P" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status != "closed" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1]);
                            console.log(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status)  
                        }
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                    case 4:
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != undefined && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != "T" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != "P" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status != "closed" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1]);
                            console.log(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status) 
                        }
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                    case 5:
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != undefined && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != "T" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != "P" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != 30 && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status != "closed" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1]);
                            console.log(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status)  
                        }
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                    case 6:
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != undefined && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != "T" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != "P" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != 30 && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status != "closed" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]]);
                            console.log(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status)  
                        }
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                    case 7:
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != undefined && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != "T" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != "P" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != 30 && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status != "closed" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1]);
                            console.log(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status) 
                        }
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                  }
                //   console.log(openedNodes)
            }
            console.log("ololol")
            // break loop if arrived to path
            if(pathEnd == true){console.log("KKKKKKKKKKKKKKKKKKKKK");break;}
            // console.log(openedNodes)
            var lowestFcost = 1000;
            var iNode = 0;
            var iOpenNodeToDelete = 0;
            console.log("opened nodes: ")
            console.log(openedNodes)
            openedNodes.forEach(node => {
                if(node != undefined && node.status != "closed" && node.FCost < lowestFcost){
                    // console.log("111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")
                    // console.log("NON undefined nodes: " + node)
                    lowestFcost = node.FCost;
                    nextNodeToClose = node;
                    iOpenNodeToDelete = iNode;
                }
                iNode++;
            });
            // console.log(openedNodes)

            iNode = 0;
            openedNodes.forEach(node => {
                if(node != undefined && node.status != "closed" && node.FCost == lowestFcost && node.HCost < nextNodeToClose.HCost){
                    console.log("2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222")
                    // console.log("non undefined nodes: " + node)
                    nextNodeToClose = node;
                    iOpenNodeToDelete = iNode;
                }
                iNode++;
            });
            // console.log("NEXTNODETOCLOSE: " + nextNodeToClose)
            // console.log(openedNodes)

            nextNodeToClose.status = "closed";
            closedNodes.push(nextNodeToClose);
            openedNodes[iOpenNodeToDelete] = undefined;
            currentNodeCoordinates = nextNodeToClose.NodeCoordinates;
            console.log("currentNodeCoordinates: " + currentNodeCoordinates)
            // console.log(closedNodes)
            if(openedNodes.length > 100){console.log(openedNodes);break;}
            //  break;
            // console.log("loop");
            // console.log("currentNodeCoordinates: " + currentNodeCoordinates)
        }
        console.log("closed nodes:")
        console.log(closedNodes)
        console.log(openedNodes);
        // console.log(aStarGrid);
    }
}