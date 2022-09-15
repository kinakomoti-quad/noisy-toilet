/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
// import p5 from "p5.min.js"


const s = (p) => {

    let circle_color = p.color("#ffffff")
    let circle_x = 0
    let circle_y = 0

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(100)
    }

    p.draw = () => {
        if (p.mouseIsPressed) {
            p.fill(p.random(255),p.random(255),p.random(255))
            p.noStroke()
            p.ellipse(p.random(p.windowWidth), p.random(p.windowHeight), p.random(100), p.random(100))
        }
    }
}

const app = new p5(s)