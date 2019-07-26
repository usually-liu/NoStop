cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: {
            default: 60,
            tooltip: "碰撞距离",
        }, 
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.animTime = 0;
    },

    start () {
        this.getComponent(cc.Animation).play('whale');
    },

    // update (dt) {
    //     //玩家与鲸鱼碰撞后游戏结束
    //     if (this.getPlayerDistance() < this.pickRadius) {
    //         this.game.gameOver();
    //         this.node.Destroy()
    //         return;
    //     }

    //     //设定每间隔5秒重新播放一次动画
    //     this.animTime += dt
    //     if (this.animTime > 5){
    //         this.getComponent(cc.Animation).play('whale');
    //         this.animTime = 0;
    //     }

    //     var playerSpeed = this.game.playerScript.playerSpeed;
    //     this.node.y -= playerSpeed * dt;
    // },

    // getPlayerDistance() {
    //     //获取玩家相对于世界的位置
    //     var playerPos = this.game.player.convertToWorldSpaceAR(cc.v2(0, 0));
    //     //cc.log(playerPos)
    //     //获取敌人相对于世界的位置
    //     var windToWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
    //     //cc.log(enemyToWorldPos)
    //     //获取玩家与敌人之间的距离
    //     var dist = windToWorldPos.sub(playerPos).mag();
    //     return dist;
    // },
});
