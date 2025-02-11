/* eslint-disable no-unused-expressions */
/* eslint-disable no-case-declarations */
import { HACK_CARD_CODE_BASE_URL } from '@/const';
import dayjs from 'dayjs';

export const getQuery = (query: any) => {
  const { search } = window.location;
  const params = new URLSearchParams(search.slice(1));
  return params.get(query);
};

export const templateReplace = (template: string, data: Record<string, string>) => {
  if (!template) return '';
  const text = typeof template === 'string' ? template : String(template);
  return text.replace(/\$\{(\w+)\}/g, function (_match, key) {
    return data[key] || '';
  });
};

export const appendUrlQuery = (url: any, queryObj: any) => {
  try {
    const urlObj = new URL(url);
    const hash = urlObj.hash;

    const query = Object.entries(queryObj)
      // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    if (hash) {
      hash.indexOf('?') > 0 ? (urlObj.hash += `&${query}`) : (urlObj.hash = `?${query}`);
    } else {
      urlObj.search ? (urlObj.search += `&${query}`) : (urlObj.search = `?${query}`);
    }

    return urlObj.toString();
  } catch {
    return url;
  }
};
// 给iframe嵌入的地址url统一加上参与者中心所需的鉴权参数
export const appendAuthParams = (url: any) => {
  const authParams = {
    ennUnifiedCsrfToken: localStorage.getItem('ennUnifiedCsrfToken'),
    ennUnifiedAuthorization: localStorage.getItem('ennUnifiedAuthorization'),
    authCode: localStorage.getItem('originGrantCode'),
    authTenantId: localStorage.getItem('originTenantId'),
  };
  return appendUrlQuery(url, authParams);
};
// 将菜单配置转换为绝对url字符串,方便one-portal嵌入,这里统一转换成iframe嵌入,不适用微前端方式

// 将iop配置端的菜单结构转换成one-portal能识别的页面结构
export const transformMenuToPage = (menu: any) => {
  const page = {
    id: menu.key,
    type: 'link',
    name: menu.name,
    icon: menu?.icon,
    iconSvg: menu?.iconSvg,
    path: menu.path,
    depth: menu.level,
    isLeaf: !Array.isArray(menu.children) || menu.children.length === 0,
    collected: false,
    openType: menu.openMethod, // 0 当前页面打开 1 新窗口打开
    childrens: (menu?.children || []).map((v: any) => transformMenuToPage(v)),
  };
  return page;
};
// 标记菜单是否被收藏
export const singCollected = (source: any, collected: any) => {
  // 如果没有收藏,则不改变源菜单
  if (!Array.isArray(collected) || collected.length === 0) {
    return;
  }
  source.forEach((v: any) => {
    if (collected.find(k => k.id === v.id)) {
      v.collected = true;
    }
    singCollected(v.childrens, collected);
  });
};
// 找到所有的叶子节点菜单，并拍平数组
export const getLeafMenus = (menus: any) => {
  const result: any[] = [];
  const stack = [...menus];
  while (stack.length) {
    const top = stack.shift();
    if (top.isLeaf) {
      result.push(top);
    }
    if (top.childrens.length) {
      stack.unshift(...top.childrens);
    }
  }
  return result;
};
// 根据id找到对应菜单,深度遍历
export const findMenuById = (menus: any, id: any) => {
  const stack = [...menus];
  while (stack.length) {
    const top = stack.pop();
    if (top.id === id) {
      return top;
    }
    if (top?.childrens?.length) {
      stack.push(...top.childrens);
    }
  }
  return null;
};
// 根据叶子结点菜单名称过滤菜单树
export const filterMenuByName = (menus: any, text: string) => {
  // 没有过滤的字段,直接返回原菜单
  if (!text) {
    return menus;
  }
  const result: any[] = [];
  for (const menu of menus) {
    // 如果是叶子结点只需要判断名称是否包含过滤文本即可
    if (menu.isLeaf) {
      if (menu.name.includes(text)) {
        result.push(menu);
      }
    } else {
      // 如果是非叶子结点,则需要判断children中是否包含
      const childrens = filterMenuByName(menu.childrens || [], text);
      if (childrens.length > 0) {
        result.push({ ...menu, childrens });
      }
    }
  }
  return result;
};
// 发送自定义事件
export const dispatchCustomEvent = (eventName: any, data: any) => {
  const event = new CustomEvent(eventName, { detail: { data } });
  document.body.dispatchEvent(event);
};

// 任务、通知、公告发生的时间，使用动态时间制度
export const compareInnerDate = timeStr => {
  const now = new Date();
  const time = new Date(timeStr);
  const diff = (now.getTime() - time.getTime()) / 1000; // 毫秒转秒

  // 一分钟以内
  if (diff < 60) return '现在';
  // 一到三分钟
  if (diff < 180) return '刚刚';
  // 一小时以内
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  // 五小时以内
  if (diff < 18000) return `${Math.floor(diff / 3600)}小时前`;
  // 当天
  if (now.getDate() === time.getDate()) {
    const [hour, minute] = [time.getHours(), time.getMinutes()].map(num => num.toString().padStart(2, '0'));
    return `${hour}:${minute}`;
  }
  // 昨天
  if (now.getDate() - time.getDate() === 1) {
    const [hour, minute] = [time.getHours(), time.getMinutes()].map(num => num.toString().padStart(2, '0'));
    return `昨天 ${hour}:${minute}`;
  }
  // 当年
  if (now.getFullYear() === time.getFullYear()) {
    const [month, day, hour, minute] = [time.getMonth() + 1, time.getDate(), time.getHours(), time.getMinutes()].map(num => num.toString().padStart(2, '0'));
    return `${month}-${day} ${hour}:${minute}`;
  }
  // 非当年
  const year = time.getFullYear().toString().substr(-2);
  const [month, day, hour, minute] = [time.getMonth() + 1, time.getDate(), time.getHours(), time.getMinutes()].map(num => num.toString().padStart(2, '0'));
  return `${year}-${month}-${day} ${hour}:${minute}`;
};
// 根据dateStr返回今天、昨天、近7天、近30天、30天以前
export const compareOuterDate = dateStr => {
  const todayLast = `${dayjs(new Date()).format('YYYY-MM-DD')} 23:59:59`;
  const todayLastStamp = dayjs(todayLast).valueOf();
  const time = dayjs(dateStr).valueOf();
  const diff = todayLastStamp - time;
  const oneDay = 24 * 60 * 60 * 1000;
  if (diff <= oneDay) {
    return '今天';
  } else if (diff <= 2 * oneDay) {
    return '昨天';
  } else if (diff <= 7 * oneDay) {
    return '近7天';
  } else if (diff <= 30 * oneDay) {
    return '近30天';
  } else {
    return '30天以前';
  }
};

export const getAppCode = () => {
  return getQuery('appCode') || window.localStorage.getItem('workbenchAppCode');
};

export const createHackCardCode = (code: string) => {
  return `${HACK_CARD_CODE_BASE_URL}/${code}`;
};
