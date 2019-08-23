cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        prefab: cc.Prefab,
        playerRank: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.friendData = null;
    },

    start() {

        if (typeof wx === 'undefined') {
            return;
        }

        wx.onMessage(data => {
            if (data) {
                console.log(data);
                if (data.text == 'setUserCloudStorage') {
                    wx.getUserCloudStorage({
                        keyList: ['score'], // 你要获取的、托管在微信后台都key
                        success: res => {
                            if (res) {
                                console.log(res);
                                this.playerRank.getComponent("playerRank").updateUserScore(res.KVDataList[0]);
                            }
                        }
                    })
                }
            }
        });

        this.initUserInfo();
        this.initFriendInfo();

    },

    initUserInfo() {
        console.log("initUserInfo");
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            lang: 'zh_CN',
            success: (res) => {
                if (res) {
                    console.log(res.data);
                    this.playerRank.getComponent("playerRank").createUserBlock(res.data[0]);
                }
            },
            fail: (res) => {
                console.error(res);
            }
        });
    },

    initFriendInfo() {
        // cc.log("initFriendInfo");
        wx.getFriendCloudStorage({
            keyList: ['score'],
            success: (res) => {
                if (res) {
                    this.friendData = res.data;
                    for (let i = 0; i < res.data.length; ++i) {
                        let node = cc.instantiate(this.prefab);
                        node.parent = this.content;
                        node.x = 0;
                        node.y = (i * -189) - 94.5;
                        node.getComponent("otherRank").createUserBlock(res.data[i]);
                    }
                }
            },
            fail: (res) => {
                console.error(res);
            }
        });
        //测试用代码,测试列表能否正常运行
        // for (let i = 0; i < 10; ++i) {
        //     let node = cc.instantiate(this.prefab);
        //     node.parent = this.content;
        //     node.x = 0;
        //     node.y = (i * -189) - 94.5;
        //     //node.getComponent("otherRank").createUserBlock(res.data[i]);
        // }

    },

    // update (dt) {},
});
