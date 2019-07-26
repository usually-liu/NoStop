cc.Class({
    extends: cc.Component,

    properties: {
        scene1:"game"
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on("touchstart",this.onTouchStart,this)
        this.node.on("touchend",this.onTouchEnd,this)
    },

    start () {

    },

    onTouchStart(){
        cc.log("touchstart")
    },

    onTouchEnd(){
        cc.log("touchend")
        cc.director.loadScene(this.scene1)
    },

    onDestroy(){
        this.node.off("touchstart",this.onTouchStart,this)
        this.node.off("touchend",this.onTouchEnd,this)
    },

    // update (dt) {},
});
