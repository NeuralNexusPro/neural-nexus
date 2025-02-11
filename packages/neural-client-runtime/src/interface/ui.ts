export enum MessageType {
  SUCCESS = "success",
  WARINING = "warning",
  ERROR = "error",
  INFO = "info",
}

export interface IToastOpts {
  type: MessageType;
  message: string;
}

export interface INotificationOpts {
  title: string;
  type: MessageType;
  message: string;
}

export interface IDialogOpts {
  title: string;
  type: MessageType;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onSuccess?: () => void;
  onFail?: () => void;
}

export interface UI {
/**
   * 添加面包屑标题
   * @param {*} toUrl 路由地址
   * @param {*} title 当前标题
   */
//  setBreadCrumbs ({ toUrl = '/', title = '示例详情页' }) {
//   store.dispatch('setBreadCrumbs', {
//     toUrl,
//     title
//   });
// }

// /**
//  * 设置面包屑是否隐藏
//  * @param {*} param0
//  */
// setBreadCrumbsIsShow ({ isShow = true }) {
//   store.dispatch('setBreadCrumbsIsShow', isShow);
// }

// /**
//  * 清空面包屑，保留第一个菜单
//  * @param {*} url 清空后，跳转到哪
//  */
// clearBreadCrumbs (url) {
//   store.dispatch('clearBreadCrumbs', url);
// }

openToast (params: IToastOpts): void;

/**
 * 打开通知，可以从四个角弹出
 * 里面的组件属性和饿了么一样
 * @param {*} params
 */
openNotification (params: INotificationOpts): void;

/**
 * 打开 Modal 弹窗
 * 里面的组件属性和饿了么一样
 * @param {*} params
 */
openDialog (params: IDialogOpts): void;

// /**
//  * 打开全屏的背景弹层
//  * @param {*} params
//  */
// openModalBg (params) {
//   store.dispatch('openModalBg', params).then(params.onSuccess).catch(params.onFail);
// }

// /**
//  * 指定跳转路径
//  */
// goBack (backObj) {
//   store.dispatch('goBack', { callback: backObj.callback || null, params: backObj.params || null });
// }
}