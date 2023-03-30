const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const SIZE = 5
const WIDTH = 395
const HEIGHT = 295
const COLOR=["green","red","pink","blue","yellow","skyblue","#00ff00","#ddd","#733"]
var Rect = function(x,y,width,height) {
    this.x = x || 0
    this.y = y || 0
    this.width = width || 0
    this.height = height || 0
}
Rect.prototype = {
    reset: function ( x, y,width,height ) {

		this.x = x;
		this.y = y;
        this.width = width
        this.height = height
		return this;

	},

	clone : function () {
		return new Rect(this.x, this.y, this.width, this.height);
	},

    copyTo : function (r) {
		r.x = this.x;
		r.y = this.y;
        r.width = this.width;
		r.height = this.height;
	},
    getTop : function(){
        return this.y;
    },
    getBottom : function(){
        return this.y + this.height;
    },
    getLeft : function(){
        return this.x;
    },
    getRight : function(){
        return this.x + this.width;
    },
	points : function(){
        var temp = []
        for(let i=this.x;i<this.getRight();i++) {
            for (let j = this.y; j < this.getBottom(); j++) {
                temp.push(new Vector2(i,j));                
            }
        }
        return temp;
    },
    inflate : function(n){
        this.x+=n;
        this.y+=n;
        this.width-=n;
        this.height-=n;
        return this;
    },
    value : function() {
        return this;
    }

}

var Vector2 = function (x,y) {
	
	this.x= x || 0; 
	this.y = y || 0; 
	
};



Vector2.prototype = {

	reset: function ( x, y ) {

		this.x = x;
		this.y = y;

		return this;

	},
    value : function(){
        return [this.x,this.y]
    },
    add : function(dir){
        return new Vector2(this.x+dir[0],this.y+dir[1]);
    },
	toString : function (decPlaces) {
	 	decPlaces = decPlaces || 3; 
		var scalar = Math.pow(10,decPlaces); 
		return "[" + Math.round (this.x * scalar) / scalar + ", " + Math.round (this.y * scalar) / scalar + "]";
	},
	
	clone : function () {
		return new Vector2(this.x, this.y);
	},
	
	copyTo : function (v) {
		v.x = this.x;
		v.y = this.y;
	},
	
	copyFrom : function (v) {
		this.x = v.x;
		this.y = v.y;
	},	
	
	magnitude : function () {
		return Math.sqrt((this.x*this.x)+(this.y*this.y));
	},
	
	magnitudeSquared : function () {
		return (this.x*this.x)+(this.y*this.y);
	},
	
	normalise : function () {
		
		var m = this.magnitude();
				
		this.x = this.x/m;
		this.y = this.y/m;

		return this;	
	},
	
	reverse : function () {
		this.x = -this.x;
		this.y = -this.y;
		
		return this; 
	},
	
	plusEq : function (v) {
		this.x+=v.x;
		this.y+=v.y;
		
		return this; 
	},
	
	plusNew : function (v) {
		 return new Vector2(this.x+v.x, this.y+v.y); 
	},
	
	minusEq : function (v) {
		this.x-=v.x;
		this.y-=v.y;
		
		return this; 
	},

	minusNew : function (v) {
	 	return new Vector2(this.x-v.x, this.y-v.y); 
	},	
	
	multiplyEq : function (scalar) {
		this.x*=scalar;
		this.y*=scalar;
		
		return this; 
	},
	
	multiplyNew : function (scalar) {
		var returnvec = this.clone();
		return returnvec.multiplyEq(scalar);
	},
	
	divideEq : function (scalar) {
		this.x/=scalar;
		this.y/=scalar;
		return this; 
	},
	
	divideNew : function (scalar) {
		var returnvec = this.clone();
		return returnvec.divideEq(scalar);
	},

	dot : function (v) {
		return (this.x * v.x) + (this.y * v.y) ;
	},
	
	angle : function (useRadians) {
		
		return Math.atan2(this.y,this.x) * (useRadians ? 1 : Vector2Const.TO_DEGREES);
		
	},
	
	rotate : function (angle, useRadians) {
		
		var cosRY = Math.cos(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
		var sinRY = Math.sin(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
	
		Vector2Const.temp.copyFrom(this); 

		this.x= (Vector2Const.temp.x*cosRY)-(Vector2Const.temp.y*sinRY);
		this.y= (Vector2Const.temp.x*sinRY)+(Vector2Const.temp.y*cosRY);
		
		return this; 
	},	
		
	equals : function (v) {
		return((this.x==v.x)&&(this.y==v.x));
	},
	
	isCloseTo : function (v, tolerance) {	
		if(this.equals(v)) return true;
		
		Vector2Const.temp.copyFrom(this); 
		Vector2Const.temp.minusEq(v); 
		
		return(Vector2Const.temp.magnitudeSquared() < tolerance*tolerance);
	},
	
	rotateAroundPoint : function (point, angle, useRadians) {
		Vector2Const.temp.copyFrom(this); 
		//trace("rotate around point "+t+" "+point+" " +angle);
		Vector2Const.temp.minusEq(point);
		//trace("after subtract "+t);
		Vector2Const.temp.rotate(angle, useRadians);
		//trace("after rotate "+t);
		Vector2Const.temp.plusEq(point);
		//trace("after add "+t);
		this.copyFrom(Vector2Const.temp);
		
	}, 
	
	isMagLessThan : function (distance) {
		return(this.magnitudeSquared()<distance*distance);
	},
	
	isMagGreaterThan : function (distance) {
		return(this.magnitudeSquared()>distance*distance);
	}
	
	
	// still AS3 to convert : 
	// public function projectOnto(v:Vector2) : Vector2
	// {
	// 		var dp:Number = dot(v);
	// 
	// 		var f:Number = dp / ( v.x*v.x + v.y*v.y );
	// 
	// 		return new Vector2( f*v.x , f*v.y);
	// 	}
	// 
	// 
	// public function convertToNormal():void
	// {
	// 	var tempx:Number = x; 
	// 	x = -y; 
	// 	y = tempx; 
	// 	
	// 	
	// }		
	// public function getNormal():Vector2
	// {
	// 	
	// 	return new Vector2(-y,x); 
	// 	
	// }
	// 
	// 
	// 
	// public function getClosestPointOnLine ( vectorposition : Point, targetpoint : Point ) : Point
	// {
	// 	var m1 : Number = y / x ;
	// 	var m2 : Number = x / -y ;
	// 	
	// 	var b1 : Number = vectorposition.y - ( m1 * vectorposition.x ) ;
	// 	var b2 : Number = targetpoint.y - ( m2 * targetpoint.x ) ;
	// 	
	// 	var cx : Number = ( b2 - b1 ) / ( m1 - m2 ) ;
	// 	var cy : Number = m1 * cx + b1 ;
	// 	
	// 	return new Point ( cx, cy ) ;
	// }
	// 

};
Vector2Const = {
	TO_DEGREES : 180 / Math.PI,		
	TO_RADIANS : Math.PI / 180,
	temp : new Vector2()
	};
var rng = function(){};
rng.range=(a,b) =>{
    return Math.floor(Math.random() * (b-a) + a)
}
// rng.range=(a) =>{
//     return Math.floor(Math.random() * a)
// }
rng.item=(s) =>{
    var index = rng.range(0, s.length)
    // console.log(s[index]);
    return s[index];
}
rng.oneIn=(n) =>{
    return rng.range(n)==0
}
// class Vector2D{
//     constructor(x,y){
//         this.x=x
//         this.y=y
//     }
// }

/**
 * 判断两个房间是否重叠
 **/
function IsOverlap(room, other) {
    xx = Math.max(room.getRight(), other.getRight()) - Math.min(room.getLeft(), other.getLeft())
    yy = Math.max(room.getBottom(), other.getBottom()) - Math.min(room.getTop(), other.getTop())
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
        size = rng.range(1, 3 + roomExtraSize) * 2 + 1;
        rectangularity = rng.range(0, 1 + size / 2)* 2;
        // console.log(size,rectangularity);
        w = size;
        h = size;
        if (rng.oneIn(2)) {
            w += rectangularity;
        } else {
            h += rectangularity
        }
        x = rng.range(0, (WIDTH / SIZE - w - 1) / 2) * 2 + 1
        y = rng.range(0, (HEIGHT / SIZE - h - 1) / 2) * 2 + 1
        room = new Rect(x,y,w,h);
        // console.log(x,y,w,h);
        overlaps = false;
        for(let other in _rooms) {
            // console.log(_rooms,other);
            if (IsOverlap(room, _rooms[other])) {
                overlaps = true;
                break;
            }
        }
        if (overlaps) continue;
        _rooms.push(room);
        startRegion();
        // console.log(new Rect(x,y,w,h).points());
        temp = new Rect(x,y,w,h).points()
        for(var pos in temp){ 
        // console.log(temp[pos]);
            carve(temp[pos]);
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
    // console.log(pos);
    ctx.fillRect(pos.x*SIZE, pos.y*SIZE, SIZE , SIZE)
    MAP[pos.x][pos.y] = 1;
    _regions[pos] = _currentRegion;
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
    lastDir = null
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
            lastDir=null
        }
    }
}

function _addJunction(connector){
    MAP[connector.x][connector.y] = 1
    ctx.fillRect(connector.x*SIZE,connector.y*SIZE, SIZE , SIZE)
}

function connectRegions() {
    var connectorRegions=new Set();     // TODO
    var connectors = new Array()
    let temp = new Rect(x,y,w,h).inflate(-1).points();
    for(var i in temp){ 
        var pos = temp[i];
        if(getTile(pos) != 0) continue;
        var regions = new Set();
        POSSIBLE_DIR.forEach(dir=>{
            // let aaaa=pos.add(dir)
            // console.log(pos,dir,aaaa);
            var region = _regions[pos.add(dir)];   //TODO????
            console.log(region);

            if(region != null) regions.add(region);
        });
        if(regions.size<2) continue;
        connectorRegions[pos] = regions;
        console.log('connectorRegions:',connectorRegions);
        connectors.push(pos)
    }
    console.log(regions);
    // for(let x=1;x<WIDTH/SIZE-1;x++){
    //     for(let y=1;y<HEIGHT/SIZE-1;y++){
    //         if(getTile([x,y])!=0) continue;
    //         var regions_ = new Set();
    //         POSSIBLE_DIR.forEach(dir=>{
    //             // console.log(x+dir[0],y+dir[1]);
    //             // console.log(_regions);
    //             var region = _regions[x+dir[0]][y+dir[1]];   //TODO????
    //             if(region!=null) regions_.add(region);
    //         });
        

    //         if(regions_.length<2) continue;
    //         connectorRegions[x][y] = regions_;
    //         connectors.push([x,y])
    //     }
    // }

    // console.log(connectors);

    var merged = {};
    openRegions = new Set();
    for (var i = 0; i <= _currentRegion; i++) {
        merged[i] = i;
        openRegions.add(i);
    }

    while (openRegions.size > 1) {
        // let index = Math.floor(Math.random()*connectors.length)
        var connector = rng.item(connectors);
        console.log(connectors);
  
        // TODO
        // _addJunction(connector);
        // console.log(connector);
  
        // Merge the connected regions. We'll pick one region (arbitrarily) and
        // map all of the other regions to its index.
        // console.log(connectorRegions[connector]);
        // if(connectorRegions[pos]==null) continue;
        var regions = new Set(Array.from(connectorRegions[connector]).map((region) => merged[region]));
        var dest = regions[0];
        var sources = Array.from(regions).slice(2);
  
        // Merge all of the affected regions. We have to look at *all* of the
        // regions because other regions may have previously been merged with
        // some of the ones we're merging now.
        for (var i = 0; i <= _currentRegion; i++) {
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
            console.log(connector,pos);
            if (connector.isCloseTo(pos, 2)) continue;
            // if (connector - pos < 2) continue;
            console.log(connectorRegions,pos,connectorRegions[pos]);
            if(connectorRegions[pos]==null) continue;
            var regions = new Set(Array.from(connectorRegions[pos]).map((region) => merged[region]));
            if (regions.size > 1) temp.push(pos);
            if(rng.oneIn(extraConnectorChance)) _addJunction(pos);
        }
        connectors=temp;
        // console.log(connectors.length);
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
    _currentRegion++;
}

function getTile(pos) {
    return MAP[pos.x][pos.y]
}

  //房间额外大小
roomExtraSize = 0
windingPercent = 0
_rooms = []
ind = 0
  /// 当前区域的索引正在雕刻。
_currentRegion = -1;
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
// _regions = new Array(WIDTH/SIZE).fill(0).map(v => new Array(HEIGHT/SIZE).fill(0));
_regions = new Array();
// console.log(_regions);
console.log('添加房间');
addRooms(20)
console.log('生长树算法');

ctx.fillStyle = "purple"
for (let y = 1; y < HEIGHT/SIZE-1; y += 2) {
    for (let x = 1; x < WIDTH/SIZE-1; x += 2) {
        let pos = new Vector2(x,y);
        if (getTile(pos) != 0) continue;
        growMaze(pos);
    }
}
connectRegions()
