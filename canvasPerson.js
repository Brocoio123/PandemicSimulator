class canvasPerson{
    constructor(y, x, id){
        this.y = y;
        this.x = x;
        
        this.id = id;
    }
    
    draw = function(){
            var img = new Image;
            img.src = 'http://127.0.0.1/PandemicSimulator/chara.png';
            var canvasContext = canvas.getContext('2d');
            // canvas.width = window.innerWidth;
            // canvas.height = window.innerHeight;

            // var CellXSize = Math.round(canvas.width/screenX);
            // var CellYSize = Math.round(canvas.height/screenY);
            console.log(this.y)
            console.log(this.x)

            console.log(CellYSize)
            console.log(CellXSize)

            console.log(this.y*CellYSize)
            console.log(this.x*CellXSize)

            canvasContext.imageSmoothingEnabled = false;
            canvasContext.drawImage(img, ((this.y*CellYSize)-(this.y*CellYSize/4)), ((this.x*CellXSize)+(this.x*CellXSize/3)) , CellXSize,  CellYSize);
        }
}