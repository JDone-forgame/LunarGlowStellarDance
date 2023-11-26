import { _decorator, Node, Camera, find, error, warn } from 'cc';
import { Singleton } from "../pattern/singleton";
import { Log } from "../io/log";
import { UIBase } from "./ui-base";
import { Res } from "../res/res";
import { Msg } from '../msg/msg';
import { UtilNode } from '../util/util';
import { DataGameInst } from '../../logic/data/data-core';
import { ResCache } from '../res/res-cache';
import { fun } from '../util/fun';

/** UI管理器 */
export class UI extends Singleton {
    private _map: { [name: string]: UIBase } = {};
    /** canvas 节点 */
    public node: Node | undefined | null;
    /** 面板节点（挂载UI节点） */
    public panelRoot: Node | undefined;
    /** 相机节点 */
    public camera: Camera | undefined;

    public init() {
        this.node = find('init/canvas');
        this.panelRoot = UtilNode.getChildByName(this.node!, 'panels');
        if (this.node === undefined || this.node == null) {
            error(`--->初始化UI管理器时未找到: init/canvas 节点`);
            throw new Error(`--->找不到 canvas ui 根节点`);
        }

        // 注册消息监听
        Msg.on('refresh_ui', this.refresh.bind(this));
        Msg.on('msg_ui_on', this.on.bind(this));
        Msg.on('msg_ui_off', this.off.bind(this));

        // [ "ui_logo", "ui_menu", "ui_settings" ]
        const cacheList = DataGameInst._data.ui_cache_list;

        for (let i = 0; i < cacheList.length; i++) {
            this.load(cacheList[i]);
        }

        this.camera = this.node?.getChildByName('Camera')?.getComponent(Camera)!;
    }

    public refresh() {
        for (let key in this._map) {
            this._map[key].refresh();
        }
    }

    /** 加载预制体UI */
    public load(name: string) {
        const asset = ResCache.Instance.getPrefab(name);
        if (asset) {
            const panel = Res.inst(asset, UI.Instance.panelRoot);
            const order = DataGameInst._data.ui_order[name];
            panel.setPosition(0, 0, order);
            let set = false;
            var count = UI.Instance.panelRoot.children.length;
            for (let i = 1; i < count; i++) {
                let child = this.panelRoot!.children[i];
                if (child.position.z > order) {
                    let ui_order = i;
                    panel.setSiblingIndex(ui_order);
                    set = true;
                    break;
                }
            }
            if (!set) panel.setSiblingIndex(count);
            const uiBase = new UIBase(panel);
            uiBase.on();
            this._map[name] = uiBase;
            fun.delay(() => {
                if (name == 'ui_logo') return;
                this._map[name].off();
            }, 0.05);
            //fun.delay(() => { uiBase.off() }, 0.2);
        } else {
            warn(`--->无法加载名称为:${name}的UI预制体资源`);
        }
    }

    public on(name: string) {

        var load = async () => {
            const panel = this._map[name];
            if (panel) {
                panel.on();
            } else {
                Res.loadPrefab('ui/' + name, (err, asset) => {
                    if (asset) {
                        const panel = Res.inst(asset, UI.Instance.panelRoot);
                        const order = DataGameInst._data.ui_order[name];
                        panel.setPosition(0, 0, order);
                        let set = false;
                        var count = UI.Instance.panelRoot.children.length;
                        for (let i = 1; i < count; i++) {
                            let child = this.panelRoot!.children[i];
                            if (child.position.z > order) {
                                let ui_order = i;
                                panel.setSiblingIndex(ui_order);
                                set = true;
                                break;
                            }
                        }
                        if (!set) panel.setSiblingIndex(count);
                        const uiBase = new UIBase(panel);
                        uiBase.on();
                        this._map[name] = uiBase;
                    } else {
                        warn(`--->ui/目录中没有找到该名字${name}的UI预制体`);
                    }
                });
            }
        };
        load();
    }

    public off(name: string) {
        const panel = this._map[name];
        if (panel) {
            panel.off();
        } else {
            warn(`--->想要关闭一个不存在的UI:${name}`);
        }
    }

    public destroy(name: string) {
        const panel = this._map[name];
        if (panel) {
            panel.destroy();
            this._map[name] = undefined;
        } else {
            warn(`--->想要销毁一个不存在的UI:${name}`);
        }
    }

}