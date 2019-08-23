cc.Class({
    extends: cc.Component,

    properties: {
        guide: {
            default: null,
            tooltip: "图片节点",
            type: cc.Sprite,
        },

        guideSprite: {
            default: [],
            tooltip: "新手引导图片资源",
            type: cc.SpriteFrame,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.guideIndex = 0;
    },

    // update (dt) {},

    setGuide(Index) {

        if (Index == null)
            return

        //cc.log("guide", Index);
        let action = cc.scaleTo(0.5, 1.0, 1.0);

        this.guideIndex = Index;
        this.game.b_isGameStart = false;
        this.node.active = true;
        this.guide.spriteFrame = this.guideSprite[Index];
        this.node.runAction(action);

    },

    guideClose() {

        let action = cc.scaleTo(0.5, 0, 0)
        let callfun = cc.callFunc(this.actionComp, this, this.guideIndex)
        let seqs = cc.sequence(action, callfun);
        this.node.runAction(seqs);

    },

    actionComp() {

        if (this.guideIndex == 1) {
            this.game.createTips();
        }

        this.node.active = false;
        this.game.b_isGameStart = true;

    },
});
