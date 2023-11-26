/**
 * 消息中心
 */
 export class Msg {

    private static _map: { [key: string]: Function[] } = {};

    /**
     * 监听消息
     * @param key 监听消息名
     * @param fun 执行方法
     */
    public static on(key: string, fun: (data: any) => void): void {
        if (!this._map[key]) {
            this._map[key] = []
        }
        this._map[key].push(fun);
    }

    /**
     * 监听消息（指定绑定对象）
     * @param key 消息名
     * @param fun 执行方法
     * @param target 执行方法绑定对象，影响this的指向
     */
    public static bind(key: string, fun: (data: any) => void, target: any): void {
        fun = fun.bind(target);
        if (!this._map[key]) {
            this._map[key] = []
        }
        this._map[key].push(fun);
    }

    /**
     * 移除监听
     * @param key 消息名
     * @param fun 执行方法（如果执行方法为空，则移除全部该消息名的监听）
     */
    public static off(key: string, fun: (data: any) => void): void {
        if (fun === null) {
            this._map[key] = []
        } else {
            const index: number = this._map[key].indexOf(fun);
            this._map[key].splice(index, 1);
        }
    }

    /**
     * 发送消息
     * @param key 消息名
     * @param data 消息数据
     */
    public static emit(key: string, data?: any): void {
        const info = this._map[key];
        if (info) {
            info.forEach(item => {
                item(data);
            })
        } else {
            // console.warn(`--->no register with this key:${key}`);
        }
    }

}