cc.Class({
    extends: cc.Component,

    properties: {
        far_bg: [cc.Node],  //用于管理背景图片结点的数组,记得回cocos面板中添加数组的结点数量
        bg_speed: 0.6,      //移动时控制速度的变量
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    update(dt) {

        this.bgMove(this.far_bg, this.bg_speed);

    },



    bgMove: function (bgList, speed) {

        //每次循环二张图片一起滚动

        for (let index = 0; index < bgList.length; index++) {

            bgList[index].y -= speed;

        }

        //y坐标减去自身的height得到这张背景刚好完全离开场景时的y值

        if (bgList[0].y <= 20 - bgList[0].height) {

            bgList[0].y = 1000; //离开场景后将此背景图的y重新赋值，位于场景的上方

        }

        if (bgList[1].y <= 1020 - 2 * bgList[1].height) {

            bgList[1].y = 1000;

        }

    },
});
