cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: {
            default: 50,
            tooltip: "碰撞距离",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.b_isPicRadius = false;//是否已经完成碰撞
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
        var dist = selfToWorldPos.sub(playerPos).mag();
        return dist;
    },

    update(dt) {
        if (this.getPlayerDistance() < this.pickRadius && this.b_isPicRadius == false) {
            this.game.jumpTotips();
            this.game.addSupportAni();
            this.b_isPicRadius = true;
        }

        this.node.y -= this.game.playerScript.playerSpeed * dt;
    },
});
