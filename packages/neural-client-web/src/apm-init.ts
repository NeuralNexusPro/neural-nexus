// APM 2.0前端接入文档：https://confluence.enncloud.cn/pages/viewpage.action?pageId=787187418

export function apmInit(
  consoleError?: boolean,
  /**
   * 是否上报Vue错误
   */
  vueError?: boolean,
  vue?: any
) {
  const options = {
    /**
     * 发布平台的租户ID
     * 1369923265280311297 # 新奥新智
     * 1387330602944675842 # 新奥数能
     * 1384342759875670018 # 新奥股份
     */
    pageId: import.meta.env.VITE_MONITOR_PAGEID, // 前端应用id（需要填 devops appcode）
    tenantId: import.meta.env.VITE_MONITOR_TENANTID, // 发布平台的租户ID，此ID对应的是发布平台用新奥新智租户发布的
    consoleError: consoleError ?? true,
    vueError: vueError ?? true, // 是否上报Vue错误
    vue: vue, // vue实例
    env: MonitorJS.EnnPROD // 上报错误地址
  };
  switch (import.meta.env.VITE_ENV) {
    case 'LOC':
      options.env = MonitorJS.EnnDEV;
      break;
    case 'DEV':
      options.env = MonitorJS.EnnDEV;
      break;
    case 'FAT':
      options.env = MonitorJS.EnnFAT;
      break;
    case 'UAT':
      options.env = MonitorJS.EnnUAT;
      break;
    case 'PRO':
      options.env = MonitorJS.EnnPROD;
      break;
  }
  new MonitorJS().init(options);
  window.dispatchEvent(new CustomEvent('apm-init-end'));
}
