import { randomRangeInt, _decorator, warn, error } from 'cc';
import { Sound } from '../audio/sound';
import { Msg } from '../msg/msg';
import { ResCache } from '../res/res-cache';
import { Queue } from '../util/data-structure';
import { Res } from '../res/res';
import { Local } from '../localization/local';
import { ResPool } from '../res/res-pool';
import { GScene } from '../scene/g-scene';
import { ActorBase } from '../actor/actor-base';
import { fun } from '../util/fun';

/** 操作管理器 */
export class Action {

    /** （继承类使用） */
    _time: number = 0;
    /** （继承类使用） */
    _index: number = 0;

    /** 操作配置数据 */
    _data: { [key: string]: any } = {};
    /** 操作组队列 */
    _queue: Queue<ActionGroup> = Object.create(null);
    /** 当前操作 */
    _act: ActionGroup | undefined;

    constructor(name: string) {
        // 获取行为名数据并保存
        this._data = ResCache.Instance.getJson(name).json;
        this._queue = new Queue(5);
    }

    /** 调用开始操作 */
    public on(name: string): void {
        this.push(name, 'start');
        Msg.emit('msg_stat_times', name);
    }

    /** 调用关闭操作 */
    public off(name: string): void {
        this.push(name, 'end');
    }

    /** 将操作放入执行队列中 */
    public push(name: string, state: string) {
        var action = this._data[name];
        if (action === undefined) {
            warn(`--->没有任何该名称:${name}的操作`);
            return;
        }
        var info: ActionInfo[] = action[state];
        if (info === undefined) return;
        let group = new ActionGroup(info);
        this._queue.push(group);
    }

    /** 更新应该执行的操作 */
    public pop() {
        this._act = this._queue.pop();
    }

    /** 需要在使用的组件中调用 */
    public update(deltaTime: number) {
        if (GScene.isLoadScene) return;
        if (this._act) {
            this._act.time += deltaTime;
            const cur = this._act?.data[this._act.idx]!;
            if (cur === undefined || this._act === undefined) {
                throw new Error(`--->操作集合idx错误: ${this._act?.idx}`);
            }
            if (this._act.time >= cur.time) {
                UtilAction.do(cur.name, cur.data);
                this._act.idx += 1;
                if (this._act.idx >= this._act.data.length) {
                    this._act = undefined;
                }
            }
        } else {
            // 队列不为空则更新应该执行的操作
            if (!this._queue.empty()) this.pop();
        }
    }
}

/** 并发操作管理器 */
export class ActionParallel {
    _time: number = 0;
    _index: number = 0;

    /** 操作配置数据 */
    _data: { [key: string]: any } = {};
    /** 当前操作 */
    _act: ActionGroup | undefined;
    /** 当前操作组 */
    _actions: ActionGroup[] = [];

    constructor(name: string) {
        this._data = ResCache.Instance.getJson(name).json;
    }

    /** 调用开始操作 */
    public on(name: string): void {
        this.push(name, 'start');
        Msg.emit('msg_stat_times', name);
    }

    /** 调用关闭操作 */
    public off(name: string): void {
        this.push(name, 'end');
    }

    /** 将操作放入执行队列中 */
    public push(name: string, state: string) {
        var action = this._data[name];
        if (action === undefined) {
            error(`--->未找到该名称${name}的操作`);
            return;
        }
        const info: ActionInfo[] = action[state];
        let group = new ActionGroup(info);
        this._actions.push(group);
    }

    public update(deltaTime: number) {
        var count = this._actions.length;
        if (count <= 0) return;
        for (let i = count - 1; i >= 0; i--) {
            const element = this._actions[i];
            element.time += deltaTime;
            const cur = element.data[element.idx];
            if (element.time >= cur.time) {
                UtilAction.do(cur.name, cur.data);
                element.idx += 1;
                if (element.idx >= element.data.length) {
                    this._actions.splice(i, 1);
                }
            }
        }
    }
}

/** 角色行为 */
export class ActionActor extends Action {

    _actor: ActorBase;

    constructor(name: string, actor: ActorBase) {
        super(name);
        this._actor = actor;
    }

    public on(name: string): void {
        super.on(name);
        Msg.emit('msg_stat_times', name);
    }

    public update(deltaTime: number) {
        if (GScene.isLoadScene) return;
        if (this._act) {
            this._act.time += deltaTime;
            var length = this._act.data.length;
            for (let i = this._act.idx; i < length; i++)
                if (!this.checkRunAction()) break;
        } else {
            if (!this._queue.empty()) this.pop();
        }
    }

    public checkRunAction() {
        const cur = this._act?.data[this._act.idx]!;
        if (cur === undefined || this._act === undefined) {
            throw new Error(`Error actor action index: ${this._act?.idx}`);
        }
        if (this._act.time >= cur.time) {
            if (cur.delay > 0) {
                fun.delay(() => { UtilAction.do(cur.name, cur.data, this._actor); }, cur.delay);
            } else {
                UtilAction.do(cur.name, cur.data, this._actor);
            }
            this._act.idx += 1;
            if (this._act.idx >= this._act.data.length) {
                this._act = undefined;
            }
            this._actor.actionEnd();
            return true;
        }
        return false;
    }

}

export class ActionQueue extends Action {

    public update(deltaTime: number) {
        if (GScene.isLoadScene) return;
        if (this._act) {
            this._act.time += deltaTime;
            let cur = this._act.data[this._act.idx];
            if (this._act.time >= cur.time) {
                UtilAction.do(cur.name, cur.data);
                this._act.idx += 1;
                if (this._act.idx >= this._act.data.length) {
                    this._act = undefined;
                }
            }
        } else {
            if (!this._queue.empty()) this.pop();
        }
    }
}

/** 操作信息 */
interface ActionInfo {
    /** 开始执行操作时间（秒） */
    time: number;
    /** 操作延迟时间（秒） */
    delay: number;
    /** 操作名 */
    name: string;
    /** 操作数据 */
    data: string;
}

/** 操作组 */
export class ActionGroup {
    /** 具体执行的操作组 */
    public data: ActionInfo[];
    public time: number = 0;
    /** 执行中的操作下标 */
    public idx: number = 0;

    constructor(info: ActionInfo[]) {
        this.data = info;
    }
}

export type key_type = { key: string, value: boolean | string | number | any };
export type key_type_boolean = { key: string, value: boolean };
export type key_type_string = { key: string, value: string };
export type key_type_number = { key: string, value: number };
export type action_type = number | boolean | string | key_type_boolean | key_type_number | key_type_string;

/** 操作工具类 */
export class UtilAction {

    /** 执行操作 */
    public static do(name: string, key: action_type, actor: ActorBase | undefined = undefined) {
        var action = this[name];
        // 如果该工具类中有该方法则执行
        if (action) {
            action(key, actor);
        } else {
            warn(`--->执行操作时没找到${name}行为处理方法`);
        }
    }

    public static on_check_preload() {
        if (GScene.isPreload)
            GScene.isLoadScene = true;
    }

    /** 操作:加载场景 */
    public static on_scene(key: string) {
        GScene.Load(key, () => { });
    }

    public static off_scene(key: string) {

    }

    /** 操作:加载UI */
    public static on_ui(key: string) {
        Msg.emit('msg_ui_on', key);
    }

    /** 操作:关闭UI */
    public static off_ui(key: string) {
        Msg.emit('msg_ui_off', key);
    }

    public static off_sfx(key: string) {
        Sound.off(key);
    }

    public static on_sfxing(key: string, volume = 1) {
        Sound.playLoop(key, volume);
    }

    public static off_sfxing(key: number) {
        Sound.offing(key);
    }

    public static on_bgm(key: string) {
        Sound.onBGM(key);
    }

    public static off_bgm(key: string) {
        Sound.offBGM(key);
    }

    public static update_bgm() {
        Sound.updateBGM();
    }

    public static on_msg(key: string) {
        Msg.emit(key);
    }

    public static on_msg_str(data: key_type_string) {
        Msg.emit(data.key, data.value);
    }

    public static on_inst_scene(key: string) {
        var asset = ResCache.Instance.getPrefab(key);
        var obj = Res.inst(asset, ResPool.Instance._objectNode);
        obj.setPosition(0, 0, 0);
    }

    public static on_inst_pool(key: string) {
        var asset = ResCache.Instance.getPrefab(key);
        var obj = Res.inst(asset, ResPool.Instance._poolNode);
        obj.setPosition(0, 0, 0);
    }


    public static off_inst(key: string, actor: ActorBase) {

    }

    public static on_inst_fx(data: any, actor: ActorBase) {
        var res = data.res;
        var bone = data.bone;
        var asset = ResCache.Instance.getPrefab(res);
        var obj = Res.inst(asset, ResPool.Instance._objectNode);
        if (actor !== undefined && actor._view) {
            var bone_node = actor.node.getChildByName(bone);
            obj.parent = bone_node;
            obj.setPosition(0, 0, 0);
        }
    }


    public static off_inst_fx(data: any, actor: ActorBase) {
        var res = data.res;
        var bone = data.bone;
        if (actor !== undefined && actor._view !== null) {
            var off_fx = actor.node.getChildByName(bone)?.getChildByName(res);
            if (off_fx) off_fx.emit('setDestroy');
        }
    }

    public static on_active(data: key_type_boolean, actor: ActorBase) {
        actor.setActive(data);
    }

    public static on_fx(data: any, actor: ActorBase) {
        //actor.onFx(data);
        actor.node.emit('on_fx', data);
    }

    public static off_fx(data: any, actor: ActorBase) {
        actor.node.emit('off_fx', data);
    }

    public static on_buff(data: string, actor: ActorBase) {
        //actor.onBuff(data);
    }

    public static set_fx(data: key_type_boolean, actor: ActorBase) {
        actor.setFx(data);
    }

    public static on_ani(key: string, actor: ActorBase) {
        if (actor._anim)
            actor._anim.play(key);
        else
            console.log('Not register SkeletalAnimation');
    }

    public static on_set(data: key_type, actor: ActorBase) {
        //console.log(`on set key:${data.key}  value:${data.value}`);
        actor._data[data.key] = data.value;
    }

    public static off_set(key: string, actor: ActorBase) {
        actor._data[key] = false;
    }

    public static on_add(data: any, actor: ActorBase) {
        for (let k in data) {
            console.log(k);
            actor._data[k] += data[k];
        }
    }

    public static on_mul(data: any, actor: ActorBase) {
        for (let k in data) {
            console.log(k);
            actor._data[k] *= data[k];
        }
    }

    public static on_com(key: string, actor: ActorBase) {
        actor.node.addComponent(key);
    }

    public static on_call(key: string, actor: ActorBase) {
        actor[key]();
    }
}