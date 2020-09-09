"use strict";
var remote = require('electron').remote;
var w = remote.getCurrentWindow();
/// <reference path="./Paper.ts" />
var outofWindow_num = 0;
var paper_num = 500;
module project {
    export class Main_Paper {
        private context2d:CanvasRenderingContext2D;
        private myCanvas:HTMLCanvasElement;
        private paperList:Paper[] = [];

        constructor() {

            this.myCanvas = <HTMLCanvasElement>document.getElementById('myCanvas');
            this.context2d = <CanvasRenderingContext2D>this.myCanvas.getContext('2d');

            this.myCanvas.width = document.documentElement.clientWidth;
            this.myCanvas.height = document.documentElement.clientHeight;

            this.createPaper();
        }
        // 紙吹雪を新規で作成する
        private createPaper = () => {
            for (var i = 0; i < paper_num; i++) {
                var paper = new Paper();
                this.paperList.push(paper);
                // 画面の横いっぱいに紙吹雪を降らせる
                paper.baseX = this.myCanvas.width * Math.random();
                // 初期の紙吹雪の位置は、画面内から表示させるのではなく、画面の上部から発生させる
                paper.y = this.myCanvas.height * Math.random() - this.myCanvas.height;
            }
        }
        // ブラウザの更新タイミングで呼ばれる(更新)
        public update = () => {
            let paperListLength = this.paperList.length;
            for (var i = 0; i < paperListLength; i++) {
                var paper:Paper = this.paperList[i];
                // 一定のスピードで下に落ちる
                paper.y += paper.dy;
                // 左右に揺らすために紙吹雪に時間を与える
                if (paper.y >= -paper.size) {
                    paper.frame += 0.1;
                }
                // 画面外に移動したら、上に移動し、全てが画面外に行くまで降ってこないようにする。
                if (paper.y >= this.myCanvas.height + paper.size) {
                    outofWindow_num += 1;
                    paper.y -= this.myCanvas.height*1000 - paper.size;
                    // paper.baseX = this.myCanvas.width * Math.random();
                    if (outofWindow_num >= paper_num) {
                      const fs = require("fs");
                      const settings = JSON.parse(fs.readFileSync('./../nico_settings.json', 'utf8'));
                      settings.now_layer = String(Number(settings.now_layer) - 1);
                      fs.writeFileSync('./../nico_settings.json', JSON.stringify(settings));
                      w.close();
                    }
                }
            }
        }
        public draw = () => {

            this.context2d.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
            this.context2d.fillStyle = "rgb(255,255,255)";

            let paperListLength = this.paperList.length;
            for (var i = 0; i < paperListLength; i++) {
                var paper:Paper = this.paperList[i];
                this.context2d.beginPath();
                this.context2d.arc(paper.x, paper.y, paper.size, 0, Math.PI * 2, false);
                this.context2d.fill();
                this.context2d.closePath();
            }
        }

    }
}
