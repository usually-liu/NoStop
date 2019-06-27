cc.Class({
    extends: cc.Component,

    properties: {
        playerSpeed: 1,//玩家初始速度
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let anim = this.getComponent(cc.Animation);
        let animState = anim.play('player Move');
        animState.wrapMode = cc.WrapMode.Loop;
    },

    // update (dt) {},
});
