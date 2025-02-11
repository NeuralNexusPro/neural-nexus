import Axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { get as getGlobalVars } from "@/utils/global";

// axios
function createAxios(config?: AxiosRequestConfig): AxiosInstance {
  // const envVars = getGlobalVars().envVars;
  // console.log(envVars, "envVars");
  const instance = Axios.create({
    ...config,
    headers: {
      // 参与者中心网关统一接入；
      "X-GW-AccessKey": "", //TODO: get accessKey
      ...(config ? config.headers : {}),
    },
  });

  instance.interceptors.request.use((config) => {
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
        const errorMsg = data?.resultMessage || "服务异常";
        if (!(config as unknown as { silence: boolean })?.silence) {
          console.error(errorMsg);
        }
        return Promise.reject({
          code: -1,
          resultMessage: errorMsg,
        });
      }
      return response.data;
    },
    async function ({ config, message: errMsg, response }) {
      const { status, data } = response || {};
      let errorMsg: string = errMsg;
      if (status === 500) {
        errorMsg = "服务异常";
      } else if (status === 403) {
        // 如果是参与者中心鉴权，会自动拦截该状态码并跳转；
        // 非项目内账号会自动登录，鉴权失败，循环；
        // EnnAuth.logout();

        return Promise.reject({
          code: -1,
          resultMessage: "未登录",
        });
      } else if (status === 404) {
        return Promise.reject({
          code: -1,
          resultMessage: "请求的资源不存在",
        });
      } else if (data && data.resultMessage) {
        // 后端统一错误信息字段
        errorMsg = data.resultMessage;
      }

      if (!config?.silence) {
        console.error(errorMsg);
      }

      return Promise.reject({
        code: -1,
        data: null,
        resultMessage: errorMsg,
      });
    },
  );

  return instance;
}

export default createAxios;

// baseurl

export const Fetch = (
  url: string,
  params?: { method?: string; baseURL?: string; headers?: { [key: string]: any }; body?: string },
) => {
  const global = getGlobalVars();
  const envVars = global.envVars;
  console.log(envVars, "envVars");
  const baseURLFetch = params?.baseURL;
  return fetch(`${baseURLFetch}${url}`, {
    ...params,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    mode: "cors",
  }).then((response: any) => {
    if (response.status === 403) {
      // return auth.logout(); //TODO: logout
    }
    return response.json();
  });
};
// iop fetch
