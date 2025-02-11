import { ElMessage, ElNotification, ElMessageBox } from 'element-plus';
import { UI } from '@neural-nexus/neural-client-runtime';

import store from '@/store/index';

export default class PCUI implements UI {
  openToast(params: any) {
    console.log('openToast', params);
    const { message, type } = params;

    ElMessage({
      message,
      type,
    });
  }
  openNotification(params: any) {
    // const { url = 'https://ecm.ennew.com', pcUrl } = params;
    const { url, pcUrl } = params;
    let onClick = params.onClick || (() => {});
    if (pcUrl) {
      onClick = () => {
        store.dispatch('openOuterPage', { url: pcUrl });
      };
    } else {
      if (url) {
        onClick = () => store.dispatch('openOuterPage', { url });
      }
    }
    ElNotification({
      ...params,
      onClick,
    });
  }
  openDialog(params: any) {
    const { onSuccess, onFail, type, title, message, confirmText, cancelText, ...otherParams } = params;
    ElMessageBox.confirm(message, title, {
      ...otherParams,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      type,
    })
      .then(onSuccess)
      .catch(onFail);
  }
}
