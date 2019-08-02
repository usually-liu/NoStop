cc.Class({
    extends: cc.Component,

    properties: {
        //玩家节点数据,用于碰撞判断及当前的坐标判断
        player: {
            default: null,
            type: cc.Node,
            tooltip: "玩家的节点",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.playerScript = this.player.getComponent('player');

    },

    start() {

    },

    /**
     * 当物品获取完成时
     */
    onAddGoodsComp() {
        cc.log("animation onAddGoodsComp")
        this.playerScript.onAddGoodsComp();

    },

    /**
     * 当物品使用完成时
     */
    onUseGoodsComp() {

        this.playerScript.onUseGoodsComp();

    },

    /**
     * 当物品移动动画完成时
     * @param {物品所在的位置} index 
     */
    onGoodsMoveComp(index) {

        this.playerScript.onGoodsMoveComp(index);

    },

    // update (dt) {},
});
