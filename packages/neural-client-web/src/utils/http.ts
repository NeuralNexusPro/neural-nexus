export const Fetch = (url: any, params: any) => {
  return fetch(url, {
    ...params,
    headers: {
      // 参与者中心网关统一接入；
      'X-GW-AccessKey': process.env.VITE_X_GW_ACCESSKEY,
      'Content-Type': 'application/json;charset=utf-8',
      ennUnifiedCsrfToken: localStorage.getItem('ennUnifiedCsrfToken') || '',
      ennUnifiedAuthorization: localStorage.getItem('ennUnifiedAuthorization') || '',
      'grant-code': localStorage.getItem('originGrantCode') || '',
      ...params?.headers,
    },
    mode: 'cors',
  }).then(response => {
    if (response.status === 403) {
      // return auth.logout();
      console.log('403');
    }
    return response.json();
  });
};
