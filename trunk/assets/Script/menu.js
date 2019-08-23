cc.Class({
    extends: cc.Component,

    properties: {
        tipsFriend: {
            default: null,
            type: cc.Node,
            tooltip: "分享提问界面",
        },
        tipsRecive: {
            default: null,
            type: cc.Node,
            tooltip: "复活界面"
        },
        player: {
            default: null,
            type: cc.Node,
            tooltip: "玩家对象"
        },
        tipsOk: {
            default: null,
            type: cc.Node,
            tooltip: "确认界面",
        },
        tipsOkMessage: {
            default: null,
            type: cc.Label,
            tooltip: "确认界面文字",
        },
        tipsGoodNode: {
            default: null,
            type: cc.Sprite,
            tooltip: "图片节点"
        },
        tipsGoodSpriteFrame: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "图片资料"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.playerScript = this.player.getCompment("player");
    },

    // update (dt) {},

    /**
     * 跳转到分享界面
     */
    jumpTotips() {
        cc.log("open tips UI")
        cc.director.pause();
        // this.game.b_isGameStart = false;
        this.tipsLable.active = true;
        this.playerScript.diffUp();
    },

    /**
     * 看广告界面选择是
     */
    setItem() {
        cc.log("set item yes")
        //跳转至分享界面

        //重新开始游戏
        this.tipsLable.active = false;
        cc.director.resume();
    },

    /**
     * 选择否
     */

    cancel() {
        cc.log("set item no")
        //不选择看广告
        this.tipsLable.active = false;
        cc.director.resume();
    },

    /**
     * 跳转到看广告复活界面
     */
    jumpToRecive() {
        cc.log("open recive UI")
        cc.director.pause();
        // this.game.b_isGameStart = false;
        this.tipsRecive.active = true;
    },

    /**
     * 选择复活
     */
    reciveYes() {
        //播放广告界面
    },

    /**
     * 不选择复活 
     */
    reciveNo() {

    },

    /**
     * 按钮OK
     */
    btnOK(){
        //继续游戏
    },
});
