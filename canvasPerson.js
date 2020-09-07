class canvasPerson{
    constructor(y, x, id){
        //x and y are not pixels on the screen but the position where their respective
        //persons are on the grid.
        this.y = y;
        this.x = x;
        this.previousTop = 0
        this.previousLeft = 0
        this.previousBottom = 0
        this.previousRight = 0

        this.id = id;
        this.sprite = 'http://127.0.0.1/PandemicSimulator/chara0.png';
        this.animationFrame = 0
        this.XOffset = 0;
        this.YOffset = 0;
        this.XOffsetActive = 0;
        this.YOffsetActive = 0;
        this.myInterval = 0
    }

    changeSprite = function(spr){
        switch(spr) {
            case 0:
                this.sprite = 'http://127.0.0.1/PandemicSimulator/chara0.png';
                break;
            case 1:
                this.sprite = 'http://127.0.0.1/PandemicSimulator/chara1.png';
                break;
            case 2:
                this.sprite = 'http://127.0.0.1/PandemicSimulator/chara0.png';
                break;
            case 3:
                this.sprite = 'http://127.0.0.1/PandemicSimulator/chara2.png';
                this.animationFrame = -1;
                break;
          }
          this.animationFrame++;
    }

    updatePreviousVars = function(){
        this.previousTop = (this.x*CellXSize)+(this.x*CellXSize/3);
        this.previousLeft = (this.y*CellYSize)-(this.y*CellYSize/4);
        this.previousBottom = (((this.x*CellXSize)+(this.x*CellXSize/3))+CellYSize)
        this.previousRight = ((this.y*CellYSize)-(this.y*CellYSize/4)+CellXSize)
    }

    moveCanvasPerson = function(){
        //only works with values greater than turnInter
        this.XOffsetActive = 0
        this.YOffsetActive = 0
        clearInterval(this.myInterval)
        this.myInterval = setInterval(frame.bind(this),(turnInterval/65))//50
        function frame(){
            // console.log("LKJ: " + (turnInterval/65))
            if(this.previousLeft + this.XOffsetActive == ((this.y*CellYSize)-(this.y*CellYSize/4)) && this.previousTop + this.YOffsetActive == ((this.x*CellXSize)+(this.x*CellXSize/3))){
                console.log("CLEARED!!!!!")
                console.log("CLEARED!!!!!")
                console.log("CLEARED!!!!!")
                console.log("CLEARED!!!!!")
                console.log("CLEARED!!!!!")
                console.log("CLEARED!!!!!")
                console.log("CLEARED!!!!!")
                console.log("CLEARED!!!!!")
                console.log("CLEARED!!!!!")
                console.log("CLEARED!!!!!")
                console.log("CLEARED!!!!!")
                console.log("CLEARED!!!!!")
                console.log("CLEARED!!!!!")
                console.log("--------------")
                clearInterval(this.myInterval)
            }else{
                //console.log(this.XOffset)
                //console.log(this.XOffsetActive)

                //because CellXSize and CellYSize are different then both will not equal their targets at the same
                //time if both are incremented or decremented by 1(moving diagonally).
                this.XOffsetActive += (this.YOffset * 0.75);
                this.YOffsetActive += this.XOffset;
                
                // console.log(this.previousTop)
                // console.log(((this.x*CellXSize)+(this.x*CellXSize/3)))


                // console.log("currentX: " + (this.previousLeft + this.XOffsetActive))
                // console.log("destinationX: " + ((this.y*CellYSize)-(this.y*CellYSize/4)))
                // console.log("currentY: " + (this.previousTop + this.YOffsetActive))
                // console.log("destinationY: " + ((this.x*CellXSize)+(this.x*CellXSize/3)))
            }
        }
    }

    draw = function(){
        let canvasContext = canvas.getContext('2d');
        // canvasContext.clearRect((this.y*CellYSize)-(this.y*CellYSize/4), (this.x*CellXSize)+(this.x*CellXSize/3), ((this.y*CellYSize)-(this.y*CellYSize/4)+CellXSize), (((this.x*CellXSize)+(this.x*CellXSize/3))+CellYSize));
        //canvasContext.clearRect(this.previousTop, this.previousLeft, this.previousBottom, this.previousRight);
        let img = new Image;
        img.src = this.sprite;
        canvasContext.imageSmoothingEnabled = false;
        canvasContext.drawImage(img, this.previousLeft + this.XOffsetActive, this.previousTop + this.YOffsetActive, CellXSize,  CellYSize);
        // canvasContext.drawImage(img, ((this.y*CellYSize)-(this.y*CellYSize/4)), ((this.x*CellXSize)+(this.x*CellXSize/3)) , CellXSize,  CellYSize);
    }
}