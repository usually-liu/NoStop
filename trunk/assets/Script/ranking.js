cc.Class({
    extends: cc.Component,

    properties: {
        wxSubContextView: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.showAction = cc.fadeTo(0.5,255);
        this.hideAction = cc.fadeTo(0.5,0);
        this.wxSubContextView.active = false;
    },

    start() {

    },

    showRanking() {

        // cc.log("showRanking")
        console.log("showRanking")
        // let menushowRanking = cc.sequence(cc.callFunc(this.setShowRanking, this), this.showAction);
        // this.node.runAction(menushowRanking);
        this.node.active = true;
        this.wxSubContextView.active = true;
        // let openDataContext = wx.getOpenDataContext();
        // openDataContext.postMessage({
        //     type: 'updateMaxScore',
        // });
        // this.node.runAction(this.showAction);

    },

    hideRanking() {

        //cc.log("hideRanking");
        console.log("hideRanking")
        // let menuhideRanking = cc.sequence(this.hideAction, cc.callFunc(this.setHideRanking, this));
        // this.node.runAction(menuhideRanking)
        // this.node.runAction(this.hideAction);
        this.node.active = false;
        this.wxSubContextView.active = false;

    },

    setShowRanking() {
        
        cc.log("setShowRanking")
        this.node.active = true;

    },

    setHideRanking() {

        cc.log("setHideRanking")
        this.node.active = false;

    },

    // update (dt) {},
});
