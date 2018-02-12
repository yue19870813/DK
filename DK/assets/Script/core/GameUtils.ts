/**
 * 游戏内通用逻辑类
 * @author ituuz 2018.2.5
 * @description 游戏内通用逻辑类
 */
export class GameUtils {

    /**
     * 判断两个矩形是否碰撞💥
     * @param rect1 矩形1
     * @param rect2 矩形2
     * @returns {boolean} 是否碰撞
     */
    public static containsRect (rect1:cc.Rect, rect2:cc.Rect):boolean {
        // 如果矩形1的中心点到矩形2的中心的x轴水平距离小于矩形1宽与矩形2宽的和的一半
        // 并且矩形1的中心点到矩形2的中心的y轴垂直距离小于矩形1高与矩形2高的和的一半
        // 则认为两个矩形存在相交，即碰撞，否则没有碰撞。
        if (Math.abs(rect1.x - rect2.x) < (rect1.width/2 + rect2.width/2)
         && Math.abs(rect1.y - rect2.y) < (rect1.height/2 + rect2.height/2)) {
            return true;
        }
        return false;
    }

    /**
     * 判断两个矩形碰撞后是否会倒塌,前提是已碰撞。
     * @param rect1 矩形1
     * @param rect2 矩形2
     * @returns {boolean} 是否会倒塌
     */
    public static isCrash (rect1:cc.Rect, rect2:cc.Rect):boolean {
        if (Math.abs(rect1.x - rect2.x) > (rect1.width/2 + rect2.width/2)/2) {
            return true;
        }
        return false;
    }

    /**
     * 判断两个矩形是否完美碰撞，前提时已碰撞
     * @param rect1 
     * @param rect2 
     */
    public static isPerfect (rect1:cc.Rect, rect2:cc.Rect):boolean {
        if (Math.abs(rect1.x - rect2.x) < 10) {
            return true;
        }
        return false;
    }
}
