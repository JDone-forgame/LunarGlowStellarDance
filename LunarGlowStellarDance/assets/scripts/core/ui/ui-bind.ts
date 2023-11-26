import { Node } from "cc";
import { Bind } from "../../logic/data/bind";
import { LocalLabel } from "../localization/local-label";
import { UtilNode } from "../util/util";
import { UICom } from "./ui-com";

/** UI连接类 */
export class UIBind {

    private static _map: { [com: string]: (node: Node) => UICom } = {};

    public static init() { }

    public static on(name: string, com: (node: Node) => UICom) {
        this._map[name] = com;
    }

    /** 此方法用于获取节点和绑定的用户类 */
    public static get(node: Node): UICom[] {

        var children = UtilNode.getChildren(node);
        var comList: UICom[] = [];

        for (let i = 0; i < children.length; i++) {
            const tempi = children[i];

            // Bind local key.
            if (tempi.name.includes('local_')) {
                tempi.addComponent(LocalLabel);
            }

            if (this._map[tempi.name]) {
                // Bind key
                const key = tempi.name;
                const com = this._map[key];
                if (com !== undefined) {
                    comList.push(this._map[key](tempi));
                    continue;
                }
            }
            if (Bind.Instance.hasBind(tempi.name)) {
                // Bind type
                const type = tempi.name.slice(0, 3);
                const comType = this._map[type];
                if (comType) {
                    comList.push(comType(tempi));
                }
            }
        }

        return comList;
    }

}