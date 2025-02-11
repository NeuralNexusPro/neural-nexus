import { ElMessage } from 'element-plus';
import Axios from 'axios';

const BASE_URL = import.meta.env.VITE_baseURL;

// axios
function createAxios(config: any) {
  const instance = Axios.create({
    ...config,
    headers: {
      ...(config ? config.headers : {}),
    },
  });

  instance.interceptors.request.use(config => {
    if (config?.headers) {
      // config.headers.auth = config.headers?.auth || auth.getAuth()!;
    }
    return config;
  });

  instance.interceptors.response.use(
    function (response) {
      const { data, config } = response;
      // 非正常的返回值
      if (data?.resultCode && data.resultCode !== 0) {
        const errorMsg = data?.resultMessage || '服务异常';
        // @ts-expect-error TS(2339)
        if (!config?.silence) {
          ElMessage.error(errorMsg);
        }
        return Promise.reject({
          code: -1,
          resultMessage: errorMsg,
        });
      }
      return response.data;
    },
    async function ({ config, ElMsgToast: errMsg, response }) {
      const { status, data } = response || {};
      let errorMsg = errMsg;
      if (status === 500) {
        errorMsg = '服务异常';
      } else if (status === 403) {
        // 如果是参与者中心鉴权，会自动拦截该状态码并跳转；
        // 非项目内账号会自动登录，鉴权失败，循环；
        // EnnAuth.logout();

        return Promise.reject({
          code: -1,
          resultMessage: '未登录',
        });
      } else if (status === 404) {
        return Promise.reject({
          code: -1,
          resultMessage: '请求的资源不存在',
        });
      } else if (data && data.resultMessage) {
        // 后端统一错误信息字段
        errorMsg = data.resultMessage;
      }

      if (!config?.silence) {
        ElMsgToast.error(errorMsg);
      }

      return Promise.reject({
        code: -1,
        data: null,
        resultMessage: errorMsg,
      });
    }
  );

  return instance;
}

export default createAxios;

export const axios = createAxios({ baseURL: BASE_URL });
