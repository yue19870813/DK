
const {ccclass, property} = cc._decorator;

@ccclass
export default class BloxxScript extends cc.Component {

    @property({
        type: cc.Node,
        displayName: "顶面",
        tooltip: "箱子顶面",
        readonly: true
    })
    topBloxx:cc.Node = null;

    @property({
        type: cc.Node,
        displayName: "左面",
        tooltip: "箱子左面",
        readonly: true
    })
    leftBloxx:cc.Node = null;

    @property({
        type: cc.Node,
        displayName: "右面",
        tooltip: "箱子右面",
        readonly: true
    })
    rightBloxx:cc.Node = null;


    // onLoad () {},

    start () {
        this.topBloxx.height = 15;
        this.topBloxx.skewX = 0;

        this.rightBloxx.width = 0;
        this.leftBloxx.width = 0;
    }

    update (dt) {

    }
}
