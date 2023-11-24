import { _decorator, Component, Label, log, math, Node, Slider, Sprite, UITransform } from 'cc';
const { ccclass, property } = _decorator;

/** 滑动条 */
@ccclass('VolumeSlider')
export class VolumeSlider extends Component {

    @property({ type: Sprite, tooltip: '填充图' })
    public FillSprite: Sprite = null;

    @property({ type: Label, tooltip: '进度条值' })
    public FillValue: Label = null;


    slideEvent(obj: Slider) {
        let value = Math.floor(obj.progress * 100);
        this.FillValue.string = String(value);
        this.FillSprite.fillRange = obj.progress;
    }
}


