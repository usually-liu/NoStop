//敌人类
cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 0,//碰撞距离
        b_isTurn: false,//是否需要进行拐弯
        b_isTurning: false,//是否已经拐弯
        b_isOnside: false,//是否从底部出现
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (this.game.diff >= 0) {
            //获取最初始的旋转角度
            this.rot = this.game.rot;
            //根据旋转角度决定最初的移动方向
            if (this.rot % 360 == 0) {
                this.speedx = 0;
                this.speedy = Math.floor((Math.random() * 200)) + 100;
            }
            else if (this.rot % 270 == 0) {
                this.speedx = Math.floor((Math.random() * 200)) + 100;
                this.speedy = 0;
            }
            else if (this.rot % 180 == 0) {
                this.speedx = 0;
                this.speedy = -1 * (Math.floor((Math.random() * 200)) + 100);
            }
            else if (this.rot % 90 == 0) {
                this.speedx = -1 * (Math.floor((Math.random() * 200)) + 100);
                this.speedy = 0
            }

        }
    },

    getPlayerDistance() {
        //获取玩家相对于世界的位置
        var playerPos = this.game.player.convertToWorldSpaceAR(cc.v2(0, 0));
        //cc.log(playerPos)
        //获取敌人相对于世界的位置
        var enemyToWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        //cc.log(enemyToWorldPos)
        //获取玩家与敌人之间的距离
        var dist = enemyToWorldPos.sub(playerPos).mag();
        return dist;
    },

    /**
     * 判断节点是否移出屏幕
     */
    isOutOfWindow() {
        var posx, posy = this.node.getPosition();
        if (posx < -1 * cc.winSize.height || posx > cc.winSize.height || posy < -1 * cc.winSize.height || posy > cc.winSize.height) {
            return true;
        }
        else {
            return false;
        }
    },

    start() {
        //根据当前难度设定移动速度及是否需要拐弯
        //this.schedule(this.enemyMove(),60/1000)
    },

    update(dt) {
        //玩家与敌人碰撞游戏结束
        if (this.getPlayerDistance() < this.pickRadius) {
            this.game.gameOver();
            this.node.destroy();
            return;
        }

        if (this.b_isOnside == false) {
            //判断当前状态是否是已经转弯的状态
            if (this.rot == this.node.parent.rotation) {
                this.speedx = this.speedx == 0 ? 0 : this.speedx + this.game.playerScript.playerSpeed;
                this.speedy = this.speedy == 0 ? 0 : this.speedy + this.game.playerScript.playerSpeed;
            }
            else {
                if (this.rot > this.node.parent.rotation) {
                    this.speedx = this.speedx == 0 ? -1 * this.game.playerScript.playerSpeed : this.speedx;
                    this.speedy = this.speedy == 0 ? -1 * this.game.playerScript.playerSpeed : this.speedy;
                }
                else {
                    
                }
            }
            this.node.x += this.speedx * dt;
            this.node.y += this.speedy * dt;
        }

        if (this.isOutOfWindow() == ture) {
            this.node.destroy();
        }
    },
});
