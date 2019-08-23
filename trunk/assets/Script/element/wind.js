cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: {
            default: 100,
            tooltip: "碰撞距离",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.speed = 500;//初始化速度
    },

    start() {
        this.getComponent(cc.Animation).play('wind');
    },

    update(dt) {
        if(this.game.b_isGameOver == true || this.game.b_isGameStart == false){
            return; 
        }
        //玩家与风碰撞后游戏结束
        if (this.getPlayerDistance() < this.pickRadius) {
            this.game.gameOver();
            this.node.destroy()
            return;
        }
        var playerSpeed = this.game.playerScript.playerSpeed;
        var moveDis = playerSpeed + this.speed;
        this.node.y -= moveDis * dt;
    },

    getPlayerDistance() {
        //获取玩家相对于世界的位置
        var playerPos = this.game.player.convertToWorldSpaceAR(cc.v2(0, 0));
        //cc.log(playerPos)
        //获取敌人相对于世界的位置
        var windToWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        //cc.log(enemyToWorldPos)
        //获取玩家与敌人之间的距离
        //var dist = windToWorldPos.sub(playerPos).mag();
        var dist = windToWorldPos.y - playerPos.y;
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

    /**
     * 当动画播放完成时
     */
    onWindPlayComp() {
        this.node.destroy();
    },
});
