import { _decorator, randomRangeInt } from 'cc';
const { ccclass, property } = _decorator;

/*
 *  Xn+1 =( A * Xn + C ) mod M
 *  随机模块
 */
@ccclass('GRandom')
export class GRandom {

    preValue: number = 0;
    seed: number = 0;
    c = 49297;
    a = 9301;
    m = 233280;//0x07ffff;

    constructor(seed: number = -1) {
        this.seed = seed;
        if (this.seed === -1) this.seed = randomRangeInt(0, 0xffffffff);
        this.preValue = this.seed;
    }

    reset() {
        this.preValue = this.seed;
    }

    /** 获取伪随机数 */
    value() {
        // 前值=(a*前值+c)取余m
        this.preValue = (this.a * this.preValue + this.c) % this.m;
        return this.preValue
    }

    /** 取[0,1000]区间伪随机数 */
    get value1000() {
        return this.range(0, 1000);
    }

    /** 取[min,max]区间伪随机数 */
    range(min: number, max: number): number {
        var v = min + (this.value() % (max - min + 1))
        return v;
    }

    /** 临时乘以1000后取[min,max]区间伪随机数,再除以1000向下取整*/
    range1000(min: number, max: number) {
        var ret = this.range(min * 1000, max * 1000);
        return Math.floor(ret / 1000);
    }
}

