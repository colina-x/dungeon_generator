const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const SIZE = 5
const WIDTH = 395
const HEIGHT = 295
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

/**
 * 生成房间
 * @param {number} n 房间个数
 */
function addRooms(n) {
    for (let i = 0; i < n; i++) {
        size = Math.floor(Math.random() * (2 + roomExtraSize) + 1) * 2 + 1;
        rectangularity = Math.floor(Math.random() * (1 + size / 2)) * 2;
        // console.log(size,rectangularity);
        w = size;
        h = size;
        if (Math.random() < 0.5) {
            w += rectangularity;
        } else {
            h += rectangularity
        }
        x=Math.floor(Math.random()*(WIDTH/SIZE-w-1)/2)*2+1
        y=Math.floor(Math.random()*(HEIGHT/SIZE-h-1)/2)*2+1
        room = new Room(x,y,w,h);
        // console.log(x,y,w,h);
        overlaps = false;
        for(let j=0;j<Rooms.length;j++)
            {
                if (IsOverlap(room, Rooms[j])) {
                    overlaps = true;
                    break;
                }
            }
        if (overlaps) continue;
        Rooms.push(room);
        startRegion();
        for(let i=x;i<x+w;i++){
            for(let j=y;j<y+h;j++){
                carve([i,j]);
            }
        }
    }
    // console.log("生成房间数：", currentRegion);
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
            regions[i].fill(1,y,y+h)
            
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
function carve(pos) {
    ctx.fillRect(pos[0]*SIZE, pos[1]*SIZE, SIZE , SIZE)
    MAP[pos[0]][pos[1]] = 1;
    _regions[pos[0]][pos[1]] = currentRegion;
  }
function CanCarve(cell,dir){
    // 必须在边界内结束。
    if(cell[0]+dir[0]*3>=0||cell[0]+dir[0]*3<WIDTH/SIZE||cell[1]+dir[1]*3>=0||cell[1]+dir[1]*3<HEIGHT/SIZE)
            return false
    // 目的地不得开放。
    return getTile([cell[0]+dir[0]*2,cell[1]+dir[1]*2])==0
    // for(let i=-1;i<=1;i++){
    //     for(let j=-1;j<=1;j++){
    //     if(dir[0]==-i||dir[1]==-j) continue
    //     // console.log(cell,dir,cell[0]+i+dir[0],cell[1]+j+dir[1]);
    //     if(!IsWall(cell[0]+i+dir[0],cell[1]+j+dir[1]))
    //         return false
    //     }
    // }
    // return true
}
POSSIBLE_DIR=[[-1,0],[0,-1],[0,1],[1,0]]
function growMaze(start){
    cells = new Array()
    lastDir = [0,0]
    startRegion()
    carve(start)

    // if(!CanDig(x,y)) return
    // Carve(x,y)
    // console.log(CanCarve([2,3],[1,0]))
    cells.push([x,y])
    while(cells.length!=0){
        cell=cells[cells.length-1]

        // 查看哪些相邻单元格是打开的。
        unmadeCells=new Array()
        // console.log(CanCarve([1,3],[1,0]))
        POSSIBLE_DIR.forEach(dir => {
            if(CanCarve(cell,dir)){
                // console.log(dir);
                unmadeCells.push(dir)
            }
        });
        // console.log(unmadeCells.length);
        if(unmadeCells.length!=0){
            if(unmadeCells.includes(lastDir)&& Math.floor(Math.random()*100) > windingPercent){
                dir=lastDir
            }
            else{
                index = Math.floor(Math.random()*unmadeCells.length)
                // console.log(index);
                dir=unmadeCells[index]
            }
            carve([cell[0]+dir[0],cell[1]+dir[1]])
            // console.log(cell,dir);
            carve([cell[0]+dir[0]*2,cell[1]+dir[1]*2])

            cells.push([cell[0]+dir[0]*2,cell[1]+dir[1]*2])
            // cells.push([cell[0]+dir[0],cell[1]+dir[1]])
            // unmadeCells.splice(index,1)
            lastDir=dir
        }
        else{
            cells.pop()
            lastDir=[0,0]
        }
    }
}

function connectRegions() {
    var connectorRegions=Array.from(Array(WIDTH/SIZE), () => new Array(HEIGHT/SIZE));     // TODO
    connectors = new Array()
    for(let x=1;x<WIDTH/SIZE-1;x++){
        for(let y=1;y<HEIGHT/SIZE-1;y++){
            if(getTile([x,y])!=0) continue;
            var regions_ = new Set();
            POSSIBLE_DIR.forEach(dir=>{
                // console.log(x+dir[0],y+dir[1]);
                // console.log(_regions);
                var region = _regions[x+dir[0]][y+dir[1]];   //TODO????
                if(region!=null) regions_.add(region);
            });
        

            if(regions_.length<2) continue;
            connectorRegions[x][y] = regions_;
            connectors.push([x,y])
        }
    }

    // console.log(connectors);

    var merged = [];
    openRegions = new Set();
    for (var i = 0; i <= currentRegion; i++) {
        merged[i] = i;
        openRegions.add(i);
    }

    while (openRegions.size > 1) {
        let index = Math.floor(Math.random()*connectors.length)
        // console.log(connectors[index]);
        var connector = connectors[index];
  
        // TODO
        // _addJunction(connector);
        // console.log(connector);
        MAP[connector[0]][connector[1]] = 1
        ctx.fillRect(connector[0]*SIZE,connector[1]*SIZE, SIZE , SIZE)
  
        // Merge the connected regions. We'll pick one region (arbitrarily) and
        // map all of the other regions to its index.
        // console.log(Array.from(connectorRegions[connector[0]][connector[1]]));
        var regions = Array.from(connectorRegions[connector[0]][connector[1]]).map((region) => merged[region]);
        var dest = regions[regions.length-1];
        var sources = regions.slice(2);
  
        // Merge all of the affected regions. We have to look at *all* of the
        // regions because other regions may have previously been merged with
        // some of the ones we're merging now.
        for (var i = 0; i <= currentRegion; i++) {
          if (sources.includes(merged[i])) {
            merged[i] = dest;
          }
        }
  
        // The sources are no longer in use.
        sources.forEach(item=>{
            openRegions.delete(item);
        })
        temp=[]
        for(let i=0;i<connectors.length;i++) {
            if (connector - pos < 2) continue
            var regions = new Set(Array.from(connectorRegions[pos[0]][pos[1]]).map((region) => merged[region]));
              if (regions.size > 1) temp.push(pos);
        }
        connectors=temp;
        console.log(connectors.length);
        // Remove any connectors that aren't needed anymore.
        // connectors.removeWhere((pos) {
        //   // Don't allow connectors right next to each other.
        //   if (connector - pos < 2) return true;
  
        //   // If the connector no long spans different regions, we don't need it.
        //   var regions = connectorRegions[pos].map((region) => merged[region])
        //       .toSet();
  
        //   if (regions.length > 1) return false;
  
        //   // This connecter isn't needed, but connect it occasionally so that the
        //   // dungeon isn't singly-connected.
        //   if (rng.oneIn(extraConnectorChance)) _addJunction(pos);
  
        //   return true;
        // });
      }
}

function startRegion() {
    currentRegion++;
}

function getTile(pos) {
    return MAP[pos[0]][pos[1]]
}

function _addJunction(){

}

  //房间额外大小
roomExtraSize = 0
windingPercent = 0
Rooms = []
ind = 0
  /// 当前区域的索引正在雕刻。
currentRegion = -1;
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
MAP = new Array(WIDTH/SIZE).fill(0).map(v => new Array(HEIGHT/SIZE).fill(0));
// console.log(MAP);
_regions = new Array(WIDTH/SIZE).fill(0).map(v => new Array(HEIGHT/SIZE).fill(0));
// console.log(_regions);
console.log('添加房间');
addRooms(20)
ctx.fillStyle = "purple"
for (let y = 1; y < HEIGHT/SIZE-1; y += 2) {
    for (let x = 1; x < WIDTH/SIZE-1; x += 2) {
        let pos = [x,y];
        if (getTile(pos) != 0) continue;
        growMaze(pos);
    }
}
connectRegions()
