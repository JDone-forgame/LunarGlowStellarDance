import { _decorator, Component, director, Node } from 'cc';
import { ResMgr } from './ResMgr';
const { ccclass, property } = _decorator;

@ccclass('SceneMgr')
export class SceneMgr extends Component {
    public static Instance: SceneMgr = null;

    protected onLoad(): void {
        if(SceneMgr.Instance !== null) {
            this.destroy();
            return;
        }

        SceneMgr.Instance = this;


    }

    public Init(): void {

    }
    
    public EnterScene(sceneName: string): void {
        director.loadScene(sceneName);
    }

    public async IE_RunScene(sceneName: string, scenesBundleName: string = "Scenes") {
        var sceneData = await ResMgr.Instance.IE_GetScene(scenesBundleName, sceneName) as any;
        director.runSceneImmediate(sceneData);
    }
}


