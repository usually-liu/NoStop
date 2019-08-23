cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    /**
     * 播放动画
     */
    playGameReady(){
        this.node.active = true;
        this.node.getComponent(cc.Animation).play('ready')
    },

    /**
     * 当动画播放完成时
     */
    onReadyComp(){

        this.game.onGameReadyComp();

    },

    // update (dt) {},
});
