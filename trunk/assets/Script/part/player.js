cc.Class({
    extends: cc.Component,

    properties: {
        child: {
            default: null,
            type: cc.Node,
            tooltip: "子节点"
        },
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
        ItemNodeArray: {
            default: [],
            type: cc.Sprite,
            tooltip: "道具图片数组的节点",
        },
        ItemSpritArray: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "道具图片的数组"
        },
        explanNode: {
            default: null,
            type: cc.Sprite,
            tooltip: "说明图片节点"
        },
        explanArray: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "说明文字图片数组"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //玩家基础数据初始化
        this.curRoad = 0; //玩家所处的初始道路
        this.b_isAccel = true;//游戏一开始就是加速状态
        this.b_isTurn = false;//玩家是否已经拐弯
        this.b_IsInvincible = false;//玩家是否处于无敌状态(用于判断是否能碰撞)
        this.effectTime = 0;//玩家剩余的特效时间
        this.explanTime = 0;//玩家剩余的物品说明时间
        //物品相关的数据初始化
        this.haveGoods = [1, 2, 3];//初始化玩家所持有的物品列表
        this.saveGoodsId = 0;//玩家当前获得的物品ID,用于添加物品
        this.b_isAddGoods = false;
        //速度相关的数据初始化
        let speed = this.accel
        this.saveAccel = speed;//保存加速度,用户物品减速后的恢复
        this.b_canTurn = true;//能否拐弯/变换车道
        this.b_canSpeedDown = true;//能否进行减速
        //初始化按钮的点击事件
        this.speedButton.node.on(cc.Node.EventType.TOUCH_START, this.setSpeedDown, this);
    },

    onDestroy() {
        //销毁按钮点击事件
        this.speedButton.node.off(cc.Node.EventType.TOUCH_START, this.setSpeedDown, this);
    },

    start() {
        let anim = this.getComponent(cc.Animation);
        let animState = anim.play('player Move');
        animState.wrapMode = cc.WrapMode.Loop;
        this.child.active = false;
    },

    update(dt) {
        if (this.game.b_isGameOver == true || this.game.b_isGameStart == false) {
            return;
        }
        if (this.effectTime > 0) {
            this.effectTime -= dt
            if (this.effectTime <= 0) {
                this.effectTime = 0;
                this.resetPlayerState();
            }
        }

        if (this.explanTime > 0) {
            this.explanTime -= dt
            if (this.explanTime <= 0) {
                this.explanTime = 0;
                this.explanNode.active = false;
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
     * 重复播放动画
     * @param {anim名称} animation 
     */
    playAnimationLoop(animation) {
        let anim = this.getComponent(cc.Animation).play(animation);
        //let animState = anim;
        //animState.wrapMode = cc.WrapMode.Loop;
    },

    /**
     * 增加难度
     */
    diffUp() {

        if (this.playerMaxSpeed < 2000) {
            this.playerMaxSpeed += 200
        }

    },

    /**
    * 当碰到物品时的逻辑处理
    * 根据物品id决定对应的逻辑
    * 主动物品会加到物品栏中
    * 被动物品则直接使用
    */
    onPickGoods(goodsId) {
        if (this.b_IsInvincible == true) {
            return;
        }
        cc.log("pick item")
        //显示物品的说明文字
        this.explanTime = 3;
        this.explanNode.spriteFrame = this.explanArray[goodsId - 1];
        this.explanNode.active = true;
        //拾取的是主动要素
        if (goodsId > 0 && goodsId < 5) {
            this.addGoods(goodsId);
        }
        //拾取的是被动要素
        else {
            switch (goodsId) {
                case 5: //章鱼:碰撞后5秒内无法加速
                    this.effectTime = 5;
                    this.accel = 0;
                    this.child.active = true;
                    this.playAnimationLoop('player octopus')
                    break;
                case 6: //一坨墨汁:碰撞后5秒内无法减速
                    this.effectTime = 5;
                    this.b_canSpeedDown = false;
                    this.child.active = true;
                    this.playAnimationLoop('player ink')
                    break;
                case 7: //大马哈鱼:碰撞后下一个路口的鲸鱼立刻变更
                    this.game.changeTrafficState();
                    break;
                case 8: //冰冻的鱼:碰撞后2秒内玩家无法变更车道
                    this.effectTime = 5;
                    this.b_canTurn = false;
                    this.playAnimationLoop('player Ice')
                    break;
                case 9: //乌鸦:碰撞后会随机拿走玩家的一个主动要素
                    break;
                default:
                    break;
            }
        }
    },

    /**
     * 使用道具
     */
    onUseGoods() {

        if (this.game.b_isGameOver == true || this.game.b_isGameStart == false) {
            return;
        }

        //判断动画是否正在播放
        let anim = this.ItemNodeArray[0].getComponent(cc.Animation);
        let animState1 = anim.getAnimationState('ItemMoveBTN');
        let animState2 = anim.getAnimationState('ItemMoveNTB');
        if (animState1.isPlaying == true || animState2.isPlaying == true)
            return
        let goodsId = this.haveGoods[0];//获取玩家的第一个物品ID
        cc.log("use Goods", goodsId)
        //播放使用物品动画
        if (goodsId == null) {
            return;
        }

        //释放对应的物品效果
        switch (goodsId) {
            case 1: //一桶鱼:使用后可以立刻变更下一个路口的鲸鱼状态
                this.game.changeTrafficState();
                break;
            case 2: //弹簧:使用后可以越过前方的障碍物,包括风,鲸鱼,动物等

                let jump = cc.scaleTo(0.3, 1.5, 1.5)
                this.node.runAction(jump);
                this.effectTime = 2;
                this.b_IsInvincible = true;
                break;
            case 3: //加速装置:使用后可以将速度加至最大
                this.speed = this.playerMaxSpeed;
                break;
            case 4: //紧急停车:使用后可以将速度降低为0,切不会因为速度为0导致游戏失败
                this.playerSpeed = 0;
                break;
            default:
                cc.log("error")
                break;
        }
        //播放使用物品的动画
        anim.play('ItemMoveBTN');
        this.ItemNodeArray[1].getComponent(cc.Animation).play('ItemMoveSTB');
        this.ItemNodeArray[2].getComponent(cc.Animation).play('ItemMoveSTS');
        //移除最前面的物品
        this.haveGoods.shift();

    },

    /**
     * 当物品获取完成时
     */
    onAddGoodsComp() {
        cc.log("onAddGoodsComp", this.saveGoodsId)
        //添加物品到列表中
        this.haveGoods.push(this.saveGoodsId);
        //恢复拾取物品状态
        this.b_isAddGoods = false;
        //重置保存的物品ID
        this.saveGoodsId = 0;
    },

    /**
     * 当物品使用完成时
     */
    onUseGoodsComp() {
        cc.log("onUseGoodsComp");
        //重新绘制物品
        for (let i = 0; i < 3; i++) {
            if (this.haveGoods[i] == null) {
                this.ItemNodeArray[i].spriteFrame = null;
            }
            else {
                this.ItemNodeArray[i].spriteFrame = this.ItemSpritArray[this.haveGoods[i] - 1];
            }
        }
        //重新刷新物品图片
        this.ItemNodeArray[0].getComponent(cc.Animation).play('ItemMoveBComp');
        //判断是否有新的物品添加,有则添加对应的物品
        if (this.saveGoodsId != 0) {
            this.ItemNodeArray[2].getComponent(cc.Animation).play('ItemMoveNTS2');
        }

    },

    /**
     * 当物品移动动画完成时
     */
    onGoodsMoveComp(index) {
        this.ItemNodeArray[index].getComponent(cc.Animation).play('ItemMoveS' + index + 'Comp');
        this.ItemNodeArray[index].node.width = 75;
        this.ItemNodeArray[index].node.height = 75;
    },

    /**
     * 添加物品到使用列表
     * @param {物品位置} goodsId 
     */
    addGoods(goodsId) {
        cc.log("add Goods")
        let addSpriteFrame = this.ItemSpritArray[goodsId - 1]
        //保存已获取的物品ID,用于添加物品后设定物品图标
        this.saveGoodsId = goodsId;
        //设定拾取物品状态
        this.b_isAddGoods = true;
        //如果没有主动要素
        if (this.haveGoods.length == 0) {
            cc.log("play animition")
            this.ItemNodeArray[0].spriteFrame = addSpriteFrame;
            this.ItemNodeArray[0].getComponent(cc.Animation).play('ItemMoveNTB')
        }
        //如果有1~2个主动要素
        else if (this.haveGoods.length > 0 && this.haveGoods.length < 3) {
            this.ItemNodeArray[this.haveGoods.length].spriteFrame = addSpriteFrame;
            this.ItemNodeArray[this.haveGoods.length].getComponent(cc.Animation).play('ItemMoveNTS' + this.haveGoods.length);
        }
        //如果有3个主动要素,去掉最开始的主动要素,将获得的主动要素添加到后面
        else if (this.haveGoods.length >= 3) {
            this.ItemNodeArray[2].getComponent(cc.Animation).play('ItemMoveSTS')
            this.ItemNodeArray[1].getComponent(cc.Animation).play('ItemMoveSTB')
            this.ItemNodeArray[0].getComponent(cc.Animation).play('ItemMoveBTN')
        }
    },

    //左转
    leftMove() {
        //游戏结束时无法左转弯
        if (this.game.b_isGameOver == true || this.game.b_isGameStart == false) {
            return;
        }
        //有冰冻鱼效果下无法变更车道
        if (this.b_canTurn == false) {
            return
        }
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
        //游戏结束时无法左转弯
        if (this.game.b_isGameOver == true || this.game.b_isGameStart == false) {
            return;
        }
        //有冰冻鱼效果下无法变更车道
        if (this.b_canTurn == false) {
            return
        }
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
        //在有章鱼状态下无法减速
        if (this.b_canSpeedDown == false) {
            return;
        }
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
        cc.log('reset playerState')
        //重置玩家的状态
        this.b_canSpeedDown = true;
        this.b_canTurn = true;
        this.b_IsInvincible = false;
        //重置玩家速度
        let speed = this.saveAccel
        this.accel = speed
        //重置玩家的动画
        let reset = cc.scaleTo(0.3, 1.0, 1.0)
        this.node.runAction(reset);
        this.playAnimationLoop('player Move')
        this.child.active = false;
    },

});
