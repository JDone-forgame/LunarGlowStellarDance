import { Msg } from "../../core/msg/msg";
import { Singleton } from "../../core/pattern/singleton";
import { Sound } from "../../core/audio/sound";
import { DataGameInst } from "./data-core";
import { warn } from "cc";

export class Bind extends Singleton {

    /** 用于构造键到事件的映射事件字典 */
    _map: { [name: string]: Function } = {}

    /** 事件总数 */
    totalEvents = 0;

    public init(): void {

        // 用于统计事件总数已注册的事件
        Msg.on('msg_count_events', this.countEvents.bind(this));

        // 绑定当前音量值
        this._map['sli_sound'] = () => Sound.volumeSound;

        // 绑定当前音乐音量值.
        this._map['sli_music'] = () => Sound.volumeMusic;

        // 绑定当前版本.
        this._map['txt_show_version'] = () => `${DataGameInst._data.show_version}`;

    }

    /**
     * 该方法用于初始化事件绑定器
     * @param data The data is game events mapping.
     */
    public initData(data: [{ name: string, event: string, data: string | undefined }]) {

        this.init();

        data.forEach(events => {
            let name = events.name;
            let event = events.event;
            let data = events.data;
            if (!events.data) data = undefined;
            this._map[name] = () => {
                Msg.emit(event, data);
            }
        });
    }

    /** 此方法用于按键执行指定事件 */
    public on(key: string) {
        var event = this._map[key];
        if (event) {
            event();
            this.countEvents();
        } else {
            warn(`--->无法获取该连接的事件:${key}`);
        }
    }

    /** 获取指定连接名方法 */
    public get(key: string) {
        return this._map[key]();
    }

    /** 是否有指定Bind */
    public hasBind(key: string): boolean {
        return this._map[key] !== undefined;
    }

    /** 事件总数+1 */
    public countEvents() {
        this.totalEvents++;
    }

    /** 检查计数是否需要根据当前帧进行刷新 */
    public checkRefresh() {
        if (this.totalEvents > 0) {
            Msg.emit("refresh_ui");
            this.totalEvents = 0;
        }
    }

    public update(deltaTime: number): void {
        this.checkRefresh();
    }

}