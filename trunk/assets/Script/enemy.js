//敌人类
cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 0,//碰撞距离
        speed: 4,//初始移动速度
        b_isTurn: false,//是否需要进行拐弯
        b_isTurning: false,//是否已经拐弯
        b_isOnside: false,//是否从底部出现
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (this.game.diff >= 0) {
            this.speed = Math.floor((Math.random() * 400))
        }
    },

    getPlayerDistance() {
        //获取玩家相对于世界的位置
        var playerPos = this.game.player.convertToWorldSpaceAR(cc.v2(0, 0));
        //cc.log(playerPos)
        //获取敌人相对于世界的位置
        var enemyToWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        //cc.log(enemyToWorldPos)
        // cc.log(enemyToWorldPos);
        //获取玩家与敌人之间的距离
        var dist = enemyToWorldPos.sub(playerPos).mag();
        return dist;
    },

    start() {
        //根据当前难度设定移动速度及是否需要拐弯
        //this.schedule(this.enemyMove(),60/1000)
    },

    update(dt) {
        this.enemyMove(dt)
    },

    enemyMove(dt) {
        //玩家与敌人碰撞游戏结束
        if (this.getPlayerDistance() < this.pickRadius) {
            this.game.gameOver();
            this.node.destroy();
            return;
        }

        if (this.b_isOnside == false) {
            this.node.y -= (this.game.player.playerSpeed + this.speed) * dt;
        }

        if (this.node.y <= -cc.winSize.height / 2 - 32) {
            this.node.destroy();
        }
    },
});
