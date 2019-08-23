cc.Class({
    extends: cc.Component,

    properties: {
        header: cc.Sprite,
        rank: cc.Label,
        playerPic: cc.Sprite,
        playerName: cc.Label,
        score: cc.Label,
        dis: cc.Label,
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
    },

    updateUserScore(user) {
        //set score
        let score = user.value;
        let userScore = this.score.getComponent(cc.Label);
        userScore.string = score + "m";
        //计算与好友的差距
        let dis = 0;
        if (this.friendData){
            for (let i = 1; i < this.friendData.length; ++i) {
                if (this.friendData[i].score > score) {
                    let curdis = this.friendData[i].score - score;
                    if (curdis < dis) {
                        dis = curdis;
                    }
                }
            }
        }
        //set dis
        let disText = this.dis.getComponent(cc.Label);
        disText.string = "与上一名相差" + dis + "m";
        
    }

    // update (dt) {},
});
