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
        snowLPrefab: {
            default: null,
            type: cc.Prefab,
        },
        snowRPrefab: {
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
        //预设参数
        enemyPrefabArray: {
            default: [],
            type: cc.Prefab,
            tooltip: "敌人的预设",
        },
        tipsPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "提示牌预设"
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
        goodPrefabArray: {
            default: [],
            type: cc.Prefab,
            tooltip: "道具的预设",
        },
        supportNode: {
            default: null,
            type: cc.Node,
            tooltip: "支援动物节点",
        },
        supportAniArray: {
            default: [],
            type: cc.Prefab,
            tooltip: "支援动物的预设",
        },
        trafficNode: {
            default: null,
            type: cc.Node,
            tooltip: "红绿灯(鲸鱼)的节点",
        },
        trafficPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "红绿灯(鲸鱼)的预设",
        },
        windPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "大风的预设",
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

        //按钮相关
        buttonRestart: {
            default: null,
            type: cc.Node,
            tooltip: "重玩按钮"
        },

        buttonResume: {
            default: null,
            type: cc.Node,
            tooltip: "继续的按钮"
        },

        buttonRanking: {
            default: null,
            type: cc.Node,
            tooltip: "排行榜按钮",
        },

        roadNum: {
            default: 3,
            tooltip: "初始的冰道数量",
        },
        //lable部分的内容,用于添加玩家分数及玩家的速度
        numArray: {
            default: [],
            tooltip: "数字资源组",
            type: cc.SpriteFrame,
        },
        scoreArray: {
            default: [],
            tooltip: "玩家的分数",
            type: cc.Sprite,
        },
        speedT: {
            default: null,
            tooltip: "速度十位",
            type: cc.Sprite,
        },
        speed: {
            default: null,
            tooltip: "速度个位",
            type: cc.Sprite,
        },
        //提示界面节点,用于显示界面是否显示提示内容
        tipsNode: {
            default: null,
            tooltip: "提示节点",
            type: cc.Node,
        },
        //游戏准备界面,用于展现倒数及游戏的教程界面
        readyNode: {
            default: null,
            tooltip: "准备及提示用节点",
            type: cc.Node,
        },
        //新手引导相关
        guideNode: {
            default: null,
            tooltip: "新手引导节点",
            type: cc.Node,
        },
        //黑色底板,用于显示各种效果
        blackBoard: {
            default: null,
            tooltip: "黑色底板",
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //初始化游戏状态
        // cc.director.resume()
        this.b_isGameOver = false;
        this.b_isGameStart = false;
        // this.b_isGuide = false;//判断玩家是否处于新手引导状态
        let guide = cc.sys.localStorage.getItem("isGuide");
        this.b_isGuide = guide == '0' ? false : true;
        cc.log(this.b_isGuide);
        //初始化对象池
        this.initPool();
        this.diff = 0;//初始化游戏的经过地图数量,用于划分难度
        this.dis = 0;//初始化移动的距离,用于判断道路生成及其他内容
        this.snowdis = 0;//初始化不可移动区域的距离,用于生成道路边界
        //将节点对象赋予玩家类
        this.playerScript = this.player.getComponent("player");
        this.playerScript.game = this;
        this.playerScript.enemy = this.enemy;
        this.playerScript.road = this.road;
        this.playerScript.point = this.point;
        //赋予节点对象类
        this.readyScript = this.readyNode.getComponent('ready');
        this.readyScript.game = this;
        //赋予新手引导对象类
        this.guideScript = this.guideNode.getComponent('guide');
        this.guideScript.game = this;
        //初始化当前旋转角度,用于设置敌人的移动方向
        this.rot = -this.enemy.angle;
        //支援动物相关参数
        this.supportIndex = 0;//当前添加的支援动物节点位置
        //初始化默认的得分数据
        this.score = 0;
        this.scoreTime = 0;//获取得分的计数
        //开始游戏前初始化所有动作
        this.buttonRestart.active = false;
        this.buttonRanking.active = false;
    },

    onDestroy() {
        //切换场景时清除对象池
        this.clearPool();
    },

    start() {
        //生成初始冰道
        this.createRoad();
        this.createNewRoad();
        // this.createScorePoint();
        // this.createGoods();
        // this.createCross()
        // this.createItemPoint()
        // this.createEnemy();
        // this.createTraffic();
        // this.createWind();
        //播放倒数动画
        this.readyScript.playGameReady();
    },

    update(dt) {

        if (this.b_isGameOver == true || this.b_isGameStart == false) {
            return;
        }

        var movedis = this.playerScript.playerSpeed * dt;
        this.dis += movedis;
        if (this.dis >= this.roadPrefab.data.height - movedis) {
            this.diff += 1;
            this.createNewRoad();

            if (this.b_isGuide == true) {
                if (this.diff == 5) {
                    this.createCross();
                    this.guideScript.setGuide(0);
                }
                else if (this.diff == 15) {
                    // this.createTips();
                    this.guideScript.setGuide(1);
                }
                else if (this.diff == 25) {
                    this.createTraffic();
                }
                else if (this.diff == 35) {
                    this.createGuideGoods(4);
                    this.guideScript.setGuide(2);
                }
                else if (this.diff == 45) {
                    this.createGuideGoods(2);
                    this.guideScript.setGuide(3);
                }
                else if (this.diff == 55) {
                    this.createItemPoint();
                    this.guideScript.setGuide(4);
                    cc.sys.localStorage.setItem("isGuide", 0);
                    this.b_isGuide = false;
                }
            } else {
                if (this.diff % 150 == 0)
                    this.createItemPoint();
                else if (this.diff % 60 == 0)
                    this.createGoods();
                else if (this.diff % 50 == 0)
                    this.createScorePoint();
                else if (this.diff % 30 == 0) {
                    this.createTips(false);
                }
                else if (this.diff % 10 == 0) {
                    // this.createTips(true)
                    this.createGoods();
                }
            }

            this.dis = 0;
        }
        this.snowdis += movedis;
        if (this.snowdis >= this.snowLPrefab.data.height - movedis) {
            this.createNewSnow();
            this.snowdis = 0;
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
        for (let i = 0; i < initCount; i++) {
            let newroad = cc.instantiate(this.roadPrefab);
            this.roadPool.put(newroad);
        }
        //初始化禁行区域对象池
        this.snowLPool = new cc.NodePool();
        this.snowRPool = new cc.NodePool();
        let initSnowCount = ((Math.floor(cc.winSize.height) / this.snowLPrefab.data.height + 2) * this.roadNum)
        for (let i = 0; i < initSnowCount; i++) {
            let newSnowL = cc.instantiate(this.snowLPrefab);
            let newSnowR = cc.instantiate(this.snowRPrefab);
            this.snowLPool.put(newSnowL);
            this.snowRPool.put(newSnowR);
        }
        //初始化敌人用对象池
        this.enemyPool = new cc.NodePool();
        let initEnemyCount = 10; //敌人暂时先创建10个
        for (let i = 0; i < initEnemyCount; i++) {
            let index = i % 3
            let newEnemy = cc.instantiate(this.enemyPrefabArray[index]);
            this.enemyPool.put(newEnemy);
        }
        //初始化提示牌对象池
        this.tipsPool = new cc.NodePool();
        let tipsCount = 10; //初始化敌人创建5个
        for (let i = 0; i < tipsCount; i++) {
            let newTips = cc.instantiate(this.tipsPrefab);
            this.tipsPool.put(newTips);
        }
        //初始化道具用对象池
        this.goodsPool = new cc.NodePool();
        let initGoodsCount = 9 //一共有9种道具
        for (let i = 0; i < initGoodsCount; i++) {
            let newGoods = cc.instantiate(this.goodPrefabArray[i]);
            this.goodsPool.put(newGoods);
        }
    },

    /**
     * 清除对象池
     */
    clearPool() {

        this.roadPool.clear();
        this.snowLPool.clear();
        this.snowRPool.clear();
        this.enemyPool.clear();
        this.goodsPool.clear();

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
        this.crossRotation.angle = 0;
        this.cross.setPosition(cc.v2(0, 3348));
        this.playerScript.resetTurnState();
    },

    /**
     * 生成冰道
     */
    createRoad() {
        //cc.log("create road")
        //创建冰道部分
        let nodeW = 300;
        let nodeH = this.roadPrefab.data.height;
        let roadIndex = Math.floor(cc.winSize.height) / nodeH;
        for (let i = 1; i <= this.roadNum; i++) {
            for (let j = 0; j < roadIndex; j++) {
                let posx = i % 2 == 0 ? -1 * ((i - 1) / 2) * nodeW - (0.5 * nodeW) : (i / 2) * nodeW - (0.5 * nodeW);
                let posy = j * nodeH
                let newRoad = null;
                if (this.roadPool.size() > 0) {
                    // cc.log("get road")
                    newRoad = this.roadPool.get();
                }
                else {
                    newRoad = cc.instantiate(this.roadPrefab);
                }
                newRoad.parent = this.road
                newRoad.getComponent('road').game = this;
                newRoad.getComponent('road').init(1);
                newRoad.setPosition(cc.v2(posx, posy));
            }
        }
        //创建雪堆
        //创建左侧雪堆
        let nodeSnowW = 525;
        let nodeSnowH = this.snowLPrefab.data.height;
        let snowIndex = Math.floor(cc.winSize.height) / nodeSnowH;
        for (let j = 1; j <= snowIndex; j++) {
            let posxl = -1 * nodeSnowW;
            let posy = j * nodeSnowH;
            let newSnowL = null;
            if (this.snowLPool.size() > 0) {
                newSnowL = this.snowLPool.get();
            }
            else {
                newSnowL = cc.instantiate(this.snowLPrefab);
            }
            newSnowL.parent = this.road
            newSnowL.getComponent('road').game = this;
            newSnowL.getComponent('road').init(2);
            newSnowL.setPosition(cc.v2(posxl, posy));
        }
        //创建右侧雪堆
        for (let j = 1; j <= snowIndex; j++) {
            let posxr = nodeSnowW;
            let posy = j * nodeSnowH;
            let newSnowR = null;
            if (this.snowRPool.size() > 0) {
                newSnowR = this.snowRPool.get();
            }
            else {
                newSnowR = cc.instantiate(this.snowRPrefab);
            }
            newSnowR.parent = this.road
            newSnowR.getComponent('road').game = this;
            newSnowR.getComponent('road').init(3);
            newSnowR.setPosition(cc.v2(posxr, posy));
        }
    },

    /**
     * 创建新道路
     */
    createNewRoad() {

        let nodeW = 300;
        let index = Math.floor(cc.winSize.height) / this.roadPrefab.data.height;
        for (let i = 1; i <= this.roadNum; i++) {
            let posx = i % 2 == 0 ? -1 * ((i - 1) / 2) * nodeW - (0.5 * nodeW) : (i / 2) * nodeW - (0.5 * nodeW);
            let posy = index * this.roadPrefab.data.height - 3;
            let newRoad = null
            if (this.roadPool.size() > 0) {
                newRoad = this.roadPool.get();
            }
            else {
                newRoad = cc.instantiate(this.roadPrefab);
            }
            newRoad.parent = this.road
            newRoad.getComponent('road').game = this;
            newRoad.getComponent('road').init(1);
            newRoad.setPosition(cc.v2(posx, posy));
        }
    },

    /**
     * 创建道路边界
     */
    createNewSnow() {

        let index = Math.floor(cc.winSize.height) / this.snowLPrefab.data.height;
        let posxl = -525
        let posxr = 525;
        let posy = index * this.snowLPrefab.data.height - 3
        //创建左侧雪堆
        let newSnowL = null;
        if (this.snowLPool.size() > 0) {
            newSnowL = this.snowLPool.get();
        }
        else {
            newSnowL = cc.instantiate(this.snowLPrefab);
        }
        newSnowL.parent = this.road
        newSnowL.getComponent('road').game = this;
        newSnowL.getComponent('road').init(2);
        newSnowL.setPosition(cc.v2(posxl, posy));
        //创建右侧雪堆
        let newSnowR = null;
        if (this.snowRPool.size > 0) {
            newSnowR = this.snowRPool.get();
        }
        else {
            newSnowR = cc.instantiate(this.snowRPrefab);
        }
        newSnowR.parent = this.road
        newSnowR.getComponent('road').game = this;
        newSnowR.getComponent('road').init(3);
        newSnowR.setPosition(cc.v2(posxr, posy));

    },
    /**
     * 生成对应的提示
     * @param {是否创建敌人} b_isEnemy 
     */
    createTips(b_isEnemy) {

        cc.log("create tips")
        var nodeW = 300;
        var dis = 900;
        var Index = Math.floor((Math.random() * this.roadNum));
        if (b_isEnemy == false) {
            Index = 0;
        }
        var rot = -1 * this.enemy.angle * Math.PI / 180;
        // cc.log(Index)
        //创建提示板
        // let tipsX = Index % 2 == 0 ? -1 * ((Index - 1) / 2 - 0.5) * nodeW : (Index / 2 - 0.5) * nodeW
        // let tipsX = Index % 2 == 0 ? (Index - 1) * nodeW : nodeW
        // let tipsX = Index == 0 ? 0 : Index == 1 ? nodeW : -1 * nodeW
        // let tipsY = 900
        let tipsX = Math.sin(rot) == 0 ? Index == 0 ? 0 : Index == 1 ? nodeW : -1 * nodeW : -1 * Math.sin(rot) * dis
        let tipsY = Math.cos(rot) == 0 ? Index == 0 ? 0 : Index == 1 ? nodeW : -1 * nodeW : Math.cos(rot) * dis
        let newTips = null;
        if (this.tipsPool.size() > 0) {
            newTips = this.tipsPool.get();
        }
        else {
            newTips = cc.instantiate(this.tipsPrefab);
        }
        newTips.parent = this.enemy;
        newTips.getComponent('tips').game = this;
        newTips.getComponent('tips').init(b_isEnemy);
        newTips.getComponent('tips').playBlink(Index);
        newTips.setPosition(cc.v2(tipsX, tipsY));

    },

    /**
     * 生成敌人(NPC) 
     * @param {敌人的标记位置} Index 
     */
    createEnemy(Index) {
        //cc.log("create enemy", Index)

        var nodeW = 300;
        //var Index = 0
        var posx = 0;
        var posy = 0;
        var dis = 1920;
        var rot = -1 * this.enemy.angle * Math.PI / 180;
        posx = Math.sin(rot) == 0 ? Index == 0 ? 0 : Index == 1 ? nodeW : -1 * nodeW : -1 * Math.sin(rot) * dis
        posy = Math.cos(rot) == 0 ? Index == 0 ? 0 : Index == 1 ? nodeW : -1 * nodeW : Math.cos(rot) * dis
        //cc.log(posx, posy);

        //创建敌人
        let newEnemy = null;
        if (this.enemyPool.size() > 0) {
            cc.log("get enemy")
            newEnemy = this.enemyPool.get();
        }
        else {
            newEnemy = cc.instantiate(this.enemyPrefabArray[2]);
        }
        newEnemy.parent = this.enemy;
        newEnemy.getComponent('enemy').game = this;
        newEnemy.getComponent('enemy').init();
        newEnemy.setPosition(cc.v2(posx, posy));

    },

    /**
     * 生成道具
     */

    createGoods() {
        //cc.log("create goods")

        let nodeW = 300;
        let Index = Math.floor((Math.random() * this.roadNum)) + 1;
        for (let i = 1; i <= Index; i++) {
            let posx = i % 2 == 0 ? -1 * ((i - 1) / 2) * nodeW - (0.5 * nodeW) : (i / 2) * nodeW - (0.5 * nodeW);
            let posy = Math.floor(cc.winSize.height);
            let newGoods = null
            if (this.goodsPool.size > 0) {
                newGoods = this.goodsPool.get();
            }
            else {
                let goodsId = Math.floor((Math.random() * this.goodPrefabArray.length))
                newGoods = cc.instantiate(this.goodPrefabArray[goodsId]);
            }
            newGoods.parent = this.road
            newGoods.getComponent('goods').game = this;
            newGoods.setPosition(cc.v2(posx, posy));
        }

    },

    /**
     * 生成新手引导用道具
     * @param {道具ID} index 
     */
    createGuideGoods(goodsId) {

        if (goodsId == null)
            return

        let posx = 0;
        let posy = Math.floor(cc.winSize.height);
        let newGoods = cc.instantiate(this.goodPrefabArray[goodsId]);
        newGoods.parent = this.road
        newGoods.getComponent('goods').game = this;
        newGoods.setPosition(cc.v2(posx, posy));

    },

    /**
     * 创建得分点
     */
    createScorePoint() {
        var posx = 0;
        var posy = 1920;
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
        var posy = 1920;
        var newItem = cc.instantiate(this.itemPrefab);
        newItem.getComponent('ItemPoint').game = this;
        this.point.addChild(newItem);
        newItem.setPosition(cc.v2(posx, posy))
    },

    /**
     * 创建鲸鱼(红绿灯)
     */
    createTraffic() {
        var posx = 0;
        var posy = 1920;
        var newItem = cc.instantiate(this.trafficPrefab);
        newItem.getComponent('traffic').game = this;
        this.trafficNode.addChild(newItem);
        newItem.setPosition(cc.v2(posx, posy))
    },

    /**
     * 创建大风
     */
    createWind() {
        var posx = 0;
        var posy = 1600;
        var newWind = cc.instantiate(this.windPrefab);
        newWind.getComponent('wind').game = this;
        this.supportNode.addChild(newWind);
        newWind.setPosition(cc.v2(posx, posy))
    },

    /**
     * 添加支援动物
     */
    addSupportAni() {
        if (this.supportIndex >= this.supportAniArray.length) {
            return;
        }
        var posx = this.supportIndex % 2 == 0 ? -850 : 850;
        var posy = 60 + this.supportIndex % 2 == 0 ? this.supportIndex / 2 * 400 : (this.supportIndex - 1) / 2 * 400;
        var newSupport = cc.instantiate(this.supportAniArray[this.supportIndex]);
        newSupport.getComponent('support').game = this;
        this.supportNode.addChild(newSupport);
        newSupport.setPosition(cc.v2(posx, posy))

        this.supportIndex++;
    },

    /**
     * 更改交通状态
     */
    changeTrafficState() {
        cc.log("change traffic state")
        if (this.trafficNode.children[0]) {
            this.trafficNode.children[0].getComponent('traffic').onUseItem();
        }
    },

    /**
     * 添加得分
     * @param {添加的分数} score 
     */
    gainScore(score = 0) {
        this.score += score;
        // this.scoreLabel.string = this.score + "/m";
        let val = this.score
        let count = 0;
        while (val) {
            if (val < 1) {
                return;
            }

            let temp = Math.floor(val % 10)
            // if (temp < 10) {
            //     temp = val
            // }
            // cc.log(count, temp);
            this.scoreArray[count].spriteFrame = this.numArray[temp];

            val = val / 10;

            count++;
        }
    },

    /**
     * 更新速度值
     */
    updateSpeed() {
        let speed = Math.floor(99 * (this.playerScript.playerSpeed / this.playerScript.playerMaxSpeed));
        let speedTnum = Math.floor(speed / 10);
        let speedNnum = speed % 10;
        // cc.log("speedTnum", speedTnum)
        // cc.log("speedTnum", speedNnum)
        this.speedT.spriteFrame = this.numArray[speedTnum]
        this.speed.spriteFrame = this.numArray[speedNnum]
    },

    /**
     * 暂停游戏
     */
    pauseGame() {
        cc.log("game pause")
        this.b_isGameStart = false;
        let action = cc.fadeTo(0.3, 120);
        let fun = cc.callFunc(function () {
            this.buttonResume.active = true;
            cc.director.pause();
        }, this)
        let seq = cc.sequence(action, fun);
        this.blackBoard.runAction(seq);
    },

    /**
     * 重开游戏
     */

    gameResume() {
        cc.log("game resume")
        cc.director.resume();
        this.buttonResume.active = false;
        let action = cc.fadeTo(0.3, 0);
        let fun = cc.callFunc(function () {
            this.readyScript.playGameReady();
        }, this)
        let seq = cc.sequence(action, fun);
        this.blackBoard.runAction(seq);
    },

    /**
     * 游戏结束
     */
    gameOver() {
        if (this.playerScript.b_IsInvincible == true) {
            return;
        }
        cc.log("game Over")
        this.b_isGameOver = true;
        //上传玩家数据
        let score = this.score.toString();
        wx.setUserCloudStorage({
            KVDataList: [{
                key: 'score',
                value: score,
            }],
            success: res => {
                console.log("setUserCloudStorage success");
            },
            fail: res => {
                console.log(res);
            },
        });
        //发送消息
        let openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            text: 'setUserCloudStorage',
        });
        // cc.director.pause();
        this.buttonRestart.active = true;
        this.buttonRanking.active = true;
    },

    /**
     * 重新开始
     */
    restartGame() {
        cc.log("restart")
        cc.director.loadScene(this.scene)
    },

    /**
     * 当开始动画播放完毕
     */
    onGameReadyComp() {
        this.readyNode.active = false;
        this.b_isGameStart = true;
    },
});
