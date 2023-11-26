import { DataSound } from "../../logic/data/data-sound";
import { DataGame } from "./data-game";
import { DataPool } from "./data-pool";

export const DataSoundInst = new DataSound();
export const DataGameInst = new DataGame();
export const DataPoolInst = new DataPool();

/** 所有数据初始化 */
export function Init() {
    DataSoundInst.init('data-sound');
    DataGameInst.init('data-game');
    DataPoolInst.init('data-pool');
}