import { _decorator, resources, Node, Asset, error, Constructor, Prefab, instantiate, TextAsset, JsonAsset, Texture2D, EffectAsset, AudioClip, AnimationClip, ImageAsset, SpriteFrame, SpriteAtlas, Mesh, Material, Skeleton, SceneAsset, Vec3, director } from 'cc';
import { Msg } from '../msg/msg';

/**
 * 资源模块
 */
export class Res {

    /** 待加载数量 */
    public static count: number = 0;

    /** 常规加载 */
    public static load<T extends Asset>(path: string, type: Constructor<T> | null, cb?: (err: Error | null, asset?: T | null) => void) {
        this.count++;
        resources.load(path, type, function (err, res) {
            if (err) {
                error(`--->加载资源出错,path:${path},err:${JSON.stringify(err)}`);
                Msg.emit('msg_res_error');
            }
            if (cb) {
                cb(err, res);
            }
            Res.count--;
            Msg.emit('msg_check_res_cache_end');
        });
    }

    /** 加载JSON */
    public static loadJson(path: string, cb?: (err: Error | null, asset?: JsonAsset | null) => void) {
        this.load(path, JsonAsset, cb);
    }

    /** 加载TXT */
    public static loadTxt(path: string, cb?: (err: Error | null, asset?: TextAsset | null) => void) {
        this.load(path, TextAsset, cb);
    }

    /** 加载预制体 */
    public static loadPrefab(path: string, cb?: (err: Error | null, asset?: Prefab | null) => void) {
        this.load(path, Prefab, cb);
    }

    /** 加载Texture2D */
    public static loadTex2D(path: string, cb?: (err: Error | null, asset?: Texture2D | null) => void) {
        this.load(path, Texture2D, cb);
    }

    /** 加载ImageAsset */
    public static loadImage(path: string, cb?: (err: Error | null, asset?: ImageAsset | null) => void) {
        this.load(path, ImageAsset, cb);
    }

    /** 加载SpriteFrame */
    public static loadSprite(path: string, cb?: (err: Error | null, asset?: SpriteFrame | null) => void) {
        this.load(path, SpriteFrame, cb);
    }

    /** 加载SpriteAtlas */
    public static loadSpriteAtlas(path: string, cb?: (err: Error | null, asset?: SpriteAtlas | null) => void) {
        this.load(path, SpriteAtlas, cb);
    }

    /** 加载EffectAsset */
    public static loadEffect(path: string, cb?: (err: Error | null, asset?: EffectAsset | null) => void) {
        this.load(path, EffectAsset, cb);
    }

    /** 加载音频文件 */
    public static loadAudio(path: string, cb?: (err: Error | null, asset?: AudioClip | null) => void) {
        this.load(path, AudioClip, cb);
    }

    /** 加载动画切片 */
    public static loadAnimationClip(path: string, cb?: (err: Error | null, asset?: AnimationClip | null) => void) {
        this.load(path, AnimationClip, cb);
    }

    /** 加载Mesh */
    public static loadMesh(path: string, cb?: (err: Error | null, asset?: Mesh | null) => void) {
        this.load(path, Mesh, cb);
    }

    /** 加载材质 */
    public static loadMateiral(path: string, cb?: (err: Error | null, asset?: Material | null) => void) {
        this.load(path, Material, cb);
    }

    /** 加载骨骼 */
    public static loadSkeleton(path: string, cb?: (err: Error | null, asset?: Skeleton | null) => void) {
        this.load(path, Skeleton, cb);
    }

    /** 加载场景 */
    public static loadScene(path: string, cb?: (err: Error | null, asset?: SceneAsset | null) => void) {
        this.load(path, SceneAsset, cb);
    }

    /**
     * 实例化
     * @param asset 预制体 
     * @param root 挂载节点，为空则挂在根节点
     * @param pos 预制体位置
     * @returns 预制体节点
     */
    public static inst(asset: Prefab, root: Node | undefined = undefined, pos: Vec3 = Vec3.ZERO): Node {
        const instObj = instantiate(asset);
        if (root === undefined) {
            director.getScene()?.addChild(instObj);
        } else {
            instObj.setParent(root);
        }
        instObj.setPosition(pos);
        instObj.setScale(Vec3.ONE);
        return instObj;
    }

    /**
     * 克隆节点
     * @param node 源节点 
     * @param root 挂载节点，为空则挂在根节点
     * @param pos 克隆节点位置
     * @returns 克隆节点
     */
    public static instNode(node: Node, root: Node | undefined = undefined, pos: Vec3 = Vec3.ZERO): Node {
        const instObj = instantiate(node);
        if (root === undefined) {
            director.getScene()?.addChild(instObj);
        } else {
            instObj.setParent(root);
        }
        instObj.setPosition(pos);
        instObj.setScale(Vec3.ONE);
        return instObj;
    }

    /** 加载目标文件夹中的所有资源, 注意：路径中只能使用斜杠，反斜杠将停止工作 */
    public static loadDir<T extends Asset>(path: string, type: Constructor<T> | null, cb?: (err: Error | null, asset?: T[] | null) => void) {
        this.count++;
        resources.loadDir(path, type, function (err, res) {
            if (err) {
                error(err.message || err);
                Msg.emit('msg_res_error');
            }
            if (cb) {
                cb(err, res);
            }
            Res.count--;
            Msg.emit('msg_check_res_cache_end');
        });
    }

    /** 加载目标文件夹中的所有JSON资源 */
    public static loadDirJson(path: string, cb?: (err: Error | null, asset?: JsonAsset[] | null) => void) {
        this.loadDir(path, JsonAsset, cb);
    }

    /** 加载目标文件夹中的所有预制体资源 */
    public static loadDirPrefab(path: string, cb?: (err: Error | null, asset?: Prefab[] | null) => void) {
        this.loadDir(path, Prefab, cb);
    }

    /** 加载目标文件夹中的所有Text资源 */
    public static loadDirText(path: string, cb?: (err: Error | null, asset?: TextAsset[] | null) => void) {
        this.loadDir(path, TextAsset, cb);
    }

    /** 加载目标文件夹中的所有SpriteFrame资源 */
    public static loadDirSprite(path: string, cb?: (err: Error | null, asset?: SpriteFrame[] | null) => void) {
        this.loadDir(path, SpriteFrame, cb);
    }

    /** 加载目标文件夹中的所有音频资源 */
    public static loadDirSound(path: string, cb?: (err: Error | null, asset?: AudioClip[] | null) => void) {
        this.loadDir(path, AudioClip, cb);
    }

}
