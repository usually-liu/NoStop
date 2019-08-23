cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: {
            default: 30,
            tooltip: "碰撞距离",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.b_isPicRadius = false;//是否已经撞到得分点
    },

    start() {

    },

    getPlayerDistance() {
        //获取玩家相对于世界的位置
        var playerPos = this.game.player.convertToWorldSpaceAR(cc.v2(0, 0));
        //cc.log(playerPos)
        //获取自身相对于世界的位置
        var selfToWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        //cc.log(enemyToWorldPos)
        //获取玩家与自身之间的距离
        // var dist = selfToWorldPos.sub(playerPos).mag();
        var dist = selfToWorldPos.y - playerPos.y;
        return dist;
    },

    /**
     * 判断节点是否移出屏幕
     */
    isOutOfWindow() {
        var posx = this.node.getPosition().x;
        var posy = this.node.getPosition().y;
        if (posx < -1.1 * Math.floor(cc.winSize.height) || posx > 1.1 * Math.floor(cc.winSize.height) || posy < -1.1 * Math.floor(cc.winSize.height) || posy > 1.1 * Math.floor(cc.winSize.height)) {
            return true;
        }
        else {
            return false;
        }
    },

    update (dt) {
        if(this.game.b_isGameOver == true || this.game.b_isGameStart == false){
            return; 
        }
        if(this.isOutOfWindow() == true){
            cc.log("destory ScorePoint")
            this.node.destroy();
            return;
        }

        if (this.getPlayerDistance() < this.pickRadius && this.b_isPicRadius == false) {
            //添加得分
            this.game.gainScore(10);
            this.game.addSupportAni();
            this.b_isPicRadius = true;
        }

        this.node.y -= this.game.playerScript.playerSpeed * dt;
    },
});
