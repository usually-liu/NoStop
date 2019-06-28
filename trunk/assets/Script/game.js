cc.Class({
    extends: cc.Component,

    properties: {
        //地图相关的数据
        far_bg: [cc.Node],  //用于管理背景图片结点的数组,记得回cocos面板中添加数组的结点数量

        //冰道相关设定
        //冰道的节点,用于放置新的冰道
        road:{
            default:null,
            type:cc.Node
        },
        //冰道的预设
        roadPrefab: {
            default: null,
            type: cc.Prefab
        },

        //玩家节点数据,用于碰撞判断及当前的坐标判断
        player: {
            default: null,
            type: cc.Node
        },

        diff: 0,//难度划分,用于判断下一个冰道的生成的内容及Npc数量
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //生成初始冰道
        for (let i = 1; i <= 2; i++) {
            this.createRoad('vertical', i, 0)
        }
    },

    onDestroy() {

    },

    start() {
        this.playerScript = this.player.getComponent("player")
    },

    update(dt) {

        this.bgMove(this.far_bg, this.playerScript.playerSpeed);
        this.roadMove(this.playerScript.playerSpeed)

    },

    /**
     * 底图移动
     * @param {屏幕底图列表} bgList 
     * @param {底图(玩家)的移动速度} speed 
     */
    bgMove(bgList, speed) {

        //每次循环二张图片一起滚动

        for (let index = 0; index < bgList.length; index++) {

            bgList[index].y -= speed;

        }

        //y坐标减去自身的height得到这张背景刚好完全离开场景时的y值

        if (bgList[0].y <= -1 * bgList[0].height) {

            bgList[0].y = 960; //离开场景后将此背景图的y重新赋值，位于场景的上方

        }

        if (bgList[1].y <= -1 * bgList[1].height) {

            bgList[1].y = 960;

        }

    },

    /**
     * 生成冰道
     * @param {类型(直线型,十字路口型或横向形} type 
     * @param {冰道的编号(用于判断生成的坐标位置),传入getRoadPosition用} roadNum 
     * @param {y点坐标,传入getRoadPosition用} posy 
     */
    createRoad(type, roadNum, posy) {
        if (type == 'vertical') {
            var i = (roadNum % 2 == 0) ? 1 : -1
            var newRoad = cc.instantiate(this.roadPrefab);
            this.road.addChild(newRoad);
            newRoad.setPosition(cc.v2(i * 50, posy));
        } else if (type == 'transverse') {

        } else if (type == 'transverse') {

        } else {
            cc.log("type error")
        }
    },

    /**
     * 冰道移动
     * @param {速度} speed 
     */
    roadMove(speed){
        this.road.y -= speed;
        //if (this.road.y <= this.far_bg[0].height){
          //  this.road.y = 0;
        //}
    },
});
