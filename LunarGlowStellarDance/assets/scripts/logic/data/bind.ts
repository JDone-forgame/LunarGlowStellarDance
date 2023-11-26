import { Msg } from "../../core/msg/msg";
import { Singleton } from "../../core/pattern/singleton";
import { Sound } from "../../core/audio/sound";
import { DataGameInst } from "./data-core";

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

    /**
     * This method is used to execute specific events by key.
     * @param key The name of the event to execute.
     */
    public on(key: string) {
        var event = this._map[key];
        if (event) {
            event();
            this.countEvents();
        } else {
            console.warn('Can not find key:' + key);
        }
    }

    /**
     * This method is to get this event and return the result of executing the method.
     * @param key The key is event to execute.
     * @returns 
     */
    public get(key: string) {
        return this._map[key]();
    }

    /**
     * This method is used to determine if the event is mapped or not.
     * @param key The key of the event to be judged.
     * @returns 
     */
    public hasBind(key: string): boolean {
        return this._map[key] !== undefined;
    }

    /**
     * Current frame event execution statistics.
     */
    public countEvents() {
        this.totalEvents++;
    }

    /**
     * Check if the count needs to be refreshed according to the current frame.
     */
    public checkRefresh() {
        if (this.totalEvents > 0) {
            Msg.emit("refresh_ui");
            this.totalEvents = 0;
        }
    }

    /**
     * This method is an update function for each frame.
     * @param deltaTime This value is the execution time per frame.
     */
    public update(deltaTime: number): void {

        // Check if a refresh is needed.
        this.checkRefresh();
    }

}