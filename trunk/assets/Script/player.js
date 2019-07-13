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
        speedButton: {
            default: null,
            type: cc.Button,
            tooltip: "减速按钮",
        },
        // curRoad: {
        //     default: 1,
        //     tooltip: "当前所在冰道"
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.b_isAccel = true;//游戏一开始就是加速状态
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

    //左转
    leftMove() {
        cc.log("left move")
        //判断是拐弯还是变换车道
        if (this.game.cross.y - this.node.y < 160 && this.game.cross.y - this.node.y > 0 && this.game.crossFather.x > this.node.x) {
            var leftTurn = cc.rotateBy(this.moveTime, 90)
            this.game.crossRotation.runAction(leftTurn)
            var enemyTrun = cc.rotateBy(this.moveTime, 90)
            this.enemy.runAction(enemyTrun);
            // var children = this.enemy.children
            // for (var i = 0; i < children.length; ++i) {
            //     var enemyChild = children[i].getComponent("enemy");
            //     enemyChild.setTurn();
            // }
            this.game.rot += 90
            cc.log("rotation = " + this.game.rot)
        }
        else {
            var roadmove = cc.moveBy(this.moveTime, cc.v2(100, 0));
            this.road.runAction(roadmove);
            var enemymove = cc.moveBy(this.moveTime, cc.v2(100, 0));
            this.enemy.runAction(enemymove);
            var crossmove = cc.moveBy(this.moveTime, cc.v2(100, 0));
            this.game.crossFather.runAction(crossmove);
        }
    },

    //右转
    rightMove() {
        cc.log("right")
        //判断是拐弯还是变换车道
        if (this.game.cross.y - this.node.y < 160 && this.game.cross.y - this.node.y > 0 && this.game.crossFather.x < this.node.x) {
            var rightTurn = cc.rotateBy(this.moveTime, -90)
            this.game.crossRotation.runAction(rightTurn)
            var enemyTrun = cc.rotateBy(this.moveTime, -90)
            this.enemy.runAction(enemyTrun);
            // var children = this.enemy.children
            // for (var i = 0; i < children.length; ++i) {
            //     var enemyChild = children[i].getComponent("enemy");
            //     enemyChild.setTurn();
            // }
            this.game.rot -= 90
            cc.log("rotation = " + this.game.rot)
        }
        else {
            var roadmove = cc.moveBy(this.moveTime, cc.v2(-100, 0));
            this.road.runAction(roadmove);
            var enemymove = cc.moveBy(this.moveTime, cc.v2(-100, 0));
            this.enemy.runAction(enemymove);
            var crossmove = cc.moveBy(this.moveTime, cc.v2(-100, 0));
            this.game.crossFather.runAction(crossmove);
        }
        //var rightTurn = cc.rotateBy(0.5,90)
        //this.game.crossRotation.runAction(rightTurn);
        // var roadTurn = cc.rotateBy(0.5,90);
        // this.road.runAction(roadTurn);
        // var enemyTurn = cc.rotateBy(0.5,90);
        // this.enemy.runAction(enemyTurn)
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

    update(dt) {
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
});
