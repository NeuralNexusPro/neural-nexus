interface EnvDataType {
  baseUrl: string;
  pureBackApi: string;
  APP_ID: string;
  APP_ENV: string;
  accessKey: string;
  backApi: string;
  accessKeyTwo: string;
  appUrl: string;
}

const EnvData: EnvDataType = {
  baseUrl: import.meta.env.VITE_baseUrl as string,
  APP_ID: import.meta.env.VITE_APP_ID as string,
  APP_ENV: import.meta.env.VITE_APP_ENV as string,
  accessKey: import.meta.env.VITE_GW_ACCESSKEY as string,
  backApi: import.meta.env.VITE_baseUrl_backApi as string,
  accessKeyTwo: import.meta.env.VITE_GW_KEY_two as string,
  pureBackApi: import.meta.env.VITE_baseUrl_pureBackApi as string,
  appUrl: import.meta.env.VITE_APP_url as string,
};

export default EnvData;
