const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const SIZE = 10
const WIDTH = 200
const HEIGHT = 150
const COLOR=["green","red","pink"]
class rect{
    constructor(x,y,width,height) {
        this.x = x
        this.y = y
        this.width = width * SIZE
        this.height = height * SIZE
    }
}
roomExtraSize = 0
Rooms = []
currentRegionIndex=0
function addRooms(n) {
    for (i = 0; i < n; i++) {
        size = (int)(Math.random() * (2 + roomExtraSize) + 1) * 2 + 1
        rectangularity = (int)(Math.random() * (1 + size / 2) * 2)
        w = size
        h = size
        if (Math.random() < 0.5) {
            w += rectangularity
        } else {
            h += rectangularity
        }
        room = new rect(x, y, w, h)
        overlaps = false
        try {
            Rooms.forEach(other => {
                if (IsOverlap(room, other)) {
                    overlaps = true
                    throw new Error("get");
                }
            });
        } catch (e) {
            if (e.message == "get") {
                continue
            }
        }
        Rooms.push(room)
        ++currentRegionIndex

        ctx.fillRect(x * SIZE, y * SIZE, w * SIZE, h * SIZE)
        ctx.fillStyle=COLOR[++ind%COLOR.length]
    }
}
function IsOverlap(room, other) {
    xx = Math.max(room.x + room.width, other.x + other.width) - Math.min(room.x, other.x)
    yy = Math.max(room.y + room.height, other.y + other.height) - Math.min(room.y, other.y)
    if (xx <= room.width + other.width && yy <= room.height + other.height) {
        return true
    }
    else return false
}
ind = 0
/*
ctx.fillStyle = COLOR[ind];
ctx.fillRect(0,0,SIZE,SIZE)
for (i = 0;i< WIDTH / SIZE;i++) {
    for (j = 0; j < HEIGHT / SIZE;j++) {
        ctx.fillRect(i, j, SIZE, SIZE)
        ctx.fillStyle = COLOR[++ind];
    }
}
*/

addRooms(5)