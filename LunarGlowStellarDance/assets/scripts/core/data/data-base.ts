import { ResCache } from "../res/res-cache";
import { KeyAnyType } from "../../logic/data/game-type";

/** 数据基类 */
export class DataBase {

    /** 数据值 */
    _data: KeyAnyType = {};
    /** 数据名 */
    _name: string = '';

    constructor() { }

    /**
     * 初始化数据
     * @param name data目录下数据名称，例如：data-game
     */
    public init(name: string) {
        this._name = name;
        this._data = ResCache.Instance.getJson(name).json;
        this.bind();
    }

    public bind() { }

    /**
     * 获取数据
     * @param name data目录下数据名称 
     */
    public get(name: string) {
        const item = this._data[name];
        if (item === undefined) {
            throw new Error(`${this._name} database not find ${name}.`);
        }
        return item;
    }

}