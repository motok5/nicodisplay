"use strict";
var remote = require('electron').remote;
var w = remote.getCurrentWindow();
/// <reference path="./Snow.ts" />
var outofWindow_num = 0;
var snow_num = 200;
module project {

    export class Main_Snow {
        private context2d:CanvasRenderingContext2D;
        private myCanvas:HTMLCanvasElement;
        private snowList:Snow[] = [];

        constructor() {

            this.myCanvas = <HTMLCanvasElement>document.getElementById('myCanvas');
            this.context2d = <CanvasRenderingContext2D>this.myCanvas.getContext('2d');

            this.myCanvas.width = document.documentElement.clientWidth;
            this.myCanvas.height = document.documentElement.clientHeight;

            this.createSnow();
        }
        // 雪を新規で作成する
        private createSnow = () => {
            for (var i = 0; i < snow_num; i++) {
                var snow = new Snow();
                this.snowList.push(snow);
                // 画面の横いっぱいに雪を降らせる
                snow.baseX = this.myCanvas.width * Math.random();
                // 初期の雪の位置は、画面内から表示させるのではなく、画面の上部から発生させる
                snow.y = this.myCanvas.height * Math.random() - this.myCanvas.height;
            }
        }
        // ブラウザの更新タイミングで呼ばれる(更新)
        public update = () => {
            let snowListLength = this.snowList.length;
            for (var i = 0; i < snowListLength; i++) {
                var snow:Snow = this.snowList[i];
                // 一定のスピードで下に落ちる
                snow.y += snow.dy;
                // 左右に揺らすために雪に時間を与える
                if (snow.y >= -snow.size) {
                    snow.frame += 0.1;
                }
                // 画面外に移動したら、上に移動し、全てが画面外に行くまで降ってこないようにする。
                if (snow.y >= this.myCanvas.height + snow.size) {
                    outofWindow_num += 1;
                    snow.y -= this.myCanvas.height*1000 - snow.size;
                    if (outofWindow_num >= snow_num) {
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

            let snowListLength = this.snowList.length;
            for (var i = 0; i < snowListLength; i++) {
                var snow:Snow = this.snowList[i];
                this.context2d.beginPath();
                this.context2d.arc(snow.x, snow.y, snow.size, 0, Math.PI * 2, false);
                this.context2d.fill();
                this.context2d.closePath();
            }
        }

    }
}
