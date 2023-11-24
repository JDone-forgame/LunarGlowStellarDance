import { _decorator, Component, Node } from 'cc';
import { UIControllers } from './UIControllers';
import { EUIMainPage } from '../defines/UIDefines';
const { ccclass, property } = _decorator;

@ccclass('SetPageController')
export class SetPageController extends Component {

    @property({ type: UIControllers })
    UICtrl: UIControllers = null;




    start() {

    }

    update(deltaTime: number) {

    }


    /** 返回按键点击 */
    onBackClick() {
        if (this.UICtrl) {
            this.UICtrl.openMainPage(EUIMainPage.start);
        }
    }
}


