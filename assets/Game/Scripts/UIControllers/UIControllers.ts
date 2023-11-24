import { _decorator, Component, EventTouch, instantiate, log, Node, Prefab } from 'cc';
import { EUIMainPage } from '../defines/UIDefines';
import { Popup1 } from './Prefabs/Popup1';
const { ccclass, property } = _decorator;

@ccclass('UIControllers')
export class UIControllers extends Component {

    @property({ type: Node, tooltip: "开始页面节点" })
    StartPage: Node = null;
    @property({ type: Node, tooltip: "游戏页面节点" })
    GamePage: Node = null;
    @property({ type: Node, tooltip: "加载页面节点" })
    LoadPage: Node = null;
    @property({ type: Node, tooltip: "流程图页面节点" })
    FlowChartPage: Node = null;
    @property({ type: Node, tooltip: "图鉴页面节点" })
    ViewPage: Node = null;
    @property({ type: Node, tooltip: "后日谈页面节点" })
    LaterPage: Node = null;
    @property({ type: Node, tooltip: "设置页面节点" })
    SetPage: Node = null;

    @property({ type: Node, tooltip: "弹窗节点" })
    PopPage: Node = null;
    @property({ type: Prefab, tooltip: "弹窗1预制体" })
    Pop1Prefab: Prefab = null;
    @property({ type: Prefab, tooltip: "弹窗2预制体" })
    Pop2Prefab: Prefab = null;


    @property({ type: Node, tooltip: "标题节点" })
    TitleNode: Node = null;

    start() {
        this.init();
    }

    update(deltaTime: number) {

    }

    /** 页面初始化 */
    init() {
        this.openMainPage(EUIMainPage.start);
        this.clearAllPop();
    }

    /** 开始页面按钮点击 */
    onStartPageBtnClick(event: EventTouch, cParam: any) {
        log(`--->按钮点击:cParam:${cParam}`);
        switch (Number(cParam)) {
            case 1:
                // 新游戏
                this.openMainPage(EUIMainPage.game);
                break;
            case 2:
                // 获取存档
                this.openCommonPop('该功能正在施工中...');
                break;
            case 3:
                // 继续游戏
                this.openCommonPop('该功能正在施工中...');
                break;
            case 4:
                // 流程图
                this.openCommonPop('该功能正在施工中...');
                break;
            case 5:
                // 鉴赏模式
                this.openCommonPop('该功能正在施工中...');
                break;
            case 6:
                // 后日谈
                this.openCommonPop('该功能正在施工中...');
                break;
            case 7:
                // 设置
                this.openMainPage(EUIMainPage.set);
                break;
            case 8:
                // 结束游戏
                this.openCommonPop('该功能正在施工中...');
                break;
            case 9:
                // 切换语言
                this.openCommonPop('该功能正在施工中...');
                break;
            case 10:
                // 切换标题
                this.openCommonPop('该功能正在施工中...');
                break;
        }
    }

    /** 打开弹窗 */
    openCommonPop(content: string) {
        this.clearAllPop();
        let node = instantiate(this.Pop1Prefab);
        node.getComponent(Popup1).setContent(content);
        this.PopPage.addChild(node);
    }

    /** 清除所有弹窗 */
    private clearAllPop() {
        if (this.PopPage) {
            this.PopPage.removeAllChildren();
        }
    }

    /** 开启某个主页面 */
    openMainPage(type: EUIMainPage) {
        for (let i = EUIMainPage.start; i <= EUIMainPage.set; i++) {
            if (i !== type) {
                let node = this.getMainPageNode(i);
                if (node) node.active = false;
            } else {
                let node = this.getMainPageNode(i);
                if (node) node.active = true;
            }
        }
    }

    /** 根据类型获取主页面节点 */
    private getMainPageNode(type: EUIMainPage) {
        switch (type) {
            case EUIMainPage.start: return this.StartPage;
            case EUIMainPage.game: return this.GamePage;
            case EUIMainPage.load: return this.LoadPage;
            case EUIMainPage.flowChart: return this.FlowChartPage;
            case EUIMainPage.view: return this.ViewPage;
            case EUIMainPage.later: return this.LaterPage;
            case EUIMainPage.set: return this.SetPage;
        }
    }
}


