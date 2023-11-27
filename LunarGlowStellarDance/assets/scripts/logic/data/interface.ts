/**
 * auto generate by JDone
 */

/**
 * SeResGameScene generate by JDone 
 */
export interface SeResGameScene { 
      iId: number;
      sNote: string;
      iSavePage: number;
      iBelongChapter: number;
      sBgm: string;
      sBgmState: string;
      sSoundFx: string;
      sBackground: string;
      sRoleId: string;
      sRolePostureId: string;
      sRoleExpressionId: string;
      sTalkName: string;
      sTalkContent: string;
      sTalkVoice: string;
      sSdId: string;
      sSdTime: string;
      sCRoleId: string;
      sCRolePostureId: string;
      sCRoleExpressionId: string;
      sCRolePos: string;
      asChoice: Array<string>;
      aiChoiceTo: Array<number>;
}


/**
 * SeResRetInterface generate by JDone 
 */
export interface SeResRetInterface { 
      GameScene: SeResGameScene;
}


export type TSeResName = keyof SeResRetInterface;
export type TSeResNameRet<T extends TSeResName> = SeResRetInterface[T];
