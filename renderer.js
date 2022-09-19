/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const s = (p) => {

    var _circleArr = []; //移動中の泡の配列
    var _generatngArr = []; //生成中の泡の配列
    var angle = 0;
    var wash = false;

    let mic; //マイク入力
    let generatingStatus; //泡が成長中か否か

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(200)
        mic = new p5.AudioIn()
        mic.start();
    }

    p.draw = () => {
        if (p.mouseIsPressed === true) { //泡の生成をするか否か
            generatingStatus = true
        } else {
            generatingStatus = false
        }
        p.background(200)
        p.push()
        p.translate(p.width/2, p.height/2) //原点をウィンドウの中心に
        p.ellipse(0,0, 50, 50) //原点確認
        if (wash === true) { //図形を流す処理
            //回転処理
            p.rotate(angle)
            angle += 0.01
            //収縮処理はupdateMeで
        }
        if (wash === false && generatingStatus === true) { //泡の生成
            if (_generatngArr.length == 0) {
                thisCirc = new Circle ()
                _generatngArr.push(thisCirc)
            }
        }
        for (var i=0; i<_circleArr.length; i++) { //泡の移動
            thisCirc = _circleArr[i];
            thisCirc.updateMe();
        }
        for (var i=0; i<_generatngArr.length; i++) { //泡の成長
            thisCirc = _generatngArr[i];
            thisCirc.glowMe()
        }
        if (generatingStatus === false) { //泡を成長配列から移動配列へ移行
            while (_generatngArr.length != 0) {
                thisCirc = _generatngArr.pop()
                _circleArr.push(thisCirc)
            }
        }
        p.pop() //原点を左上に戻す
        //パラメータ確認テキスト、将来的にはdebugモードにしたい
        p.textSize(16)
        p.fill(255)
        p.text('volume level: ' + mic.getLevel() , 20, 20)
        p.text('generatingstatus: ' + generatingStatus ,20, 40)
        p.text('circle number: ' + _circleArr.length, 20, 60)
        p.text('generating number: ' + _generatngArr.length, 20, 80)
    }

    //押している間だけ成長、押したとき・離したときは使用しないで実装（音声の場合は始まりと終わりがない）

    p.mouseReleased = () => {
        if (p.mouseButton == p.RIGHT) { //右クリックで流す
            wash = true
        }
    }
    
    class Circle {
        constructor() {
            this.x = p.random(p.width) - p.width/2;
            this.y = p.random(p.height) - p.height/2;
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
            this.glowing = true;
        }

        drawMe() {
            p.noStroke()
            p.fill(this.fillcol_r, this.fillcol_g, this.fillcol_b, this.alpha);
            p.ellipse(this.x, this.y, this.radius*2, this.radius*2);
            p.stroke(this.linecol_r, this.linecol_g, this.linecol_b, 150);
            p.noFill(); //おまけの円
            p.ellipse(this.x, this.y, 10, 10);
        }

        updateMe() {
            if (wash === false) { //通常時
                this.x += this.xmove;
                this.y += this.ymove;
                //ウィンドウ境界で跳ね返る
                if (this.x > p.width/2 - this.radius || this.x < - p.width/2 + this.radius) {this.xmove = this.xmove*(-1)}
                if (this.y > p.height/2 - this.radius || this.y < - p.height/2 + this.radius) {this.ymove = this.ymove*(-1)}
            } else if (wash === true) { //流すとき
                this.x = this.x * 0.99
                this.y = this.y * 0.99
                this.radius = this.radius * 0.99
            }
            this.drawMe(); 
        }

        glowMe() {
            this.radius += 1
            if (generatingStatus === false) {this.glowing = false}
            this.drawMe()
        }

    }

}

const app = new p5(s)