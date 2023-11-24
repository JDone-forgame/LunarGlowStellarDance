import { Component, Node, NodePool, Prefab, error, instantiate, warn } from 'cc';
import { ResMgr } from './ResMgr';

export class NodePoolMgr extends Component {
    public static Instance: NodePoolMgr = null!;

    private nodePools: Object = null!; // 节点池名字---》 NodePool
    
    protected onLoad(): void {
        if(NodePoolMgr.Instance !== null) {
            this.destroy();
            return;
        }

        NodePoolMgr.Instance = this;

        NodePool
    }

    public Init(): void  {
        this.nodePools = {};
    }

    public async AddNodePoolByPath(bundleName: string, assetPath: string, count: number = 0) {
        var poolName = bundleName + ":" + assetPath;
        if(this.nodePools[poolName]) {
            return;
        }

        var assetPrefab = await ResMgr.Instance.IE_GetAsset(bundleName, assetPath, Prefab);
        if(assetPrefab === null) {
            warn(poolName + "can not find!");
            return;
        }

        
        this.AddNodePool(poolName, assetPrefab as Prefab);
    }

    public AddNodePool(poolName: string, nodeOrPrefab: Node | Prefab, count: number = 0) {
        
        if(this.nodePools[poolName] || !nodeOrPrefab) {
            return;
        }

        var nodePool = new NodePool(poolName);
        this.nodePools[poolName] = nodePool;

        if(count <= 0) {
            count = 1;
        }

        for(var i = 0; i < count; i ++) {
            var item: Node = instantiate(nodeOrPrefab) as Node;
            nodePool.put(item);
        }
    }


    PutNodeByPath(bundleName: string, assetPath: string, node: Node): void {
        var poolName = bundleName + ":" + assetPath;
        this.PutNode(poolName, node);
    }

    PutNode(poolName: string, node: Node): void {
        
        if(!this.nodePools[poolName]) {
            return;
        }

        var nodePool = this.nodePools[poolName];
        nodePool.put(node);
    }

    GetNodeInPoolByPath(bundleName: string, assetPath: string): Node {
        var poolName = bundleName + ":" + assetPath;
        var item = this.GetNodeInPool(poolName);
        return item;
    }

    GetNodeInPool(poolName: string): Node {
        if(!this.nodePools[poolName]) {
            return null;
        }

        var nodePool = this.nodePools[poolName];
        var item = nodePool.get();
        if(nodePool.size() === 0) {
            nodePool.put(instantiate(item));
        }

        return item;
    }

    public DebugNodePoolInfoByPath(bundleName: string, assetPath: string): void {
        var poolName = bundleName + ":" + assetPath;
        this.DebugNodePoolInfo(poolName);
    }

    public DebugNodePoolInfo(poolName: string): void {

        if(!this.nodePools[poolName]) {
            return null;
        }

        var nodePool: NodePool = this.nodePools[poolName];
        console.log(poolName + "Node Pool has Object num " + nodePool.size());
    }

    public ClearAllNodeInPoolByPath(bundleName: string, assetPath: string): void {
        var poolName = bundleName + ":" + assetPath;
        this.ClearAllNodeInPool(poolName);
    }

    public ClearAllNodeInPool(poolName: string): void {
        
        if(!this.nodePools[poolName]) {
            return null;
        }

        var nodePool = this.nodePools[poolName];
        nodePool.clearAll();
    }
}


