import { GameControler } from "./../GameControler";
import { GameUtils } from "./../../core/GameUtils";
import { Config } from "./../../Config";

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

    @property({
        type: cc.Node,
        displayName: "掉落节点",
        readonly: true
    })
    dropNode:cc.Node = null;

    @property({
        type: cc.Node,
        displayName: "背景节点",
        readonly: true
    })
    bgNode:cc.Node = null;

    // ------------------- 绳索相关属性 --------------------


    // ------------------- 箱子相关属性 --------------------
    /** 初始速度 */
    _initSpeed:number = 3;
    /** 下落的加速度 */
    _velocity:number = 0.5;
    /** 箱子是否处于掉落状态 */
    _isInDrop:boolean = false;
    /** 成功叠起的箱子数量 */
    _succBoxCount:number = 0;
    /** 得分 */
    _score:number = 0;

    start () {
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
  
    }

    // 更新掉落箱子逻辑
    updateDropBox (dt) {
        let bloxx_drop:cc.Node = this.dropNode.getChildByName("bloxx_drop");
        let bloxx:cc.Node = this.towerNode.getChildByName("bloxx");
        if (bloxx && bloxx_drop) {
            bloxx_drop.y -= this._initSpeed;
            this._initSpeed += this._velocity;
            let box1 = bloxx_drop.getBoundingBox();
            let box2 = bloxx.getBoundingBox();
            let box1Pos = this.dropNode.convertToWorldSpaceAR(bloxx_drop.position);
            let box2Pos = this.towerNode.convertToWorldSpaceAR(bloxx.position);
            let rect1 = new cc.Rect(box1Pos.x, box1Pos.y, box1.width, box1.height);
            let rect2 = new cc.Rect(box2Pos.x, box2Pos.y, box2.width, box2.height);
            if (GameUtils.containsRect(rect1, rect2)) {
                let newPos = this.dropNode.convertToWorldSpaceAR(bloxx_drop.position);
                let resultPos = this.towerNode.convertToNodeSpaceAR(newPos);
                bloxx_drop.position = resultPos;
                bloxx_drop.parent = this.towerNode;
                // 碰撞成功
                this._isInDrop = false;
                bloxx_drop.name = "bloxx";
                bloxx.name = "other";
                // 成功叠起箱子的数量
                this._succBoxCount++;
                
                if (GameUtils.isPerfect(rect1, rect2)) {
                    let pNode = bloxx.getChildByName("particleNode");
                    let particle = pNode.getComponent(cc.ParticleSystem);
                    particle.resetSystem();
                } else if (GameUtils.isCrash(rect1, rect2)) {
                    // TODO:
                }
                this._boxShift();
                this.addBox();
            } else if (bloxx_drop.y <= 0) { // 箱子落地也算失败
                // TODO: 没有落在正确位置，游戏失败。
            }
        }
    }

    /** 点击屏幕事件 */
    onClickScreen (event, data) {
        let bloxx:cc.Node = this.targetNode.getChildByName("bloxx_drop");
        if (bloxx) {
            let wPos = this.targetNode.convertToWorldSpaceAR(bloxx.position);
            let rPos = this.dropNode.convertToNodeSpaceAR(wPos);
            bloxx.parent = this.dropNode;
            bloxx.position = rPos;
            // 箱子开始掉落
            this._isInDrop = true;
            this._initSpeed = 3;
        }
    }

    /**
     * 当箱子超过一定高度后向下位移，并将超出屏幕的箱子移除。
     */
    _boxShift () {
        let boxes = this.towerNode.children;
        if (boxes.length <= 4) {
            return;
        }
        for (let box of boxes) {
            if (box.y < 300) {
                box.removeFromParent(true);
            } else {
                let action = cc.moveBy(0.2, cc.p(0, -Config.BOX_HEIGHT));
                box.runAction(action);
            }
        }
        // 箱子位移时，背景也同步位移
        this._bgMoveDown();
    }

    /** 背景线性下移，叠的越高，位移幅度越小 */
    _bgMoveDown () {
        if (this._succBoxCount < 10) {
            let action = cc.moveBy(0.2, cc.p(0, -Config.BOX_HEIGHT));
            this.bgNode.runAction(action);
        } else if (this._succBoxCount < 20 && this._succBoxCount >= 10) {
            let action = cc.moveBy(0.2, cc.p(0, -Config.BOX_HEIGHT / 2));
            this.bgNode.runAction(action);
        } else if (this._succBoxCount < 50 && this._succBoxCount >= 20) {
            let action = cc.moveBy(0.2, cc.p(0, -Config.BOX_HEIGHT / 4));
            this.bgNode.runAction(action);
        } else if (this._succBoxCount < 100 && this._succBoxCount >= 50) {
            let action = cc.moveBy(0.2, cc.p(0, -Config.BOX_HEIGHT / 10));
            this.bgNode.runAction(action);
        } else if (this._succBoxCount < 200 && this._succBoxCount >= 100) {
            let action = cc.moveBy(0.2, cc.p(0, -Config.BOX_HEIGHT / 20));
            this.bgNode.runAction(action);
        } else {
            let action = cc.moveBy(0.2, cc.p(0, -1));
            this.bgNode.runAction(action);
        }
    }
}
