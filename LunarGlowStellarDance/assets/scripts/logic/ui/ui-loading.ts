import { _decorator, Component, Node, Label, math, Sprite, log } from 'cc';
import { Msg } from '../../core/msg/msg';
import { DataGameInst } from '../data/data-core';
import { fun } from '../../core/util/fun';
const { ccclass, property } = _decorator;

/** UI加载组件 */
@ccclass('UILoading')
export class UILoading extends Component {

    /** 加载条进度文本 */
    @property(Label)
    txtLoading: Label = null;

    /** 加载条Sprite */
    @property(Sprite)
    img_loading_bar: Sprite = null;

    /** 加载进度 */
    _percent = 0;
    /** 真实进度 */
    _realPercent = 0;
    /** 等待加载列表 */
    waitList: Record<number, ILoadMsg> = {};
    /** 展示节点 */
    viewNode: Node = null;

    /** 加载资源总数 */
    count = 0;
    /** 剩余加载数量 */
    wait_count = 0;
    current_msg = '';

    /** 正在加载 */
    isLoading = false;

    start() {
        // 监听加载消息
        Msg.on('msg_loading', this.onWaitList.bind(this));
        this.viewNode = this.node.children[0];
    }

    onWaitList(data: ILoadMsg) {
        log(`--->收到加载消息,data:${JSON.stringify(data)}`);
        this.waitList[data.id] = data;
        this.isLoading = true;
        this.viewNode!.active = true;
        this._percent = 0;
    }

    update(deltaTime: number) {

        if (!this.isLoading) return;

        this.calculateLoading();
        this._percent = math.lerp(this._percent, this._realPercent, deltaTime);
        // 文本显示当前进度
        this.current_msg = `${Math.floor(this._percent * 100)}%`;
        this.txtLoading!.string = this.current_msg;
        this.img_loading_bar!.fillRange = this._percent;

        if (this._percent >= 0.9999) {
            this.onLoadFinished();
        }

    }

    onLoadFinished() {
        log(`--->加载结束`);

        // 如果当前为菜单重播动画
        if (DataGameInst._currentGameNodeName === 'menu') {
            Msg.emit('msg_play_animation');
        }

        fun.delay(() => {
            this.isLoading = false;
            this.viewNode!.active = false;
        }, 0.1);

    }

    calculateLoading() {
        this.count = 0;
        this.wait_count = 0;
        // this.current_msg = '';
        for (let k in this.waitList) {
            const waitMsg = this.waitList[k];
            this.count += waitMsg.count;
            this.wait_count += waitMsg.wait_count;
            // if (this.wait_count > 0) {
            //     this.current_msg = `${waitMsg.action} ${waitMsg.current} `;
            // }
        }
        this._realPercent = (this.count - this.wait_count) / this.count;
    }

}

/** 加载消息接口 */
export interface ILoadMsg {
    id: number,
    action: string,
    current: string,
    wait_count: number,             // 等待加载数量
    count: number,                  // 加载数量
}
