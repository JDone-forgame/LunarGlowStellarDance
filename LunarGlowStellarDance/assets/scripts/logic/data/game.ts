import { Node, find, game, log } from "cc";
import { Singleton } from "../../core/pattern/singleton";
import { Msg } from "../../core/msg/msg";
import * as dataCore from "./data-core";
import { ExitPointerLock } from "../../core/input/exit-pointer-lock";
import { ResPool } from "../../core/res/res-pool";
import { Save } from "./save";
import { Sound } from "../../core/audio/sound";
import { Bind } from "./bind";
import { UI } from "../../core/ui/ui";
import { Notify } from "../../core/io/notify";
import { Stack } from "../../core/util/data-structure";
import { Action } from "../../core/action/action";

/** 游戏数据 */
export class Game extends Singleton {

    /** 执行游戏操作组的Action */
    _action: Action | undefined;

    /** 用于管理当前节点顺序的堆栈集合 */
    _stack: Stack<string> = new Stack(5);

    /** 用于存储所有游戏节点数据的键值集合 */
    _nodes: { [key: string]: any } = {};

    /** 用于存储静态游戏数据的游戏数据对象 */
    _data: { [key: string]: any } = {};

    /** 游戏是否初始化，true初始化，false未初始化 */
    _isInit = false;

    /** 游戏总时间，用于存储游戏运行的总时间（ms） */
    _totalGameTime = 0;

    /** 用于控制事件自动存储的下一个存储时间点 */
    _nextSaveTime = 0;

    /** 游戏运行时的节点池根节点 */
    _poolNode: Node | null | undefined;

    /** 安全返回时间 */
    backSafeTime = 0;

    public init(): void {

        log(`--->开始执行游戏初始化`);

        // 查找并绑定节点池节点
        this._poolNode = find('init')?.getChildByName('objects-pool');

        // 支持鼠标解除锁定模块
        this._poolNode?.addComponent(ExitPointerLock);

        // 初始化所有数据
        dataCore.Init();

        // 初始化资源池
        ResPool.Instance.initPool(this._poolNode);

        // 初始化本地存储
        Save.Instance.init();

        // 初始化引导
        // Guide.Instance.init();

        // 初始化游戏设置
        // GameSet.Instance.init();

        // 初始化游戏数据
        this._data = dataCore.DataGameInst._data;

        // 建立初始化操作
        this._action = new Action(this._data.action_data);

        // 获取游戏节点跳转数据
        this._nodes = this._data['nodes'];

        // 初始化音频
        Sound.init();

        // 本地化初始化（多语言）
        // Local.Instance.init();

        // 初始化关联器
        Bind.Instance.initData(this._data['events']);

        // 初始化UI管理器
        UI.Instance.init();

        // 注册游戏节点堆栈操作方法
        Msg.on('push', (key: string) => { Game.Instance.push(key); });
        Msg.on('root', (key: string) => { Game.Instance.root(key); });
        Msg.on('next', this.next.bind(this));
        Msg.on('back', this.back.bind(this));

        // 打开初始节点作为游戏当前节点
        this.push(this._data['start_node']);

        // 初始化完成
        this._isInit = true;

        // 检查当前是否存在消息
        // 为什么在初始化后检测到它：因为在初始化过程中可能无法正确显示消息
        Notify.Instance.check_notify();

    }

    /**
     * 跳转到下一个游戏节点
     */
    public next(): void {
        var cur = this._stack.cur();
        const nextAction = this._nodes[cur].next;
        if (nextAction) this.push(nextAction);
    }

    /**
     * 返回上一个游戏节点
     */
    public back(): void {
        if (game.totalTime - this.backSafeTime < 50) return;
        this.backSafeTime = game.totalTime;
        const preNode = this._stack.pop();
        this._action!.off(preNode);
    }

    /**
     * 返回到与名称对应的游戏根节点
     * @param name 
     */
    public root(name: string): void {
        var size = this._stack.size() - 1;
        for (let i = 0; i < size - 1; i++) {
            let pre = this._stack.pop();
            this._action!.off(pre);
        }
    }

    /**
     * 填入并打开游戏当前节点
     * @param name node name.
     */
    public push(name: string) {
        dataCore.DataGameInst._currentGameNodeName = name;
        // 会关闭弹窗节点
        if (!this._nodes[name].is_pop && this._stack.size() > 0) {
            var pre = this._stack.pop();
            // 执行关闭该节点的操作
            this._action!.off(pre);
        }
        this._stack.push(name);
        this._action!.on(name);
    }

    public update(deltaTime: number): void {

        // 初始化成功后继续
        if (!this._isInit) return;

        this._totalGameTime += deltaTime;

        Game.Instance._action.update(deltaTime);

        Bind.Instance.update(deltaTime);

        // 自动保存（当游戏的当前总时间大于下一个时间节点时）
        if (this._data.auto_save) {
            if (this._totalGameTime > this._nextSaveTime) {
                Save.Instance.statisticsTime({ key: 'game', time: Math.floor(this._data.next_save_time) });
                this._nextSaveTime += this._data.next_save_time
            }
        }

    }

}
