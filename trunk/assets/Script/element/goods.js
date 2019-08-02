cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 0,//碰撞距离
        goodsId:{
            default: 0,
            tooltip: "物品ID"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    getPlayerDistance() {
        //获取玩家相对于世界的位置
        var playerPos = this.game.player.convertToWorldSpaceAR(cc.v2(0, 0));
        //cc.log(playerPos)
        //获取敌人相对于世界的位置
        var goodsToWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        //cc.log(enemyToWorldPos)
        //获取玩家与敌人之间的距离
        var dist = goodsToWorldPos.sub(playerPos).mag();
        return dist;
    },

    update (dt) {
        this.node.y -= this.game.playerScript.playerSpeed * dt;
        if(this.getPlayerDistance() < this.pickRadius){
            this.game.playerScript.onPickGoods(this.goodsId);
            this.game.goodsPool.put(this.node)
        }
        if (this.node.y <= -1 * Math.floor(cc.winSize.height) / 2 - 150) {
            
        }
    },
});
