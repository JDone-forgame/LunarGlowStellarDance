import { _decorator, Color, Component, EventTouch, log, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

/** 透明度设定 */
@ccclass('DiaphaneitySet')
export class DiaphaneitySet extends Component {

    @property({ type: Sprite, tooltip: '透明度展示' })
    public DiaphaneitySprite: Sprite = null;


    onChoose(event: EventTouch, selfParam: string) {
        let val = Number(selfParam);
        if (this.DiaphaneitySprite) {
            let d = 255 * (val / 100);
            log(d)
            Color.set(this.DiaphaneitySprite.color, this.DiaphaneitySprite.color.r, this.DiaphaneitySprite.color.g, this.DiaphaneitySprite.color.b, d);
        }
    }


}


