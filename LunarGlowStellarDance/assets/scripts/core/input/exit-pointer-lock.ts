import { _decorator, Component, EventKeyboard, Input, input, KeyCode, Node } from 'cc';
const { ccclass, property } = _decorator;

/** ESC退出鼠标锁定模块 */
@ccclass('ExitPointerLock')
export class ExitPointerLock extends Component {

    start() {
        // 注册键盘事件
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.ESCAPE) {
            document.exitPointerLock();
        }
    }
}

