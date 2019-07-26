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
    },

    init(){
        if (this.game.diff >= 0) {
            //设置初始随机速度
            var speedRandom = Math.floor((Math.random() * 100)) + 100
            //获取最初始的旋转角度
            this.rot = this.game.rot;
            this.node.setRotation(-1 * this.rot)
            cc.log("rotation= " + this.rot)
            //根据旋转角度决定最初的移动方向
            this.speedx = -1 * Math.sin(this.rot * Math.PI / 180) * speedRandom
            this.speedy = Math.cos(this.rot * Math.PI / 180) * speedRandom
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
        var posx = this.node.getPosition().x;
        var posy = this.node.getPosition().y;
        if (posx < -1.1 * Math.floor(cc.winSize.height) || posx > 1.1 * Math.floor(cc.winSize.height) || posy < -1.1 * Math.floor(cc.winSize.height) || posy > 1.1 * Math.floor(cc.winSize.height)) {
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
            this.game.enemyPool.put(this.node)
            return;
        }

        if (this.b_isOnside == false) {
            //判断当前状态是否是已经转弯的状态
            var posx = 0;
            var posy = 0;
            var playerSpeed = this.game.playerScript.playerSpeed;
            var parentRotiation = this.node.parent.getRotation();
            posx = this.speedx + Math.sin(parentRotiation * Math.PI / 180) * playerSpeed;
            posy = this.speedy - Math.cos(parentRotiation * Math.PI / 180) * playerSpeed;
            //cc.log("posx = " + posx + " posy = " + posy + "rot = " + this.rot + " parentrot = " + parentRotiation)
            this.node.x += posx * dt;
            this.node.y += posy * dt;
            //cc.log("speedx = " + this.speedx + " speedy = " + this.speedy)
            //cc.log("x:" + this.node.y + " y:" + this.node.y)
        }

        if (this.isOutOfWindow() == true) {
            cc.log("destroy")
            this.game.enemyPool.put(this.node)
        }
    },

    getPos() {

    },

    /**
     * 设置拐弯,调整速度
     */
    setTurn() {
        cc.log("set turn");
        //this.speedx = -1 * this.speedx;
        //this.speedy = -1 * this.speedy;
    },
});
