cc.Class({
    extends: cc.Component,

    properties: {
        //当前场景
        scene: "game",

        //地图相关的数据
        far_bg: [cc.Node],  //用于管理背景图片结点的数组,记得回cocos面板中添加数组的结点数量

        //冰道相关设定
        //冰道的节点,用于放置新的冰道
        road: {
            default: null,
            type: cc.Node,
        },
        //冰道的预设
        roadPrefab: {
            default: null,
            type: cc.Prefab,
        },
        //十字路口用节点
        crossFather: {
            default: null,
            type: cc.Node,
            tooltip: "十字路口父节点",
        },
        cross: {
            default: null,
            type: cc.Node,
            tooltip: "十字路口"
        },
        crossRotation: {
            default: null,
            type: cc.Node,
            tooltip: "十字路口旋转用节点"
        },
        //NPC的节点,用于放置NPC
        enemy: {
            default: null,
            type: cc.Node,
        },
        //NPC的预设
        enemyPrefab: {
            default: null,
            type: cc.Prefab,
        },
        point: {
            default: null,
            type: cc.Node,
            tooltip: "得分点和考察站节点"
        },
        scorePrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "得分点预设"
        },
        itemPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "考察站预设"
        },
        //玩家节点数据,用于碰撞判断及当前的坐标判断
        player: {
            default: null,
            type: cc.Node,
        },

        buttom: {
            default: null,
            type: cc.Node,
        },

        buttonRestart: {
            default: null,
            type: cc.Node,
        },

        roadNum: {
            default: 3,
            tooltip: "初始的冰道数量",
        },
        //lable部分的内容,用于添加玩家分数及玩家的速度
        scoreLabel: {
            default: null,
            tooltip: "玩家的分数",
            type: cc.Label,
        },
        speedLabel: {
            default: null,
            tooltip: "玩家的速度",
            type: cc.Label,
        },
        //提示界面,用于提示玩家是否抽奖
        tipsLable: {
            default: null,
            tooltip: "提示界面",
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.resume()
        //初始化对象池
        this.initPool();
        this.diff = 0;//初始化游戏的经过地图数量,用于划分难度
        this.dis = 0;//初始化移动的距离,用于判断道路生成及其他内容
        //将节点对象赋予玩家类
        this.playerScript = this.player.getComponent("player");
        this.playerScript.game = this;
        this.playerScript.enemy = this.enemy;
        this.playerScript.road = this.road;
        this.playerScript.point = this.point;
        //初始化当前旋转角度,用于设置敌人的移动方向
        this.rot = this.enemy.getRotation();
        //初始化默认的得分数据
        this.score = 0;
        this.scoreTime = 0;//获取得分的计数
        //开始游戏前初始化所有动作
        this.buttonRestart.active = false;
        //初始化道路的对象池

        //初始化敌人的对象池

        //初始化道具的对象池

    },

    onDestroy() {
        //切换场景时清除对象池
        this.clearPool();
    },

    start() {
        //生成初始冰道
        this.createRoad();
        this.createNewRoad();
        //this.createItemPoint()
        //this.createEnemy();
    },

    update(dt) {

        var movedis = this.playerScript.playerSpeed * dt;
        this.dis += movedis;
        if (this.dis >= this.player.height) {
            this.diff += 1;
            this.createNewRoad();
            if (this.diff % 150 == 0)
                this.createItemPoint();
            else if (this.diff % 50 == 0)
                this.createScorePoint();
            else if (this.diff % 40 == 0)
                this.createCross();
            else if (this.diff % 10 == 0)
                this.createEnemy();
            this.dis = 0;;
        }
        //根据地图移动的距离加分
        this.scoreTime += this.playerScript.playerSpeed * dt;
        if (this.scoreTime >= this.player.height * 2) {
            this.gainScore(1);
            this.scoreTime = 0;
        }
        this.updateSpeed()
        this.cross.y -= movedis;

    },

    /**
     * 初始化对象池
     */
    initPool() {
        //初始化道路用对象池
        this.roadPool = new cc.NodePool();
        let initCount = (Math.floor(cc.winSize.height) / this.roadPrefab.data.height + 2) * this.roadNum
        for (let i = 0;i<initCount;i++){
            let newroad = cc.instantiate(this.roadPrefab);
            this.roadPool.put(newroad);
        }
        //初始化敌人用对象池

        //初始化道具用对象池
    },

    /**
     * 创建新道路
     */
    createNewRoad() {

        let width = Math.floor(cc.winSize.height / 2)
        let nodeW = this.roadPrefab.data.width;
        let nodeH = this.roadPrefab.data.height;
        for (let i = 1; i <= this.roadNum; i++) {
            let posx = i % 2 == 0 ? -1 * ((i - 1) / 2) * nodeW - (0.5 * nodeW) : (i / 2) * nodeW - (0.5 * nodeW);
            let posy = width + nodeH / 2 + 160;
            let newRoad = cc.instantiate(this.roadPrefab);
            newRoad.getComponent('road').game = this;
            this.road.addChild(newRoad);
            newRoad.setPosition(cc.v2(posx, posy));
        }
    },

    /**
     * 创建十字路口
     */
    createCross() {
        // cc.log(this.cross.getNumberOfRunningActions())
        // if (this.cross.getNumberOfRunningActions() > 0) {
        //     return;
        // }
        //this.cross.active = true;
        this.crossRotation.setRotation(0);
        this.cross.setPosition(cc.v2(0, 960));
        this.playerScript.resetTurnState();
    },

    /**
     * 生成冰道
     */
    createRoad() {
        //cc.log("create road")
        let nodeW = this.roadPrefab.data.width;
        let nodeH = this.roadPrefab.data.height;
        let roadIndex = Math.floor(cc.winSize.height) / nodeH;
        for (let i = 1; i <= this.roadNum; i++) {
            for (let j = 0; j < roadIndex; j++) {
                let posx = i % 2 == 0 ? -1 * ((i - 1) / 2) * nodeW - (0.5 * nodeW) : (i / 2) * nodeW - (0.5 * nodeW);
                // let posy = j % 2 == 0 ? -1 * ((j - 2) / 2) * nodeH : (j / 2 - 0.5) * nodeH;
                let posy = j * nodeH
                let newRoad = null;
                if (this.roadPool.size > 0){
                    newRoad = this.roadPool.get();
                }
                else{
                    newRoad = cc.instantiate(this.roadPrefab);
                }
                newRoad.parent = this.road
                newRoad.getComponent('road').game = this;
                newRoad.setPosition(cc.v2(posx, posy));
            }
        }
    },

    /**
     * 生成敌人(NPC) 
     */
    createEnemy() {
        //cc.log("create enemy")

        var nodeW = this.roadPrefab.data.width;
        var Index = Math.floor((Math.random() * this.roadNum));
        //var Index = 0
        var posx = 0;
        var posy = 0;
        var rot = this.enemy.getRotation() * Math.PI / 180;
        posx = Math.sin(rot) == 0 ? Index % 2 == 0 ? -1 * ((Index - 1) / 2 - 0.5) * nodeW : (Index / 2 - 0.5) * nodeW : -1 * Math.sin(rot) * 720
        posy = Math.cos(rot) == 0 ? Index % 2 == 0 ? -1 * ((Index - 1) / 2 - 0.5) * nodeW : (Index / 2 - 0.5) * nodeW : Math.cos(rot) * 720
        cc.log(posx, posy);
        var newEnemy = cc.instantiate(this.enemyPrefab);
        newEnemy.getComponent('enemy').game = this;
        this.enemy.addChild(newEnemy);
        newEnemy.setPosition(cc.v2(posx, posy));
    },

    /**
     * 创建得分点
     */
    createScorePoint() {
        var posx = 0;
        var posy = 960;
        var newScore = cc.instantiate(this.scorePrefab);
        newScore.getComponent('scorePoint').game = this;
        this.point.addChild(newScore);
        newScore.setPosition(cc.v2(posx, posy))
    },

    /**
     * 创建考察站
     */
    createItemPoint() {
        var posx = 0;
        var posy = 960;
        var newItem = cc.instantiate(this.itemPrefab);
        newItem.getComponent('ItemPoint').game = this;
        this.point.addChild(newItem);
        newItem.setPosition(cc.v2(posx, posy))
    },

    /**
     * 回收对象池的对象
     * @param {道路节点} road 
     */
    onRoadKilled(road){
        this.roadPool.put(road);
    },

    /**
     * 添加得分
     * @param {添加的分数} score 
     */
    gainScore(score = 0) {
        return;
        this.score += score;
        this.scoreLabel.string = this.score + "/m";
    },

    /**
     * 更新速度值
     */
    updateSpeed() {
        return;
        var speed = Math.floor(99 * (this.playerScript.playerSpeed / this.playerScript.playerMaxSpeed));
        this.speedLabel.string = speed + "m/h"
    },

    /**
     * 游戏结束
     */
    gameOver() {
        cc.log("game Over")
        cc.director.pause();
        this.buttonRestart.active = true;
    },

    /**
     * 跳转到是否看广告界面
     */
    jumpTotips() {
        cc.log("open tips UI")
        cc.director.pause();
        this.tipsLable.active = true;
    },

    /**
     * 看广告界面选择是
     */
    setItem() {
        cc.log("set item yes")
        //选择看广告,调用广告接口

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
     * 重新开始
     */
    restartGame() {
        cc.log("restart")
        cc.director.loadScene(this.scene)
    },

});
