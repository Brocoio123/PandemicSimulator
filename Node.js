//the name of this class is Node.js not because of the library, but because thats how a* pathfinding units are generally called
class Node{
    constructor(NodeCoordinates, StartingNodeCoordinates, endNodeCoordinates){
        this.NodeCoordinates = NodeCoordinates;
        this.StartingNodeCoordinates = StartingNodeCoordinates;
        this.endNodeCoordinates = endNodeCoordinates;
        this.GCost = this.GCostCalculation();
        this.HCost = this.HCostCalculation();
        this.FCost = this.FCostCalculation();
        this.status = "hidden";
    }

    GCostCalculation = function(){
        return Math.abs(this.StartingNodeCoordinates[1] - this.NodeCoordinates[1]) + Math.abs(this.StartingNodeCoordinates[0] - this.NodeCoordinates[0])
  
    }

    HCostCalculation = function(){
        // console.log("endNodeCoordinates:")
        // console.log(this.endNodeCoordinates)
        // console.log("NodeCoordinates:")
        // console.log(this.NodeCoordinates)


        return Math.abs(this.endNodeCoordinates[1] - this.NodeCoordinates[1]) + Math.abs(this.endNodeCoordinates[0] - this.NodeCoordinates[0])

    }

    FCostCalculation = function(){
        return this.GCost + this.HCost;
    }
}