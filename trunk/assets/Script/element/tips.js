cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    init(b_isEnemy) {
        this.rot = this.game.rot;
        this.node.angle = this.rot
        this.b_isEnemy = b_isEnemy;
    },

    start() {

    },

    playBlink(index) {
        //cc.log("play blink");
        //this.node.runAction(blick);
        // let blick = cc.blink(1.0, 3);
        let seq = cc.sequence(cc.blink(1.5, 5), cc.callFunc(this.onBlinkComp, this, index));
        this.node.runAction(seq);
    },

    onBlinkComp(target, index) {

        //cc.log("onBlinkComp");
        this.game.tipsPool.put(this.node)
        //播放完毕后创建敌人
        if(this.b_isEnemy == false){
            let index = Math.floor(Math.random() * 3)
            cc.log(index);
            if(index == 0){
                this.game.createCross();
            }else if(index == 1){
                this.game.createTraffic();
            }else if(index == 2){
                this.game.createWind();
            }
        }else{
            this.game.createEnemy(index);
        }
        
    }

    // update (dt) {},
});
