cc.Class({
    extends: cc.Component,

    properties: {
        header: cc.Sprite,
        rank: cc.Label,
        playerPic: cc.Sprite,
        playerName: cc.Label,
        score: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    createUserBlock(user) {

        // set nickName
        let userName = this.playerName.getComponent(cc.Label);
        userName.string = user.nickName || user.nickname;

        // set avatar
        cc.loader.load({ url: user.avatarUrl, type: 'png' }, (err, texture) => {
            if (err) console.error(err);
            let userIcon = this.header.getComponent(cc.Sprite);
            userIcon.spriteFrame = new cc.SpriteFrame(texture);
        });

        let userScore = this.score.getComponent(cc.Label);
        userScore.string = user.score + "m";
    }

    // update (dt) {},
});
