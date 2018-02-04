
/**
 * 游戏核心控制类
 * @author ituuz
 * @description 控制游戏内的核心逻辑，单例。
 */
export class GameControler {

    private static _instance:GameControler = new GameControler();

    /** 当前大楼倾斜角度 */
    private _towerAngle:number;

    /** 私有构造函数 */
    private constructor () {

    }

    /**
     * 获取单例对象
     * @returns {GameControler}
     */
    public static getInstance():GameControler {
        return GameControler._instance;
    }

    public set towerAngle (angle:number) {
        this._towerAngle = angle;
    }
    public get towerAngle ():number {
        return this._towerAngle;
    }
}
