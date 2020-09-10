// "use strict";
const console = require('electron').remote.require('console');
const {app} = require('electron').remote;
const remote = require('electron').remote;
const dir = remote.app.getAppPath();
const fs = require("fs");
let w = remote.getCurrentWindow();
var snow_num = 200;
var outofWindow_num = 0;
var project;
(function (project) {
    var Main_Snow = (function () {
        function Main_Snow() {
            var _this = this;
            this.snowList = [];
            // 雪を新規で作成する
            this.createSnow = function () {
                for (var i = 0; i < snow_num; i++) {
                    var snow = new project.Snow();
                    _this.snowList.push(snow);
                    // 画面の横いっぱいに雪を降らせる
                    snow.baseX = _this.myCanvas.width * Math.random();
                    // 初期の雪の位置は、画面内から表示させるのではなく、画面の上部から発生させる
                    snow.y = _this.myCanvas.height * Math.random() - _this.myCanvas.height;
                }
            };
            // ブラウザの更新タイミングで呼ばれる(更新)
            this.update = function () {
                var snowListLength = _this.snowList.length;
                for (var i = 0; i < snowListLength; i++) {
                    var snow = _this.snowList[i];
                    // 一定のスピードで下に落ちる
                    snow.y += snow.dy;
                    if (snow.y >= -snow.size) {
                        snow.frame += 0.1;
                    }
                    // 画面外に移動したら、上に移動し、全てが画面外に行くまで降ってこないようにする。
                    if (snow.y >= _this.myCanvas.height + snow.size) {
                        outofWindow_num += 1;
                        snow.y -= _this.myCanvas.height*1000 - snow.size;
                        // snow.baseX = _this.myCanvas.width * Math.random();
                        if (outofWindow_num >= snow_num) {
                          const settings_snow = JSON.parse(fs.readFileSync(`${dir}/nico_settings.json`, 'utf8'));
                          // settings_snow.now_layer = String(Number(settings_snow.now_layer) - 1);
                          fs.writeFileSync(`${dir}/nico_settings.json`, JSON.stringify(settings_snow));
                          w.close();
                      };
                    };
                };
            };
            this.draw = function () {
                _this.context2d.clearRect(0, 0, _this.myCanvas.width, _this.myCanvas.height);
                _this.context2d.fillStyle = "rgb(255,255,255)";
                var snowListLength = _this.snowList.length;
                for (var i = 0; i < snowListLength; i++) {
                    var snow = _this.snowList[i];
                    _this.context2d.beginPath();
                    _this.context2d.arc(snow.x, snow.y, snow.size, 0, Math.PI * 2, false);
                    _this.context2d.fill();
                    _this.context2d.closePath();
                }
            };
            this.myCanvas = document.getElementById('myCanvas');
            this.context2d = this.myCanvas.getContext('2d');
            this.myCanvas.width = document.documentElement.clientWidth;
            this.myCanvas.height = document.documentElement.clientHeight;
            this.createSnow();
        }
        return Main_Snow;
    })();
    project.Main_Snow = Main_Snow;
})(project || (project = {}));
var project;
(function (project) {
    var Snow = (function () {
        function Snow() {
            this.size = Math.random() * 3 + 1; //ここでサイズ変更
            this.dy = Math.random() * 1 + 1; //ここで速度変更
            this.frame = 0;
        }
        Object.defineProperty(Snow.prototype, "x", {
            get: function () {
                return this.baseX + Math.sin(this.frame);
            },
            enumerable: true,
            configurable: true
        });
        return Snow;
    })();
    project.Snow = Snow;
})(project || (project = {}));
