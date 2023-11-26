const CAPACITY: number = 10;


/** 堆栈（先进后出） */
export class Stack<T> {

    private _elements: Array<T>;
    private _size: number;

    public constructor(capacity: number = CAPACITY) {
        this._elements = new Array<T>(capacity);
        this._size = 0;
    }

    /** 添加操作 */
    public push(o: T) {
        var len = this._elements.length;
        if (this._size > len) {
            let temp = new Array<T>(len);
            this._elements = this._elements.concat(temp);
        }
        this._elements[this._size++] = o;
    }

    /** 返回最后加入的操作 */
    public cur() {
        return this._elements[this._size - 1];
    }

    /** 返回最后加入的操作(会从堆栈中移除) */
    public pop() {
        return this._elements[--this._size];
    }

    /** 返回最后加入的操作 */
    public peek() {
        return this._elements[this._size - 1];
    }

    /** 返回当前堆栈长度 */
    public size(): number {
        return this._size;
    }

    /** 堆栈是否为空 */
    public empty(): boolean {
        return this._size === 0;
    }

    /** 清空堆栈 */
    public clear(capacity: number = CAPACITY) {
        delete this._elements;
        this._elements = new Array(capacity);
        this._size = 0;
    }

}

/** 队列（先进先出） */
export class Queue<T> {
    private _elements: Array<T>;
    private _size: number | undefined;

    /**
     * @param capacity 队列容量,超过容量后的加入将会移除队列最先添加的操作
     */
    public constructor(capacity?: number) {
        this._elements = new Array<T>();
        this._size = capacity;
    }

    /** 添加操作 */
    public push(o: T): boolean {
        if (o === null) {
            return false;
        }

        if (this._size !== undefined && !isNaN(this._size)) {
            if (this._elements.length === this._size) {
                this.pop();
            }
        }

        this._elements.unshift(o);
        return true;
    }

    /** 移除并返回队列中最后的操作 */
    public pop(): T {
        return this._elements.pop();
    }

    /** 获取当前队列长度 */
    public size(): number {
        return this._elements.length;
    }

    /** 队列是否清空 */
    public empty(): boolean {
        return this.size() === 0;
    }

    /** 清空队列 */
    public clear() {
        delete this._elements;
        this._elements = new Array<T>();
    }
}