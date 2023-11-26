
import { _decorator, JsonAsset, Prefab, TextAsset, SpriteFrame, AudioClip, v3, Vec3, log, error } from 'cc';
import { Singleton } from '../pattern/singleton';
import { Res } from './res';
import { ILoadMsg } from '../../logic/ui/ui-loading';
import { Msg } from '../msg/msg';
const { ccclass, property } = _decorator;

/** 资源缓存模块 */
@ccclass('ResCache')
export class ResCache extends Singleton {

    private _json: { [name: string]: JsonAsset } = {};
    private _prefab: { [name: string]: Prefab } = {};
    private _txt: { [name: string]: TextAsset } = {};
    private _sprite: { [name: string]: SpriteFrame } = {};
    private _sound: { [name: string]: AudioClip } = {};
    private _callback: Function | undefined;

    msg: ILoadMsg | undefined;

    /** 加载 data-res-cache.json 配置中的资源 */
    public async load(callback: Function) {
        this._callback = callback;

        log(`--->开始加载 data-res-cache.json 配置中的资源`);

        // 监听资源加载完毕消息
        Msg.on('msg_check_res_cache_end', this.checkEnd.bind(this));

        Res.loadJson('data/data-res-cache', async (err, asset) => {
            if (err) {
                error(`--->加载 data-res-cache 资源错误：${JSON.stringify(err)}`);
                return;
            }
            this.msg = {
                id: 1,
                action: 'load cache',
                current: 'resource',
                wait_count: 1,
                count: 1
            }

            if (!asset || !asset.json) {
                error(`--->加载 data-res-cache 资源错误,资源为空：${JSON.stringify(asset)}`);
                return;
            }

            const jsonPrefab = asset.json['prefab'];
            if (jsonPrefab) ResCache.Instance.loadPrefab(jsonPrefab);
            ResCache.Instance.loadJson(asset.json['json']);
            ResCache.Instance.loadSprite(asset.json['sprite']);
            ResCache.Instance.loadSound(asset.json['sound']);

            // 发送资源加载消息
            Msg.emit('msg_loading', this.msg);
        });
    }

    public addLoad() {
        this.msg!.wait_count++;
        this.msg!.count++;
        log(`--->增加加载数量,当前加载数量:${this.msg?.count},待加载数量:${this.msg?.wait_count}`);
    }

    public removeLoad() {
        this.msg!.wait_count--;
        log(`--->移除待加载数量,当前加载数量:${this.msg?.count},待加载数量:${this.msg?.wait_count}`);
    }

    /** 获取缓存资源中的JSON */
    public getJson(name: string) {
        const ret = this._json[name];
        if (ret) {
            return ret;
        } else {
            error(`--->资源缓存中没有找到该名字:${name}的json资源`);
            return null;
        }
    }

    /** 获取缓存资源中的Prefab */
    public getPrefab(name: string) {
        const ret = this._prefab[name];
        if (ret) {
            return ret;
        } else {
            error(`--->资源缓存中没有找到该名字:${name}的prefab资源`);
            return undefined;
        }
    }

    /** 获取缓存资源中的Text */
    public getTxt(name: string) {
        const ret = this._txt[name];
        if (ret) {
            return ret;
        } else {
            error(`--->资源缓存中没有找到该名字:${name}的text资源`);
        }
    }

    /** 获取缓存资源中的Sprite */
    public getSprite(name: string) {
        const ret = this._sprite[name];
        if (ret !== undefined) {
            return ret;
        } else {
            error(`--->资源缓存中没有找到该名字:${name}的sprite资源`);
        }
    }

    /** 获取缓存资源中的Sound */
    public getSound(name: string) {
        const ret = this._sound[name];
        if (ret !== undefined) {
            return ret;
        } else {
            error(`--->资源缓存中没有找到该名字:${name}的sound资源`);
        }
    }

    /** 设置JSON文件进资源缓存 */
    public setJson(asset: any[]) {
        asset.forEach(element => {
            this._json[element.name] = element;
        });
    }

    /** 设置Prefab文件进资源缓存 */
    public setPrefab(asset: any[]) {
        asset.forEach(element => {
            this._prefab[element.name] = element;
        });
    }

    /** 设置Text文件进资源缓存 */
    public setText(asset: any[]) {
        asset.forEach(element => {
            this._txt[element.name] = element;
        });
    }

    /** 设置Sprite文件进资源缓存 */
    public setSprite(asset: any[]) {
        asset.forEach(element => {
            this._sprite[element.name] = element;
        });
    }

    /** 设置Sound文件进资源缓存 */
    public setSound(asset: any[]) {
        asset.forEach(element => {
            this._sound[element.name] = element;
        });
    }

    /** 加载路径中的所有JSON资源到资源缓存中 */
    public loadJson(paths: string[]) {
        paths.forEach(element => {
            this.addLoad();
            Res.loadDirJson(element, (err, asset) => {
                if (asset) {
                    ResCache.Instance.setJson(asset);
                    this.removeLoad();
                }
            });
        });
    }

    /** 加载路径中的所有Prefab资源到资源缓存中 */
    public loadPrefab(paths: string[]) {
        paths.forEach(element => {
            this.addLoad();
            Res.loadDirPrefab(element, (err, asset) => {
                if (asset) {
                    ResCache.Instance.setPrefab(asset);
                    this.removeLoad();
                }
            });
        });
    }

    /** 加载路径中的所有Text资源到资源缓存中 */
    public loadText(paths: string[]) {
        paths.forEach(element => {
            this.addLoad();
            Res.loadDirText(element, (err, asset) => {
                if (asset) {
                    ResCache.Instance.setText(asset);
                    this.removeLoad();
                }
            })
        });
    }

    /** 加载路径中的所有Sprite资源到资源缓存中 */
    public loadSprite(paths: string[]) {
        paths.forEach(element => {
            this.addLoad();
            Res.loadDirSprite(element, (err, asset) => {
                if (asset) {
                    ResCache.Instance.setSprite(asset);
                    this.removeLoad();
                }
            })
        });
    }

    /** 加载路径中的所有Sound资源到资源缓存中 */
    public loadSound(paths: string[]) {
        paths.forEach(element => {
            this.addLoad();
            Res.loadDirSound(element, (err, asset) => {
                if (asset) {
                    ResCache.Instance.setSprite(asset);
                    this.removeLoad();
                }
            })
        });
    }

    /** 所有资源加载进资源缓存后 */
    public checkEnd(): void {
        if (this._callback) {
            if (Res.count <= 0) {
                this._callback();
                this._callback = undefined;
            }
        }
    }

}
