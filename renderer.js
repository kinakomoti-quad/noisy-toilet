/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

var lever = false; //レバー入力
const debug_mode = false //デバッグモード、いずれグローバルから取得したい

 //シリアル通信
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
SerialPort.list((err, ports) => { //ポート確認
    ports.forEach((port) => {
      console.log(port);
    })
})
const port = new SerialPort({
    path: "COM1", //使用するCOMポート割り当て 
    baudRate: 9600
})
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))
parser.on('data', function (data) { //onが送られてきたときに反応
    if (data == 'on') {
        lever = true
        setTimeout(() => {lever = false}, 500) //0.5秒後にレバーをオフにする
    }
    console.log(data)
})

//描画
const s = (p) => {

    var _circleArr = []; //移動中の泡の配列
    var _generatngArr = []; //生成中の泡の配列
    var angle = 0;
    var wash = false;

    let mic; //マイク入力
    let generatingStatus; //泡が成長中か否か

    const volume_threshold = 0.04 //音量閾値
    const wash_time = 10000 //流す処理の時間、ミリ秒

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(200)
        mic = new p5.AudioIn()
        mic.start();
        sound_wash = p.loadSound("sound/sound-wash.mp3")
    }

    p.draw = () => {
        let volume = mic.getLevel()
        if (p.mouseIsPressed === true || volume > volume_threshold) { //泡の生成をするか否か
            generatingStatus = true
        } else {
            generatingStatus = false
        }
        p.background(200)

        if (lever === true && wash === false) {
            wash = true
            if (debug_mode === false) {
                sound_wash.play() //音声を流す、うるさいのでとりあえずオフ
            }
            // sound_wash.play() //音声を流す、うるさいのでとりあえずオフ
            setTimeout(() => {p.resetAll()}, wash_time); //一定時間経過後リセット
        }

        p.push()
        p.translate(p.width/2, p.height/2) //原点をウィンドウの中心に
        if (debug_mode === true) {
            p.fill(255)
            p.ellipse(0,0, 50, 50) //原点確認
        }
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

        //ここから下は将来的にはdebugモードにしたい
        if (debug_mode === true) {
            //パラメータ確認テキスト
            p.textSize(16)
            p.fill(255)
            p.text('volume level: ' + mic.getLevel() , 20, 20)
            p.text('generatingstatus: ' + generatingStatus ,20, 40)
            p.text('circle number: ' + _circleArr.length, 20, 60)
            p.text('generating number: ' + _generatngArr.length, 20, 80)
            p.text('lever:'+ lever, 20, 100)
            p.text('wash:'+ wash, 20, 120)

            //音量図示
            // 音量としきい値をいっしょにグラフに表示する準備
            let y = p.map(volume, 0, 1, p.height, 0);
            let ythreshold = p.map(volume_threshold, 0, 1, p.height, 0);
            p.noStroke();
            p.fill(175);
            // 棒グラフの背景部
            p.rect(0, 0, 20, p.height);
            // 棒グラフの音量部
            p.fill(0);
            p.rect(0, y, 20, y);
            // しきい値の横線
            p.stroke(0);
            p.line(0, ythreshold, 19, ythreshold);
        }
    }

    //押している間だけ成長、押したとき・離したときは使用しないで実装（音声の場合は始まりと終わりがない）

    p.mousePressed = () => {
        if (p.mouseButton == p.RIGHT) { //右クリックで0.5秒だけレバーをオンにする
            lever = true
            setTimeout(() => {lever = false}, 500)
        }
    }
    
    p.resetAll = () => {
        wash = false
        _circleArr.length = 0
        _generatngArr.length = 0
        sound_wash.stop()
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