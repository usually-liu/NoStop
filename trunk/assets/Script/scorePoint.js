cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: {
            default: 30,
            tooltip: "碰撞距离",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.b_isPicRadius = false;//是否已经撞到得分点
    },

    start() {

    },

    // update (dt) {},
});
