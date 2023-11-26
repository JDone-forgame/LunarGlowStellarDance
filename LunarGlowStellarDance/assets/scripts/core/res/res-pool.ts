import { _decorator, find, Node, Prefab, Vec3 } from 'cc';
import { Msg } from '../msg/msg';
import { Singleton } from '../pattern/singleton';
import { Res } from './res';
import { ResCache } from './res-cache';
import { DataPoolInst } from '../../logic/data/data-core';
const { ccclass } = _decorator;

/** 资源池 */
@ccclass('ResPool')
export class ResPool extends Singleton {

    _root: Node | undefined;

    _pool: Record<string, pool> = {};

    _poolNode: Node | undefined;

    _objectNode: Node | undefined | null;

    public init() {
    }

    public initPool(root: Node) {

        this._poolNode = root;

        // Find the root node of all objects.
        this._objectNode = find('init')?.getChildByName('objects');

        this._root = root;
        Msg.on('msg_pool_recycle', this.pool_recycle.bind(this));
        for (const key in DataPoolInst._data) {
            const count = DataPoolInst._data[key];
            this.newPool(key, count);
        }

    }

    pool_recycle() {
        for (const key in this._pool) {
            this._pool[key].recycle();
        }
    }

    public pop(name: string, position: Vec3, root: Node): Node {
        if (!this._pool[name]) {
            throw new Error(`Can not find pool: ${name}`);
        }
        const item = this._pool[name].pop();
        if (root) {
            item.parent = root;
        }
        item.setWorldPosition(position);
        item.active = true;
        return item;
    }

    public push(obj: Node) {
        this._pool[obj.name].push(obj);
    }

    public pushByName(name: string, obj: Node) {
        console.log(name, obj);
        this._pool[name].push(obj);
    }

    public newPool(name: string, count: number) {
        var newPool = new pool(name, this._root!, count);
        this._pool[name] = newPool;
    }

}

export class pool {

    _index: number = 0;

    _items: Array<Node> = new Array();

    _state: Array<number> = new Array();

    _max: number = 0;

    _realMax: number = 0;

    _name: string = '';

    _prefab: Prefab;

    _root: Node;

    public constructor(name: string, root: Node, count: number) {
        this._max = count;
        this._name = name;
        this._prefab = ResCache.Instance.getPrefab(this._name);
        this._root = root;
        for (let i = 0; i < this._max; i++) {
            // Inst new node.
            const newNode = Res.inst(this._prefab, this._root);
            newNode['pool_index'] = i;
            this._items[i] = newNode;
            this._state[i] = 1;
            newNode.active = false;
        }
    }

    recycle() {
        for (let i = 0; i < this._max; i++) {
            this._state[i] = 1;
            this._items[i].active = false;
            this._items[i].setPosition(10000, 10000, 10000);
        }
    }

    public pop(): Node {

        for (let i = 0; i < this._max; i++) {
            var state = this._state[this._index];
            if (state == 1) {
                var n = this._items[this._index];
                this._state[this._index] = 2;
                n.active = true;
                this.next();
                return n;
            }
            this.next();
        }

        // Not find res.
        // Create new one.
        return this.increaseRes();

    }

    public next() {
        this._index++;
        if (this._index >= this._max) this._index = 0;
    }

    public push(obj: Node) {
        obj.active = false;
        var poolIndex = obj['pool_index'];
        this._state[poolIndex] = 1;
        obj.parent = this._root;
    }

    public increaseRes() {

        // Inst new node.
        const newNode = Res.inst(this._prefab, this._root);
        this._index = this._max;
        this._max++;

        if (newNode['pool_index'] !== undefined) {
            console.log('pool create error.');
        }

        newNode['pool_index'] = this._index;
        this._items[this._index] = newNode;
        this._state[this._index] = 1;
        return newNode;

    }

}

