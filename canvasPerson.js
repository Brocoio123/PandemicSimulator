class canvasPerson{
    constructor(y, x, id, spriteId){
        //x and y are not pixels on the screen but the position where their respective
        //persons are on the grid.
        this.y = y;
        this.x = x;
        this.id = id;
        this.spriteId = spriteId;

        this.previousTop;
        this.previousLeft;
        this.previousBottom;
        this.previousRight;
        this.sprite = 'http://127.0.0.1/PandemicSimulator/sprites/chara0Down0.png';
        this.XOffset;
        this.YOffset;
        this.XOffsetActive;
        this.YOffsetActive;
        this.myInterval;
        this.animationFrame = 0;
    }

    changeSprite = function(spr){
        let direction = "Down";
        // console.log(this.XOffset + ", " + this.YOffset)
        if(this.XOffset == 0){
            if(this.YOffset == -1){
                //left
                direction = "Left";
            }else 
            if(this.YOffset == 1){
                //right
                direction = "Right";
            }
        }else
        if(this.XOffset == -1){
            if(this.YOffset == -1){
                //left-up
                direction = "Left";
            }else
            if(this.YOffset == 0){
                //up
                direction = "Up";
            }else
            if(this.YOffset == 1){
                //right-up
                direction = "Right";
            }
        }else
        if(this.XOffset == 1){
            if(this.YOffset == -1){
                //left-down
                direction = "Left";
            }else
            if(this.YOffset == 0){
                //down
                direction = "Down";
        }else
        if(this.YOffset == 1){
            //right-down
            direction = "Right";
            }
        }

        switch(spr) {
            case 0:
                this.sprite = 'http://127.0.0.1/PandemicSimulator/sprites/chara' + this.spriteId + direction + '0.png';
                break;
            case 1:
                this.sprite = 'http://127.0.0.1/PandemicSimulator/sprites/chara' + this.spriteId + direction + '1.png';
                break;
            case 2:
                this.sprite = 'http://127.0.0.1/PandemicSimulator/sprites/chara' + this.spriteId + direction + '0.png';
                break;
            case 3:
                this.sprite = 'http://127.0.0.1/PandemicSimulator/sprites/chara' + this.spriteId + direction + '2.png';
                this.animationFrame = -1;
                break;
          }
          this.animationFrame++;
    }

    updatePreviousVars = function(){
        this.previousTop = (this.x*CellXSize)+(this.x*CellXSize/3);
        this.previousLeft = (this.y*CellYSize)-(this.y*CellYSize/4);
        this.previousBottom = (((this.x*CellXSize)+(this.x*CellXSize/3))+CellYSize);
        this.previousRight = ((this.y*CellYSize)-(this.y*CellYSize/4)+CellXSize);
    }

    moveCanvasPerson = function(){
        //only works with values greater than turnInter
        this.XOffsetActive = 0;
        this.YOffsetActive = 0;
        clearInterval(this.myInterval);
        this.myInterval = setInterval(frame.bind(this),(turnInterval/65)/*5*/);//50
        function frame(){
            if(this.previousLeft + this.XOffsetActive == ((this.y*CellYSize)-(this.y*CellYSize/4)) && this.previousTop + this.YOffsetActive == ((this.x*CellXSize)+(this.x*CellXSize/3))){
                // console.log("CLEARED!!!!!");
                // console.log("--------------");
                clearInterval(this.myInterval);
            }else{
                //because CellXSize and CellYSize are different then both will not equal their targets at the same
                //time if both are incremented or decremented by 1(moving diagonally).
                this.XOffsetActive += (this.YOffset * 0.75);
                this.YOffsetActive += this.XOffset;
            }

        }
    }

    draw = function(){
        let canvasContext = canvas.getContext('2d');
        let img = new Image;
        img.src = this.sprite;
        canvasContext.imageSmoothingEnabled = false;
        canvasContext.drawImage(img, this.previousLeft + this.XOffsetActive, this.previousTop + this.YOffsetActive, CellXSize,  CellYSize);
    }
}