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
        var aStarGrid = new Array(screenY + 1);
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
        for (var i = 0; i < screenY; i++) { 
            for (var j = 0; j < screenX; j++) {
                if(world[j][i] == "P"){
                    shopNodes[e] = [j,i];
                    e++;
                }
            } 
        } 

        console.log("shopnodes: " + shopNodes)
        var ClosestShopCoordinates = shopNodes[0];
        shopNodes.forEach(shopCoordinates => {
            if(Math.abs(shopCoordinates[1] - this.y) + Math.abs(shopCoordinates[0] - this.x) < Math.abs(ClosestShopCoordinates[1] - this.y) + Math.abs(ClosestShopCoordinates[0] - this.x)){
                console.log("new closest!")
                ClosestShopCoordinates = shopCoordinates;
            }
        });

        //adding the blockers
        for (var i = 0; i < screenY; i++) { 
            for (var j = 0; j < screenX; j++) { 
                aStarGrid[j][i] = new Node([j, i], [this.y, this.x], ClosestShopCoordinates);
                //blockers
                if(world[j][i] == "T"){
                    aStarGrid[j][i] = "T";
                }
            } 
        }

        //adding end node
        aStarGrid[ClosestShopCoordinates[0]][ClosestShopCoordinates[1]] = "P";
        //console.log(openedNodes)
        console.log("grid: ")
        console.log(JSON.parse(JSON.stringify(aStarGrid)))
        //closing the first node
        aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]].status = "closed";
        //a star main loop
        console.log("currentNodeCoordinates: " + currentNodeCoordinates)
        while(true){
            for (var i = 0; i < 8; i++) {
                switch(i) {
                    case 0:
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != undefined && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != "T" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] != "P" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status != "closed" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1]);
                            console.log(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].NodeCoordinates + ": " + aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1].status)   
                        }
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]-1] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                    case 1:
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != undefined && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != "T" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] != "P" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status != "closed" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1]);
                            console.log(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].NodeCoordinates + ": " + aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1].status)   
                        }
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]-1] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                    case 2:
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != undefined && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != "T" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] != "P" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status != "closed" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]]);
                            console.log(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].NodeCoordinates + ": " + aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]].status)   
                        }
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                    case 3:
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != undefined && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != "T" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] != "P" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status != "closed" && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1]);
                            console.log(aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].NodeCoordinates + ": " + aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1].status)   
                        }
                        if(currentNodeCoordinates[0] != 0 && aStarGrid[currentNodeCoordinates[0]-1][currentNodeCoordinates[1]+1] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                    case 4:
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != undefined && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != "T" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] != "P" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status != "closed" && aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1]);
                            console.log(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].NodeCoordinates + ": " + aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1].status)   
                        }
                        if(aStarGrid[currentNodeCoordinates[0]][currentNodeCoordinates[1]+1] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                    case 5:
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != undefined && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != "T" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != "P" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] != 30 && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status != "closed" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1]);
                            console.log(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].NodeCoordinates + ": " + aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1].status)   
                        }
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]+1] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                    case 6:
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != undefined && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != "T" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != "P" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] != 30 && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status != "closed" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]]);
                            console.log(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].NodeCoordinates + ": " + aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]].status)   
                        }
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                    case 7:
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != undefined && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != "T" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != "P" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] != 30 && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status != "closed" && aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status != "open"){
                            aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status = "open";
                            openedNodes.push(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1]);
                            console.log(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].NodeCoordinates + ": " + aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1].status)   
                        }
                        if(aStarGrid[currentNodeCoordinates[0]+1][currentNodeCoordinates[1]-1] == "P"){console.log("THE END!");pathEnd = true;i = 8;}
                        break;
                  }
            }
            console.log("opened nodes: ")
            console.log(JSON.parse(JSON.stringify(openedNodes)))

            console.log("ololol")
            // break loop if arrived to path
            if(pathEnd == true){console.log("KKKKKKKKKKKKKKKKKKKKK");break;}
            var lowestFcost = 1000;
            var iNode = 0;
            var iOpenNodeToDelete = 0;

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
            console.log("grid: ")
            console.log(JSON.parse(JSON.stringify(aStarGrid)))
            console.log("currentNodeCoordinates: " + currentNodeCoordinates)

            var tempGrid = world
            closedNodes.forEach(node => {
                tempGrid[node.NodeCoordinates[0]][node.NodeCoordinates[1]] = "R"
            });
            console.log("tempgrid: ")
            console.log(JSON.parse(JSON.stringify(tempGrid)))

        }
        // currentNodeCoordinates = [this.y, this.x];
        // var coordinateDifference = 0;
        // closedNodes.forEach(node => {
        //     coordinateDifference = [currentNodeCoordinates[1] - node.NodeCoordinates[1], currentNodeCoordinates[0] - node.NodeCoordinates[0]]
        //     console.log("LEL:" + coordinateDifference)
        //          if(coordinateDifference[1] == 0 && coordinateDifference[0] == -1){console.log("LEFT")}
        //     else if(coordinateDifference[1] == -1 && coordinateDifference[0] == -1 ){console.log("LEFT-UP")}
        //     else if(coordinateDifference[1] == -1 && coordinateDifference[0] == 0){console.log("UP")}
        //     else if(coordinateDifference[1] == -1 && coordinateDifference[0] == 1){console.log("RIGHT-UP")}
        //     else if(coordinateDifference[1] == 0 && coordinateDifference[0] == 1){console.log("RIGHT")}
        //     else if(coordinateDifference[1] == 1 && coordinateDifference[0] == 1){console.log("RIGHT-DOWN")}
        //     else if(coordinateDifference[1] == 1 && coordinateDifference[0] == 0){console.log("DOWN")}
        //     else if(coordinateDifference[1] == 1 && coordinateDifference[0] == -1){console.log("LEFT-DOWN")}
        //     currentNodeCoordinates = node.NodeCoordinates;

                                // switch(coordinateDifference) {
            //     case [0,-1]:
            //       console.log("LEFT")
            //       break;
            //     case [-1,-1]:
            //         console.log("LEFT-UP")
            //       break; 
            //     case [-1,0]:
            //         console.log("UP")
            //       break;
            //     case [-1,1]:
            //         console.log("RIGHT-UP")
            //       break;
            //     case [0,1]:
            //         console.log("RIGHT")
            //     break;
            //     case [1,1]:
            //         console.log("RIGHT-DOWN")
            //     break; 
            //     case [1,0]:
            //         console.log("DOWN")
            //     break;
            //     case [1,-1]:
            //         console.log("LEFT-DOWN")
            //     break;
            //   }

            // switch(coordinateDifference) {
            //     case [0,-1]:
            //       console.log("LEFT")
            //       break;
            //     case [-1,-1]:
            //         console.log("LEFT-UP")
            //       break; 
            //     case [-1,0]:
            //         console.log("UP")
            //       break;
            //     case [-1,1]:
            //         console.log("RIGHT-UP")
            //       break;
            //     case [0,1]:
            //         console.log("RIGHT")
            //     break;
            //     case [1,1]:
            //         console.log("RIGHT-DOWN")
            //     break; 
            //     case [1,0]:
            //         console.log("DOWN")
            //     break;
            //     case [1,-1]:
            //         console.log("LEFT-DOWN")
            //     break;
            //   }


        //});
        var tempGrid = aStarGrid
        closedNodes.forEach(node => {
            tempGrid[node.NodeCoordinates[0]][node.NodeCoordinates[1]] = "R"
        });
        console.log("closed nodes:")
        console.log(closedNodes);
        console.log(openedNodes);
        console.log("tempgrid: ")
        console.log(tempGrid)
    }
}