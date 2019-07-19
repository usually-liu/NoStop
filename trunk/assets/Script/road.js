cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        //this.schedule(this.roadMove(),60/1000)
    },

    update(dt) {
        this.roadMove(dt)
    },

    /**
     * 道路移动
     * @param {调用该帧所需时间} dt 
     */

    roadMove(dt) {
        this.node.y -= this.game.playerScript.playerSpeed * dt;
        if (this.node.y <= -1 * Math.floor(cc.winSize.height) / 2 - 32) {
            this.game.onRoadKilled(this);
        }
    },
});
