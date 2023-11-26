import { _decorator, Component, log, Node } from 'cc';
import { Msg } from '../msg/msg';
import { ILoadMsg } from '../../logic/ui/ui-loading';
const { ccclass, property } = _decorator;

@ccclass('ResDestroy')
export class ResDestroy extends Component {

    isDestroy = false;
    msg: ILoadMsg = null;

    start() {
        Msg.bind('msg_destroy_res', () => {
            this.isDestroy = true;
            const length = this.node.children.length - 1;
            this.msg = {
                id: 0,
                action: 'destroy',
                current: ' objects node. ',
                wait_count: length,
                count: length,
            }
            Msg.emit('msg_loading', this.msg);

            if ((globalThis as any).ppSettings) {
                (globalThis as any).ppSettings.passVersion++;

                log(`--->msg_destroy_res: passVersion - ${(globalThis as any).ppSettings.passVersion}`);
            }

        }, this);
    }

    update(deltaTime: number) {
        if (this.isDestroy) {
            const length = this.node.children.length - 1;
            this.msg!.wait_count = length;
            //this.msg!.current = this.node.children[length].name;
            if (length <= -1) {
                this.isDestroy = false;
                log(`--->资源销毁`);
                return;
            }
            this.node.children[length].destroy();
        }
    }
}

