export interface IVarData {
  [key: string]: any
}

export interface IGlobalVars {
  systemVars: IVarData,
  bizVars: IVarData,
}


export interface Tools {
  analysis(): Promise<void>;
  run(): Promise<void>;
  getGlobalVars(callback: (globalVars: IGlobalVars | IVarData) => void, namespace?: keyof IGlobalVars): void;
  setGlobalVars (globalVar: IVarData, namespace?: keyof IGlobalVars): void;
}