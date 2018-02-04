
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainScript extends cc.Component {

    start () {

    }

    onStartGame (event, data) {
        cc.director.loadScene("GameScene");
    }    
}
