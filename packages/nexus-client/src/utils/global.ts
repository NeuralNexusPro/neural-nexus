// import { deepFreeze } from "@utils/common";
import { produce } from "immer";
/* 
  @desc 项目中全局变量的存储和修改，不会涉及渲染。
  比如来自父应用的透传，当前项目的全局变量。
 */

let globalVars: { [key: string]: any } = {
  basename: undefined,
  chat: {
    lastResult: "",
  },
  audio: {
    audioGenSocket: undefined,
    baseAudio: undefined,
    sessionId: "",
  },
};

const set = (callback: (props: any) => any) => {
  globalVars = produce(globalVars, callback);
};

const get = () => Object.assign({}, globalVars);

const clear = () => (globalVars = {});

export { get, set, clear };
