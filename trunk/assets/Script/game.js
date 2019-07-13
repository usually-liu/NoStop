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

        //玩家节点数据,用于碰撞判断及当前的坐标判断
        player: {
            default: null,
            type: cc.Node,
        },

        button: {
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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.resume()
        this.diff = 0;//初始化游戏的经过地图数量,用于划分难度
        this.dis = 0;//初始化移动的距离,用于判断道路生成及其他内容
        this.playerScript = this.player.getComponent("player");
        //初始化当前旋转角度,用于设置敌人的移动方向
        this.rot = this.enemy.getRotation();
        //将节点对象赋予玩家类
        this.playerScript.game = this;
        this.playerScript.enemy = this.enemy;
        this.playerScript.road = this.road;
        //初始化默认的得分数据
        this.score = 0;
        this.scoreTime = 0;//获取得分的计数
        //开始优先前初始化所有动作
        this.buttonRestart.active = false;
    },

    onDestroy() {

    },

    start() {
        //生成初始冰道
        this.createRoad('vertical', this.roadNum, true);
        this.createNewRoad();
        this.createEnemy();
        //this.createRoad('vertical', this.roadNum, false)
        //生成初始冰道  
        //this.createRoad('cross', this.roadNum, false)
        //每间隔一定时间进行地图刷新
        //this.scheduleUpdateForTarget()
    },

    update(dt) {

        //this.bgMove(this.far_bg, dt);
        var movedis = this.playerScript.playerSpeed * dt;
        this.dis += movedis;
        if (this.dis >= this.player.height) {
            this.diff += 1;
            this.createNewRoad();
            if (this.diff % 25 == 0)
                this.createCross();
            if (this.diff % 20 == 0)
                this.createEnemy();
            this.dis = 0;;
        }
        // if (this.cross.active == true) {
        this.cross.y -= movedis;
        // if (this.cross.y <= -960)
        //     this.cross.active = false
        // }

    },

    /**
     * 创建新道路
     */
    createNewRoad() {

        var nodeW = this.roadPrefab.data.width;
        var nodeH = this.roadPrefab.data.height;
        for (var i = 1; i <= this.roadNum; i++) {
            var posx = i % 2 == 0 ? -1 * ((i - 1) / 2) * nodeW - (0.5 * nodeW) : (i / 2) * nodeW - (0.5 * nodeW);
            var posy = cc.winSize.height / 2 + nodeH / 2 + 160;
            var newRoad = cc.instantiate(this.roadPrefab);
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
        this.cross.setPosition(cc.v2(0, 960));
    },

    /**
     * 底图移动
     * @param {屏幕底图列表} bgList 
     * @param {刷新时间} dt 
     */
    bgMove(bgList = this.far_bg, dt) {

        var movedis = this.playerScript.playerSpeed * dt;
        this.dis += movedis
        if (this.dis > cc.winSize.height) {
            this.diff += 1;
            if (this.diff % 5 == 0) {
                var numArray = [3, 5]
                this.roadNum = numArray[Math.floor((Math.random() * 2))];
            }
            this.createRoad('vertical', this.roadNum, false)//根据难度生成新的冰道
            this.dis = 0;
        }

        //每次循环二张图片一起滚动
        // for (let index = 0; index < bgList.length; index++) {

        //     bgList[index].y -= dis;

        //     if (bgList[index].y < -1 * bgList[index].height) {
        //         bgList[index].y = 960 - dis;//离开场景后将此背景图的y重新赋值，位于场景的上方
        //         this.diff += 1;
        //         if (this.diff % 5 == 0) {
        //             var numArray = [3, 5]
        //             this.roadNum = numArray[Math.floor((Math.random() * 2))];
        //         }
        //         this.createRoad('vertical', this.roadNum, false)//根据难度生成新的冰道
        //         if (this.diff % 2 == 0) {
        //             this.createEnemy()//根据难度生成敌人
        //         }
        //     }

        // }

        //根据地图移动的距离加分
        this.scoreTime += this.playerScript.playerSpeed * dt;
        if (this.scoreTime >= this.player.height * 2) {
            this.gainScore(1);
            this.scoreTime = 0;
        }

    },

    /**
     * 生成冰道
     * @param {类型(直线型,十字路口型} type 
     * @param {冰道的数量(用于判断生成几列冰道)} roadNum
     * @param {是否创建在地图中} b_isFirst
     */
    createRoad(type, roadNum, b_isFirst) {
        if (type != 'vertical' && type != 'cross') {
            cc.log('type error');
            return
        }

        //cc.log("create road")

        var nodeW = this.roadPrefab.data.width;
        var nodeH = this.roadPrefab.data.height;
        //纵向车道
        if (type == 'vertical') {
            var roadIndex = cc.winSize.height / nodeH;
            for (var i = 1; i <= roadNum; i++) {
                for (var j = 1; j <= roadIndex; j++) {
                    var posx = i % 2 == 0 ? -1 * ((i - 1) / 2) * nodeW - (0.5 * nodeW) : (i / 2) * nodeW - (0.5 * nodeW);
                    var posy = j % 2 == 0 ? -1 * ((j - 2) / 2) * nodeH : (j / 2 - 0.5) * nodeH;
                    // if (b_isFirst == false) {
                    //     posy += this.far_bg[0].height;
                    // }
                    posy += 240
                    var newRoad = cc.instantiate(this.roadPrefab);
                    newRoad.getComponent('road').game = this;
                    this.road.addChild(newRoad);
                    newRoad.setPosition(cc.v2(posx, posy));
                }
            }

        }
        //十字路口
        else if (type == 'cross') {
            //创建移动用子节点

            //创建旋转用子节点

            //创建预设在旋转用子节点上
            var roadIndex = cc.winSize.height / nodeH;
            //绘制纵向道路
            for (var i = 1; i <= roadNum; i++) {
                for (var j = 1; j <= roadIndex + 1; j++) {
                    var posx = i % 2 == 0 ? -1 * ((i - 1) / 2) * nodeW - (0.5 * nodeW) : (i / 2) * nodeW - (0.5 * nodeW);
                    var posy = j % 2 == 0 ? -1 * (j / 2) * nodeH : (j / 2 - 0.5) * nodeH;
                    if (b_isFirst == false) {
                        posy += this.far_bg[0].height;
                    }
                    var newRoad = cc.instantiate(this.roadPrefab);
                    newRoad.getComponent('road').game = this;
                    this.road.addChild(newRoad);
                    newRoad.setPosition(cc.v2(posx, posy));
                }
            }
            //绘制横向道路
            for (var k = roadNum + 1; k <= roadIndex + 1; k++) {
                for (var l = 1; l <= roadNum; l++) {
                    var posx = k % 2 == 0 ? -1 * ((k - 1) / 2) * nodeW - (0.5 * nodeW) : (k / 2) * nodeW - (0.5 * nodeW);
                    var posy = l % 2 == 0 ? -1 * (l / 2) * nodeH : (l / 2 - 0.5) * nodeH;
                    if (b_isFirst == false) {
                        posy += this.far_bg[0].height;
                    }
                    var newRoad = cc.instantiate(this.roadPrefab);
                    newRoad.getComponent('road').game = this;
                    this.road.addChild(newRoad);
                    newRoad.setPosition(cc.v2(posx, posy));
                }
            }
        }
    },

    /**
     * 生成敌人(NPC) 
     */
    createEnemy() {
        //cc.log("create enemy")

        var nodeW = this.roadPrefab.data.width;
        // var Index = Math.floor((Math.random() * this.roadNum));
        var Index = 0
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
     * 添加得分
     * @param {添加的分数} score 
     */
    gainScore(score = 0) {
        this.score += score;
        this.scoreLabel.string = "score:" + this.score;
    },

    /**
     * 游戏结束
     */
    gameOver() {
        cc.log("game Over")
        cc.director.pause()
        this.buttonRestart.active = true
    },

    /**
     * 重新开始
     */
    restartGame() {
        cc.log("restart")
        cc.director.loadScene(this.scene)
    },

});
