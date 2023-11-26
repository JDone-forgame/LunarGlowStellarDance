/** Function方法 */
export class fun {

    /**
     * 延迟执行
     * @param f 函数
     * @param time 延迟时间（秒）
     */
    public static delay(f: Function, time: number) {
        setTimeout(f, time * 1000);
    }

}