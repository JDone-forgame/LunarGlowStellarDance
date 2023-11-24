/**
 * auto generate by JDone
 */

/**
 * SeResChapterConfig generate by JDone 
 */
export interface SeResChapterConfig{ 
      iId:number;
      sName:string;
}


/**
 * SeResStageConfig generate by JDone 
 */
export interface SeResStageConfig{ 
      iId:number;
      sName:string;
}


/**
 * SeResRetInterface generate by JDone 
 */
export interface SeResRetInterface{ 
      ChapterConfig:SeResChapterConfig;
      StageConfig:SeResStageConfig;
}


export type TSeResName = keyof SeResRetInterface;
export type TSeResNameRet<T extends TSeResName> = SeResRetInterface[T];
