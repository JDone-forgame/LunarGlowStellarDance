import { Node } from 'cc';
import { UICom } from './ui-com';
import { UIBind } from './ui-bind';

/** UI控制器 */
export class UIBase {
    /** 控制器节点 */
    public node: Node;
    /** 是否处于打开状态 */
    public isOn = false;
    /** UI类（用户类）集合 */
    public _map: UICom[] = Object.create(null);

    constructor(node: Node) {
        this.node = node;
        this._map = UIBind.get(this.node);
    }

    /** 刷新 */
    public refresh(): void {
        if (!this.isOn) return;
        for (let i = 0; i < this._map.length; i++)
            this._map[i].refresh();
    }

    /** 打开 */
    public on(): void {
        this.isOn = true;
        for (let i = 0; i < this._map.length; i++)
            this._map[i].on();
        this.node.active = true;
    }

    /** 关闭 */
    public off(): void {
        this.isOn = false;
        for (let i = 0; i < this._map.length; i++)
            this._map[i].off();
        this.node.active = false;
    }

    public destroy(): void { }
}