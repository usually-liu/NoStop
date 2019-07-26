cc.Class({
    extends: cc.Component,

    properties: {
        playerSpeed: {
            default: 1,
            tooltip: "玩家的初始速度",
        },
        playerMaxSpeed: {
            default: 5,
            tooltip: "玩家的最大速度",
        },
        accel: {
            default: 300,
            tooltip: "速度增量",
        },
        moveTime: {
            default: 1,
            tooltip: "玩家切换冰道所需要的时间"
        },
        effectTime: {
            default: 0,
            tooltip: "物品特效持续时间"
        },
        speedButton: {
            default: null,
            type: cc.Button,
            tooltip: "减速按钮",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //玩家基础数据初始化
        this.curRoad = 0; //玩家所处的初始道路
        this.b_isAccel = true;//游戏一开始就是加速状态
        this.b_isTurn = false;//玩家是否已经拐弯
        //物品相关的数据初始化
        this.saveAccel = this.accel;//保存加速度,用户物品减速后的恢复
        this.b_canTurn = true;//能否拐弯/变换车道
        this.b_canSpeedDown = true;//能否进行减速
        //初始化按钮的点击事件
        this.speedButton.node.on(cc.Node.EventType.TOUCH_START, this.setSpeedDown, this);
    },

    onDestroy() {
        this.speedButton.node.off(cc.Node.EventType.TOUCH_START, this.setSpeedDown, this);
    },

    start() {
        let anim = this.getComponent(cc.Animation);
        let animState = anim.play('player Move');
        animState.wrapMode = cc.WrapMode.Loop;
    },

    update(dt) {
        if (this.effectTime > 0) {
            this.effectTime -= dt
            if (this.effectTime <= 0) {

                this.effectTime = 0;
            }
        }

        if (this.b_isAccel == false) {
            //点击减速按钮时设置减速状态
            this.playerSpeed -= this.accel * dt
            //当速度为0时结束游戏
            if (this.playerSpeed <= 0) {
                this.game.gameOver();
            }
        }
        else {
            //未点击时自动加速
            this.playerSpeed += this.accel * dt
            if (this.playerSpeed > this.playerMaxSpeed) {
                this.playerSpeed = this.playerMaxSpeed
            }
        }
    },

    /**
    * 当碰到物品时的逻辑处理
    * 根据物品id决定对应的逻辑
    * 主动物品会加到物品栏中
    * 被动物品则直接使用
    */
    onPickGoods(goodsId) {
        cc.log("pick item")
        switch (goodsId) {
            case 1: //一桶鱼:使用后可以立刻变更下一个路口的鲸鱼状态
                break;
            case 2: //弹簧:使用后可以越过前方的障碍物,包括风,鲸鱼,动物等
                break;
            case 3: //加速装置:使用后可以将速度加至最大
                break;
            case 4: //紧急停车:使用后可以将速度降低为0,切不会因为速度为0导致游戏失败
                break;
            case 5: //章鱼:碰撞后5秒内无法加速
                this.effectTime = 5;
                this.accel = 0;
                break;
            case 6: //一坨墨汁:碰撞后5秒内无法减速
                this.effectTime = 5;
                this.b_canSpeedDown = false;
                break;
            case 7: //大马哈鱼:碰撞后下一个路口的鲸鱼立刻变更
                break;
            case 8: //冰冻的鱼:碰撞后2秒内玩家无法变更车道
                this.effectTime = 2;
                this.b_canTurn = false;
                break;
            case 9: //乌鸦:碰撞后会随机拿走玩家的一个主动要素
                break;
            default:
                break;
        }
    },

    //左转
    leftMove() {
        cc.log("left move")
        //判断是拐弯还是变换车道
        if (this.game.cross.y - this.node.y < 480 && this.game.cross.y - this.node.y > 0 && this.game.crossFather.x > this.node.x) {
            if (this.b_isTurn == false) {
                var leftTurn = cc.rotateBy(this.moveTime, 90)
                this.game.crossRotation.runAction(leftTurn)
                var enemyTrun = cc.rotateBy(this.moveTime, 90)
                this.enemy.runAction(enemyTrun);
                this.game.rot += 90
                this.b_isTurn = true;
            }
            // cc.log("rotation = " + this.game.rot)
        }
        else {
            if (this.curRoad > -1) {
                var movedis = 300
                var pointmove = cc.moveBy(this.moveTime, cc.v2(movedis, 0));
                this.point.runAction(pointmove);
                var roadmove = cc.moveBy(this.moveTime, cc.v2(movedis, 0));
                this.road.runAction(roadmove);
                var enemymove = cc.moveBy(this.moveTime, cc.v2(movedis, 0));
                this.enemy.runAction(enemymove);
                var crossmove = cc.moveBy(this.moveTime, cc.v2(movedis, 0));
                this.game.crossFather.runAction(crossmove);
                this.curRoad -= 1
            }

        }
    },

    //右转
    rightMove() {
        cc.log("right")
        //判断是拐弯还是变换车道
        if (this.game.cross.y - this.node.y < 480 && this.game.cross.y - this.node.y > 0 && this.game.crossFather.x < this.node.x) {
            if (this.b_isTurn == false) {
                var rightTurn = cc.rotateBy(this.moveTime, -90);
                this.game.crossRotation.runAction(rightTurn);
                var enemyTrun = cc.rotateBy(this.moveTime, -90);
                this.enemy.runAction(enemyTrun);
                this.game.rot -= 90;
                this.b_isTurn = true;
            }
            // cc.log("rotation = " + this.game.rot)
        }
        else {
            if (this.curRoad < 1) {
                var movedis = -300
                var pointmove = cc.moveBy(this.moveTime, cc.v2(movedis, 0));
                this.point.runAction(pointmove);
                var roadmove = cc.moveBy(this.moveTime, cc.v2(movedis, 0));
                this.road.runAction(roadmove);
                var enemymove = cc.moveBy(this.moveTime, cc.v2(movedis, 0));
                this.enemy.runAction(enemymove);
                var crossmove = cc.moveBy(this.moveTime, cc.v2(movedis, 0));
                this.game.crossFather.runAction(crossmove);
                this.curRoad += 1;
            }
        }
    },

    /**
     * 设定减速
     */
    setSpeedDown(event) {
        cc.log("set speedDown")
        this.b_isAccel = false;//点击按钮后变为减速状态
    },

    //减速
    speedDown(event) {
        cc.log("seppd up")
        this.b_isAccel = true;
        //this.playerSpeed -= 1;
    },

    /**
     * 重置拐弯状态
     */
    resetTurnState() {
        this.b_isTurn = false;
    },

    /**
     * 重置玩家状态
     */
    resetPlayerState() {
        let anim = this.getComponent(cc.Animation);
        let animState = anim.play('player Move');
        animState.wrapMode = cc.WrapMode.Loop;
    },

});
