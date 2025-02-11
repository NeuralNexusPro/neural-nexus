import { axios } from './http';
import sidemenu from './sidemenu';
import shellheader from './shellheader';
import toolssidemenu from './toolssidemenu';
import robssidemenu from './robssidemenu';

// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
export const sidemenuApi = sidemenu.getSideMenus();
// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
export const shellheaderApi = shellheader.getShellHeader();
// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
export const toolssidemenuApi = toolssidemenu.getSideMenus();
// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
export const robssidemenuApi = robssidemenu.getSideMenus();

export const getSideMenuServeData = async ({ cid = 'testId' }) => {
  let _menus = null;
  await axios.get('/api/mocks/sidemenu.json').then(res => {
    _menus = res.data;
  });
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  return _menus.sidemenus;
};