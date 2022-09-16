/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const s = (p) => {

    var _num = 10; //一度に生成する円の数
    var _circleArr = [];

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(200)
    }

    p.draw = () => {
        p.background(200)
        for (var i=0; i<_circleArr.length; i++) {
            thisCirc = _circleArr[i];
            thisCirc.updateMe();
        }
    }

    p.mouseReleased = () => {
        p.drawCircles()
        p.print('tick') //デバッグ用出力
    }

    p.drawCircles = () => {
        var thisCirc
        for (var i=0; i<_num; i++) {
            thisCirc = new Circle ()
            thisCirc.drawMe();
            _circleArr.push(thisCirc);     
        }
    }
    
    class Circle {
        constructor() {
            this.x = p.random(p.width);
            this.y = p.random(p.height);
            this.radius = p.random(100) + 10;
            this.linecol_r = p.random(255);
            this.linecol_g = p.random(255);
            this.linecol_b = p.random(255);
            this.fillcol_r = p.random(255);
            this.fillcol_g = p.random(255);
            this.fillcol_b = p.random(255);
            this.alpha = p.random(255);
            this.xmove = p.random(4) - 2;
            this.ymove = p.random(4) - 2;
        }

        drawMe() {
            p.noStroke()
            p.fill(this.fillcol_r, this.fillcol_g, this.fillcol_b, this.alpha);
            p.ellipse(this.x, this.y, this.radius*2, this.radius*2);
            p.stroke(this.linecol_r, this.linecol_g, this.linecol_b, 150);
            p.noFill();
            p.ellipse(this.x, this.y, 10, 10);
        }

        updateMe() {
            this.x += this.xmove;
            this.y += this.ymove;
            if (this.x > (p.width+this.radius)) { this.x = 0 - this.radius; }
            if (this.x < (0-this.radius)) { this.x = p.width + this.radius; }
            if (this.y > (p.height+this.radius)) { this.y = 0 - this.radius; }
            if (this.y < (0-this.radius)) { this.y = p.height + this.radius; }
            this.drawMe(); 
        }
    }

}

const app = new p5(s)