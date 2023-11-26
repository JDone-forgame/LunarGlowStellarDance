import { _decorator, Component, Node, animation } from 'cc';
const { ccclass, property } = _decorator;

/** UI可以重复播放（废弃） */
@ccclass('UIEnablePlayAnimation')
export class UIEnablePlayAnimation extends Component {

    _animationGraph: animation.AnimationController = null;

    onEnable() {

        if (!this._animationGraph) {
            this._animationGraph = this.node.getComponent(animation.AnimationController);
        }

        this._animationGraph?.setValue('trigger_replay', true);

    }

}

