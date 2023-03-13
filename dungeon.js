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
ind = 0
ctx.fillStyle = COLOR[ind];
for (i in Range(WIDTH / SIZE)) {
    for (j in Range(HEIGHT / SIZE)) {
        ctx.fillRect(i, j, SIZE, SIZE)
        ctx.fillStyle = COLOR[++ind];
    }
}
