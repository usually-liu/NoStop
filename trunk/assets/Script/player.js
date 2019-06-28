import game from 'game';
cc.Class({
    extends: cc.Component,

    properties: {
        playerSpeed: 1,//玩家初始速度
        moveTime: 0.5,//玩家切换冰道所需要的时间
        movePos: 20,//玩家每次进行变换冰道所调用距离所调用的距离
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
        let posx = this.node.x - 20
        let posy = this.node.y
        var left = cc.moveBy(this.moveTime, cc.v2(-40, 0))
        this.node.runAction(left)
    },

    //右转
    rightMove() {
        cc.log("right move")
        let posx = this.node.x - 20
        let posy = this.node.y
        var right = cc.moveBy(this.moveTime, cc.v2(40, 0))
        this.node.runAction(right)
    },

    //减速
    speedDown() {
        this.playerSpeed -= 0.5
        cc.log(this.playerSpeed)
    }

    // update (dt) {},
});
