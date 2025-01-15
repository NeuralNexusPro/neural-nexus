import Reconciler from "./base/reconciler";
import IframeReconciler from "./iframe";
import MicroAppReconciler from "./mirco-app";
import QiankunReconciler from "./qiankun";


export * from "./base/reconciler";
export * from "./iframe";
export * from "./mirco-app";
export * from "./qiankun";
export * from './message';

export default Reconciler;
export {
  IframeReconciler,
  MicroAppReconciler,
  QiankunReconciler
}