cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: {
            default: 60,
            tooltip: "碰撞距离",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.animTime = 0;
        this.downTime = 0;
        this.bCanPick = false;
        this.bIsDownTiming = false;
        this.curanimState = null;
    },

    start() {
        this.curanimState = this.getComponent(cc.Animation).play('whale');
    },

    update(dt) {
        //玩家与鲸鱼碰撞后游戏结束
        if (this.getPlayerDistance() < this.pickRadius && this.bCanPick == true) {
            this.game.gameOver();
            this.node.destroy()
            return;
        }

        //设定每间隔5秒重新播放一次动画
        this.animTime += dt
        if (this.animTime > 5) {
            this.curanimState = this.getComponent(cc.Animation).play('whale');
            this.animTime = 0;
        }

        if (this.bIsDownTiming == true){
            this.downTime += dt
            if (this.downTime > 1){
                this.curanimState = this.getComponent(cc.Animation).play('whaleDown');
                this.downTime = 0;
                this.bIsDownTiming = false;
            }
        }

        var playerSpeed = this.game.playerScript.playerSpeed;
        this.node.y -= playerSpeed * dt;
    },

    getPlayerDistance() {
        //获取玩家相对于世界的位置
        var playerPos = this.game.player.convertToWorldSpaceAR(cc.v2(0, 0));
        //cc.log(playerPos)
        //获取敌人相对于世界的位置
        var trafficToWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        //cc.log(enemyToWorldPos)
        //获取玩家与敌人之间的距离
        var dist = trafficToWorldPos.sub(playerPos).mag();
        return dist;
    },

    /**
     * 设置碰撞状态
     * @param {是否会有碰撞逻辑} bCanPick 
     */
    setPickState(bCanPick) {

        this.bCanPick = bCanPick;

    },

    /**
     * 当上升动作完成时
     */
    onWhileComp(){

        this.bIsDownTiming = true;

    },

    /**
     * 当使用物品时
     */
    onUseItem(){
        if(this.curanimState.name == 'whale'){
            this.curanimState = this.getComponent(cc.Animation).play('whaleDown');
            this.downTime = 0;
            this.bIsDownTiming = false;
        }
        else if(this.curanimState.name == 'whaleDown'){
            this.curanimState = this.getComponent(cc.Animation).play('whale');
            this.animTime = 0;
        }
    },
});
