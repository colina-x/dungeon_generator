const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const SIZE = 5
const WIDTH = 400
const HEIGHT = 300
const COLOR=["green","red","pink","blue","yellow","skyblue","#00ff00","#ddd","#733"]
class Room{
    constructor(x,y,width,height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
}
class Vector2D{
    constructor(x,y){
        this.x=x
        this.y=y
    }
}
MAP = new Array(HEIGHT).fill(0).map(v => new Array(WIDTH).fill(0));

/**
 * 判断两个房间是否重叠
 **/
function IsOverlap(room, other) {
    xx = Math.max(room.x + room.width, other.x + other.width) - Math.min(room.x, other.x)
    yy = Math.max(room.y + room.height, other.y + other.height) - Math.min(room.y, other.y)
    if (xx <= room.width + other.width && yy <= room.height + other.height) {
        return true
    }
    else return false
}
//房间额外大小
roomExtraSize = 0
Rooms = []
currentRegionIndex=0
ind = 0
/**
 * 生成房间
 * @param {number} n 房间个数
 */
function addRooms(n) {
    for (let i = 0; i < n; i++) {
        size = Math.floor(Math.random() * (2 + roomExtraSize) + 1) * 2 + 1
        rectangularity = Math.floor(Math.random() * (1 + size / 2) * 2)
        // console.log(size,rectangularity);
        w = size
        h = size
        if (Math.random() < 0.5) {
            w += rectangularity
        } else {
            h += rectangularity
        }
        x=Math.floor(Math.random()*(WIDTH/SIZE-w-1)/2)*2+1
        y=Math.floor(Math.random()*(HEIGHT/SIZE-h-1)/2)*2+1
        room = new Room(x, y, w, h)
        // console.log(x,y,w,h);
        overlaps = false
        for(let j=0;j<Rooms.length;j++)
            {
                if (IsOverlap(room, Rooms[j])) {
                    overlaps = true
                    break
                    console.log("寄");
                }
            }
        if (overlaps) continue
        Rooms.push(room)
        ++currentRegionIndex

        draw(x,y,w,h)
    }
    console.log("生成房间数：", currentRegionIndex);
}
/**
 * 画房间
 * @param {number} x 左上角x坐标
 * @param {number} y 左上角y坐标
 * @param {number} w 宽
 * @param {number} h 高
 */
function draw(x,y,w,h){
    for(let i=x;i<x+w;i++){
            MAP[i].fill(1,y,y+h)
            
    }
    ctx.fillRect(x*SIZE, y*SIZE, w*SIZE , h*SIZE)
    ctx.fillStyle=COLOR[++ind%COLOR.length]

}

function Maze(){
    console.log("填充");
    for(let x=1;x<WIDTH/SIZE;x+=2){
        for(let y=1;y<HEIGHT/SIZE;y+=2){
            if(IsWall(x,y)){
                GrowMaze(x,y)
            }
        }
    }
}
function CanDig(x,y){
    for(let i=-1;i<=1;i++){
        for(let j=-1;j<=1;j++){
            if(!IsWall(x+i,y+j))
                return false
        }
    }
    return true
}
function IsWall(x,y){
    if(x<0||y<0||x>=WIDTH/SIZE||y>=HEIGHT/SIZE)
        return false
    return MAP[x][y]===0
}
function Carve(x,y){
    MAP[x][y]=1
    ctx.fillRect(x*SIZE, y*SIZE, SIZE, SIZE)
}
function CanCarve(cell,dir){
    if(!IsWall(cell[0]+dir[0]*2,cell[1]+dir[1]*2))
            return false
    for(let i=-1;i<=1;i++){
        for(let j=-1;j<=1;j++){
        if(dir[0]==-i||dir[1]==-j) continue
        // console.log(cell,dir,cell[0]+i+dir[0],cell[1]+j+dir[1]);
        if(!IsWall(cell[0]+i+dir[0],cell[1]+j+dir[1]))
            return false
        }
    }
    return true
}
POSSIBLE_DIR=[[-1,0],[0,-1],[0,1],[1,0]]
function GrowMaze(x,y){
    cells = new Array()
    lastDir = [0,0]
    ++currentRegionIndex
    if(!CanDig(x,y)) return
    Carve(x,y)
    // console.log(CanCarve([2,3],[1,0]))
    cells.push([x,y])
    while(cells.length!=0){
        cell=cells.pop()
        unmadeCells=new Array()
        // console.log(CanCarve([1,3],[1,0]))
        POSSIBLE_DIR.forEach(dir => {
            if(CanCarve(cell,dir)){
                // console.log(dir);
                unmadeCells.push(dir)
            }
        });
        // console.log(unmadeCells.length);
        while(unmadeCells.length!=0){
            // if(unmadeCells.includes(lastDir)){
            //     dir=lastDir
            // }
            // else{
                index = Math.floor(Math.random()*unmadeCells.length)
                // console.log(index);
                dir=unmadeCells[index]
            // }
            Carve(cell[0]+dir[0],cell[1]+dir[1])
            // console.log(cell,dir);
            // Carve(cell[0]+dir[0]*2,cell[1]+dir[1]*2)

            // cells.push([cell[0]+dir[0]*2,cell[1]+dir[1]*2])
            cells.push([cell[0]+dir[0],cell[1]+dir[1]])
            unmadeCells.splice(index,1)
            lastDir=dir
        }
        // else{
        //     cells.splice(unmadeCells.indexOf(cell),1)
            // lastDir=[0,0]
        // }
    }
}

ctx.fillStyle = COLOR[ind];
// ctx.fillRect(0,0,SIZE,SIZE)
/*
for (i = 0;i< WIDTH / SIZE;i++) {
    for (j = 0; j < HEIGHT / SIZE;j++) {
        ctx.fillRect(i, j, SIZE, SIZE)
        ctx.fillStyle = COLOR[++ind];
    }
}
*/

addRooms(40)
ctx.fillStyle = "purple"
Maze()