import { GameControler } from "./../GameControler";
import { GameUtils } from "./../../core/GameUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScript extends cc.Component {

    @property({
        type: cc.Node,
        displayName: "吊索",
        readonly: true
    })
    rope:cc.Node = null;

    @property({
        type: cc.Node,
        displayName: "箱子节点",
        readonly: true
    })
    targetNode:cc.Node = null;

    @property({
        type: cc.Node,
        displayName: "楼塔节点",
        readonly: true
    })
    towerNode:cc.Node = null;

    // ------------------- 绳索相关属性 --------------------
    /** 当前回合吊索最大角度 */
    _currMaxAngle:number = 0;
    /** 当前吊索角度 */
    _currAngle:number = 0;
    /** 方向状态 true：正向， false：反向 */
    _directState:boolean = true;
    /** 吊索旋转加速度 */
    _ropeSpeed:number = 0.3;

    // ------------------- 箱子相关属性 --------------------
    /** 箱子是否处于掉落状态 */
    _isInDrop:boolean = false;

    start () {
        this._currMaxAngle = 30;
        this.addBox();
    }

    addBox() {
        // 加载箱子bloxx
        cc.loader.loadRes("prefabs/bloxx", (err, prefab)=>{
            var bloxx:cc.Node = cc.instantiate(prefab);
            bloxx.name = "bloxx_drop";
            this.targetNode.addChild(bloxx);
        });
    }

    update (dt) {
        // 更新吊索
        this.updateRope(dt);
        // 更新掉落箱子逻辑
        if (this._isInDrop) {
            this.updateDropBox(dt);
        }
    }

    /** 更新吊索逻辑 */
    updateRope (dt) {
        if (this._directState) {
            this._currAngle += this._ropeSpeed;;
        } else {
            this._currAngle -= this._ropeSpeed;
        }
        // 摇摆到最大角度后往回摇摆.
        if (this._currAngle >= this._currMaxAngle) {
            this._directState = false;
            // this._ropeSpeed = 0.1;
        } else if (this._currAngle <= -this._currMaxAngle) {
            this._directState = true;
            // this._ropeSpeed = 0.1;
        }
        // 处理加速度
        // if (this._currAngle > 0 && this._directState) { // 左上
        //     this._ropeSpeed += 0.02;
        // } else if (this._currAngle > 0 && !this._directState) { // 左下
        //     this._ropeSpeed += 0.02;
        // } else if (this._currAngle < 0 && !this._directState) { // 右上
        //     this._ropeSpeed += 0.02;
        // } else if (this._currAngle < 0 && this._directState) { // 右下
        //     this._ropeSpeed += 0.02;
        // }
        // console.log(this._currAngle + "=====" + this._directState);
        this.rope.rotation = this._currAngle;
    }

    // 更新掉落箱子逻辑
    updateDropBox (dt) {
        let bloxx_drop:cc.Node = this.towerNode.getChildByName("bloxx_drop");
        let bloxx:cc.Node = this.towerNode.getChildByName("bloxx");
        if (bloxx && bloxx_drop) {
            bloxx_drop.y -= 3;
            let box1 = bloxx_drop.getBoundingBox();
            let box2 = bloxx.getBoundingBox();
            if (GameUtils.containsRect(box1, box2)) {
                // 碰撞成功
                this._isInDrop = false;
            }
        }
    }

    /** 点击屏幕事件 */
    onClickScreen (event, data) {
        let bloxx:cc.Node = this.targetNode.getChildByName("bloxx_drop");
        if (bloxx) {
            let wPos = this.targetNode.convertToWorldSpaceAR(bloxx.position);
            let rPos = this.towerNode.convertToNodeSpaceAR(wPos);
            bloxx.parent = this.towerNode;
            bloxx.position = rPos;
            // 箱子开始掉落
            this._isInDrop = true;
        }
    }

}
