module project {
    export class Paper {
        get x():number {
            return this.baseX + Math.sin(this.frame);
        }
        constructor() {
            this.size = Math.random() * 3 + 1; //サイズ変更
            this.dy = Math.random() * 1 + 0.5; //速度変更
            var random_color = "#";
            for(var i = 0; i < 6; i++) {
                random_color += (16*Math.random() | 0).toString(16);
            };
            this.color = random_color
            this.frame = 0;
        }
        public baseX!:number;
        public y!:number;
        public size:number;
        public frame:number;
        public dy:number;
        public color:string;
    }
}
