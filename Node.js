class Node{
    constructor(NodeCoordinates, StartingNodeCoordinates, endNodeCoordinates){
        this.NodeCoordinates = NodeCoordinates;
        this.StartingNodeCoordinates = StartingNodeCoordinates;
        this.endNodeCoordinates = endNodeCoordinates;
        this.Gcost = this.GCostCalculation();
        this.Hcost = this.HCostCalculation();
        this.Fcost = this.FCostCalculation();
        this.status = "hidden";
    }

    GCostCalculation = function(){
        return Math.abs(this.StartingNodeCoordinates[0] - this.NodeCoordinates[0]) + Math.abs(this.StartingNodeCoordinates[1] - this.NodeCoordinates[1])
  
    }

    HCostCalculation = function(){
        return Math.abs(this.endNodeCoordinates[0] - this.NodeCoordinates[0]) + Math.abs(this.endNodeCoordinates[1] - this.NodeCoordinates[1])

    }

    FCostCalculation = function(){
        return this.Gcost + this.Hcost;
    }
}