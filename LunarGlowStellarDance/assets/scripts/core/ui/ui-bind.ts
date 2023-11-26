import { Node } from "cc";
import { Bind } from "../../logic/data/bind";
import { LocalLabel } from "../localization/local-label";
import { UtilNode } from "../util/util";
import { UICom } from "./ui-com";

export class UIBind {

    // User interface binding mapping.
    private static _map: { [com: string]: (node: Node) => UICom } = {};

    /**
     * Initialize the user interface binder.
     */
    public static init () { }

    public static on (name: string, com: (node: Node) => UICom) {
        this._map[name] = com;
    }

    /**
     * This method is used to detect and bind the nodes of the user interface.
     * @param node Binding nodes need to be detected.
     * @returns Array of components that have been bound.
     */
    public static get (node: Node): UICom[] {

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