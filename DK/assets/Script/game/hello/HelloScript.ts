
const {ccclass, property} = cc._decorator;

@ccclass
export default class HelloScript extends cc.Component {

    // onLoad () {},

    start () {
        setTimeout(() => {
            cc.director.loadScene("MainScene");
        }, 1000);
    }
    

    // update (dt) {},
}
