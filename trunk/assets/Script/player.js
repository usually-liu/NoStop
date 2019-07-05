cc.Class({
    extends: cc.Component,

    properties: {
        playerSpeed: {
            default: 1,
            tooltip: "玩家的初始速度",
        },
        playerMaxSpeed: {
            default: 5,
            tooltip: "玩家的最大速度",
        },
        moveTime: {
            default: 0.5,
            tooltip: "玩家切换冰道所需要的时间"
        },
        // curRoad: {
        //     default: 1,
        //     tooltip: "当前所在冰道"
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {
        let anim = this.getComponent(cc.Animation);
        let animState = anim.play('player Move');
        animState.wrapMode = cc.WrapMode.Loop;
    },

    //左转
    leftMove() {
        cc.log("left move")
        var roadleft = cc.moveBy(this.moveTime, cc.v2(64, 0));
        this.road.runAction(roadleft);
        var enemyleft = cc.moveBy(this.moveTime, cc.v2(64, 0));
        // var enemyNodes = this.enemy.getComponentsInChildren("enemy");
        // for (var i = 0; i < enemyNodes.length; i++) {
        //     var enemyleft = cc.moveBy(this.moveTime, cc.v2(64, 0));
        //     enemyNodes[i].node.runAction(enemyleft)
        // }
        this.enemy.runAction(enemyleft);
        //this.node.runAction(left);
    },

    //右转
    rightMove() {
        //if (this.curRoad % 2 != 0 && this.curRoad == this.game.road - 1){
        //cc.log("do not rightMove")
        //return;
        //}
        cc.log("right move")
        // if(this.curRoad == 0){

        // }else if(this.curRoad == 2){

        // }else{
        //     this.curRoad += 2
        // }
        var roadright = cc.moveBy(this.moveTime, cc.v2(-64, 0));
        this.road.runAction(roadright);
        var enemyright = cc.moveBy(this.moveTime, cc.v2(-64, 0));
        //var enemyNodes = this.enemy.getComponentsInChildren("enemy");
        //for (var i = 0; i < enemyNodes.length; i++) {
        //var enemyright = cc.moveBy(this.moveTime, cc.v2(-64, 0));
        //enemyNodes[i].node.runAction(enemyright)
        //}
        this.enemy.runAction(enemyright);
        //this.node.runAction(right);
    },

    //减速
    speedDown(event) {
        cc.log(event.type)
        //this.playerSpeed -= 1;
        if (this.playerSpeed <= 0) {
            this.game.gameOver()
        }
    },

    update(dt) {
        if (this.playerSpeed < this.playerMaxSpeed) {
            this.playerSpeed += 200 * dt;
        }
        else {
            this.playerSpeed = this.playerMaxSpeed;
        }
        this.game.updateSpeed();
    },
});
