import { _decorator, Component, Node, director, find, gfx, sys, log } from 'cc';
import { ResCache } from '../../core/res/res-cache';
import { loadTextures } from '../../core/res/res-texture';
import { Game } from '../data/game';
const { ccclass, property } = _decorator;

/** 初始化模块 */
@ccclass('init')
export class init extends Component {
    start() {

        if (sys.isBrowser && director?.root?.device.gfxAPI == gfx?.API.WEBGL) {
            const panelNotSupport = find('init')?.getChildByName('canvas')?.getChildByName('ui_not_support');
            if (panelNotSupport) panelNotSupport.active = true;
            return;
        }

        log(`--->webgl 支持`);

        // 设置该节点为常驻节点
        director.addPersistRootNode(this.node);
        log(`--->设置${this.node.name}节点成为常驻节点`);

        // 加载缓存资源,结束后执行游戏初始化
        ResCache.Instance.load(async () => {
            log(`--->所有缓存资源加载结束`);
            console.time('loadTextures')
            await loadTextures();
            console.timeEnd('loadTextures')
            Game.Instance.init();
        });
    }

    update(deltaTime: number): void {
        Game.Instance.update(deltaTime);
    }
}


