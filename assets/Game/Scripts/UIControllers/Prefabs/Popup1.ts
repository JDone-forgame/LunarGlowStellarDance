import { _decorator, Component, Label, log, Node, Sprite, UITransform } from 'cc';
const { ccclass, property } = _decorator;

/** 弹窗1 */
@ccclass('Popup1')
export class Popup1 extends Component {

    @property({ type: Label })
    ContentLabel: Label = null;

    @property({ type: Sprite })
    ContentBack: Sprite = null;

    /** 设置文本 */
    setContent(content: string) {
        if (this.ContentLabel) {
            this.ContentLabel.string = content;
            if (this.ContentBack) {
                this.ContentBack.node.getComponent(UITransform).setContentSize(this.ContentLabel.getComponent(UITransform).contentSize);
            }
        }
    }


    onConfimClick() {
        log(`--->确认，点击`)
        this.node.destroy();
    }

    onCancelClick() {
        log(`--->取消，点击`)
        this.node.destroy();
    }

    onNoConfimClick() {
        log(`--->不再确认，点击`)
    }
}


