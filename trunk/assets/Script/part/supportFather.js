cc.Class({
    extends: cc.Component,

    properties: {
        upTime: {
            default: 0.4,
            tooltip: "上升用的时间",
        },
        upDis: {
            default: 100,
            tooltip: "上升的距离",
        },
        downTime: {
            default: 0.4,
            tooltip: "下降用的时间",
        },
        downDis: {
            default: -100,
            tooltip: "下降的距离",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.time = 0;
        this.b_isUp = false;
        this.b_isDown = false;
    },

    start() {
        //直接控制支援小动物的动画播放
        this.actionup = cc.moveBy(this.upTime, cc.v2(0, this.upDis));
        this.actiondown = cc.moveBy(this.downTime, cc.v2(0, this.downDis));
    },
    
    update(dt) {
        this.time += dt;
        if (this.time > 0 && this.b_isUp == false) {
            this.node.runAction(this.actionup);
            this.b_isUp = true;
        }
        else if (this.time > this.upTime && this.b_isDown == false) {
            this.node.runAction(this.actiondown);
            this.b_isDown = true;
        }
        else if (this.time > this.upTime + this.downTime) {
            this.time = 0;
            this.b_isUp = false;
            this.b_isDown = false;
        }
    },
});
