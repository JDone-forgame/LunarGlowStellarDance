import { Node } from 'cc';
import { UICom } from './ui-com';
import { UIBind } from './ui-bind';

export class UIBase {

    public node: Node;

    public isOn = false;

    public _map: UICom[] = Object.create(null);

    constructor (node: Node) {
        this.node = node;
        this._map = UIBind.get(this.node);
    }

    public refresh (): void {
        if (!this.isOn) return;
        for (let i = 0; i < this._map.length; i++)
            this._map[i].refresh();
    }

    public on (): void {
        this.isOn = true;
        for (let i = 0; i < this._map.length; i++)
            this._map[i].on();
        this.node.active = true;
    }

    public off (): void {
        this.isOn = false;
        for (let i = 0; i < this._map.length; i++)
            this._map[i].off();
        this.node.active = false;
    }

    public destroy (): void { }
}