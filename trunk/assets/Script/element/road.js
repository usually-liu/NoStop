cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    /**
     * 
     * @param {对象ID:1为道路,2为左侧雪堆,3为右侧雪堆} poolIndex 
     */
    init(poolIndex){
        this.poolIndex = poolIndex
    },

    start() {
        //this.schedule(this.roadMove(),60/1000)
    },

    update(dt) {
        if(this.game.b_isGameOver == true || this.game.b_isGameStart == false){
           return; 
        }
        this.roadMove(dt)
    },

    /**
     * 道路移动
     * @param {调用该帧所需时间} dt 
     */

    roadMove(dt) {
        this.node.y -= this.game.playerScript.playerSpeed * dt;
        if (this.node.y <= -1 * Math.floor(cc.winSize.height) / 2 - 150) {
            if (this.poolIndex == 1){
                this.game.roadPool.put(this.node)
            }else if(this.poolIndex == 2){
                
            }else if(this.poolIndex == 3){

            }
        }
    },
});
