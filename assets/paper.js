console.log("hello");
var outofWindow_num = 0;
var paper_num = 500;
var project;
(function (project) {
    var Main_Paper = (function () {
        function Main_Paper() {
            var _this = this;
            this.paperList = [];
            // 紙吹雪を新規で作成する
            this.createPaper = function () {
                for (var i = 0; i < paper_num; i++) {
                    var paper = new project.Paper();
                    _this.paperList.push(paper);
                    // 画面の横いっぱいに紙吹雪を降らせる
                    paper.baseX = _this.myCanvas.width * Math.random();
                    // 初期の紙吹雪の位置は、画面内から表示させるのではなく、画面の上部から発生させる
                    paper.y = _this.myCanvas.height * Math.random() - _this.myCanvas.height;
                }
            };
            // ブラウザの更新タイミングで呼ばれる(更新)
            this.update = function () {
                var paperListLength = _this.paperList.length;
                for (var i = 0; i < paperListLength; i++) {
                    var paper = _this.paperList[i];
                    // 一定のスピードで下に落ちる
                    paper.y += paper.dy;
                    if (paper.y >= -paper.size) {
                        paper.frame += 0.1;
                    }
                    // 画面外に移動したら、上に移動し、全てが画面外に行くまで降ってこないようにする。
                    if (paper.y >= _this.myCanvas.height + paper.size) {
                        outofWindow_num += 1;
                        paper.y -= _this.myCanvas.height*1000 - paper.size;
                        // paper.baseX = _this.myCanvas.width * Math.random();
                        if (outofWindow_num >= paper_num) {
                          const settings = JSON.parse(fs.readFileSync('./../nico_settings.json', 'utf8'));
                          settings.now_layer = String(Number(settings.now_layer) - 1);
                          fs.writeFileSync('./../nico_settings.json', JSON.stringify(settings));
                      };
                    };
                };
            };
            this.draw = function () {
                _this.context2d.clearRect(0, 0, _this.myCanvas.width, _this.myCanvas.height);
                // var color = "#";
                // for(var i = 0; i < 6; i++) {
                //     color += (16*Math.random() | 0).toString(16);
                // };
                // _this.context2d.fillStyle = "white";
                var paperListLength = _this.paperList.length;
                for (var i = 0; i < paperListLength; i++) {
                    var paper = _this.paperList[i];
                    _this.context2d.fillStyle = paper.color;
                    _this.context2d.beginPath();
                    // _this.context2d.arc(paper.x, paper.y, paper.size, 0, Math.PI * 2, false);
                    _this.context2d.fillRect(paper.x,paper.y,paper.width,paper.height);
                    _this.context2d.fill();
                    _this.context2d.closePath();
                }
            };
            this.myCanvas = document.getElementById('myCanvas');
            this.context2d = this.myCanvas.getContext('2d');
            this.myCanvas.width = document.documentElement.clientWidth;
            this.myCanvas.height = document.documentElement.clientHeight;
            this.createPaper();
        }
        return Main_Paper;
    })();
    project.Main_Paper = Main_Paper;
})(project || (project = {}));
var project;
(function (project) {
    var Paper = (function () {
        function Paper() {
            this.width = Math.random() * 5 + 1; //幅
            this.height = this.width; //高さ
            this.size = Math.random() * 3 + 1;
            this.dy = Math.random() * 1 + 2; //速度変更
            var random_color = "#";
            for(var i = 0; i < 6; i++) {
                random_color += (16*Math.random() | 0).toString(16);
            } // random_color生成に時間がかかる
            this.color = random_color;
            this.frame = 0;
        }
        Object.defineProperty(Paper.prototype, "x", {
            get: function () {
                return this.baseX + (Math.sin(this.frame) * 10);
            },
            enumerable: true,
            configurable: true
        });
        return Paper;
    })();
    project.Paper = Paper;
})(project || (project = {}));
