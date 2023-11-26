import { Director, director, find, instantiate, Node, Prefab, resources, Scene, warn } from "cc";
import { Msg } from "../msg/msg";
import { ILoadMsg } from "../../logic/ui/ui-loading";
import { ResCache } from "../res/res-cache";

/** 场景管理 */
export class GScene {

    /** 正在加载场景 */
    public static isLoadScene = false;
    /** 是预加载 */
    public static isPreload = false;

    public static msg: ILoadMsg = {
        id: 100,
        action: 'load scene',
        current: '',
        wait_count: 1,
        count: 1,
    }


    /** 加载场景 */
    public static Load(name: string, onload: () => void) {
        GScene.isLoadScene = true;

        // 使用加载页面
        // this.msg.current = name;
        // this.msg.wait_count = 1;
        // this.msg.count = 1;
        // Msg.emit('msg_loading', this.msg);


        director.loadScene(name, async (error: Error | null, scene?: Scene) => {
            if (error) {
                throw new Error(`--->加载场景:${name}错误`);
            }
            if (scene) {
                onload();
                GScene.isLoadScene = false;
                ResCache.Instance.removeLoad();

                // this.msg.count--;
            } else {
                warn(`--->加载场景:${name}错误,无法加载`);
            }
        });
    }

}