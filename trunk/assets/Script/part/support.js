cc.Class({
    extends: cc.Component,

    properties: {
        moveTime: {
            default: 0.4,
            tooltip: "移动用时间",
        },
        MoveDis: {
            default: 200,
            tooltip: "移动距离",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.time = 0;
        this.b_isUp = false;
        this.b_isDown = false;
    },

    start() {
        //直接控制支援小动物的动画播放
        this.actionmove = cc.moveBy(this.moveTime, cc.v2(this.MoveDis, 0));
        this.node.runAction(this.actionmove);
    },

    // update(dt) {},
});
