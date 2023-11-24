import { _decorator, Component, Node } from 'cc';

export class EventMgr extends Component {
    public static Instance: EventMgr = null;

    private eventMap: any = null;  // {"eventName": [ {func: 回调的函数, caller: 函数里面的this}], "eventName": [], }

    protected onLoad(): void {
        if(EventMgr.Instance !== null) {
           this.destroy();
           return; 
        }    

        EventMgr.Instance = this;
    }

    public Init(): void {
        this.eventMap = {};
    }

    // func(eventName: string, udata: any)
    public AddEventListener(eventName: string, callback, caller): void {
        if(!this.eventMap[eventName]) {
            this.eventMap[eventName] = []; // [函数1()， 函数2(), ....]
        }

        var listeners = this.eventMap[eventName];
        var listenNode = {
            func: callback,
            self: caller, 
        };

        listeners.push(listenNode);
    }

    public RemoveEventListener(eventName: string, callback, caller): void {
        if(!this.eventMap[eventName]) {
            return;
        }

        var listeners: Array<any> = this.eventMap[eventName] as Array<any>;
        for(var i = 0; i < listeners.length; i ++) {
            if(listeners[i].func === callback && listeners[i].self === caller) {
                listeners.splice(i, 1);
                // i --;
                return;
            }
        }
    }

    public Emit(eventName: string, udata: any): void {
        if(!this.eventMap[eventName]) {
            return;
        }

        var listeners: Array<any> = this.eventMap[eventName] as Array<any>;
        for(var i = 0; i < listeners.length; i ++) {
            listeners[i].func.call(listeners[i].self, eventName, udata);
        }
    }
}


