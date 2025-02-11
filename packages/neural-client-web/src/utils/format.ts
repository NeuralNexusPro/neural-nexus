/**
 * 获取菜单叶子节点
 * @param {*} tree
 * @returns list
 */
export const getLastMenuList = function (t: any) {
  let list: any = [];
  const fitTree = function (tree: any) {
    if (tree && tree.length > 0) {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].isLastLevel) {
          list.push(tree[i]);
        } else {
          fitTree(tree[i].children);
        }
      }
    }
  };
  fitTree(t);
  return list;
};
/**
 * 拷贝多维数组
 * @param {*} source
 * @returns
 */
export const objDeepCopy = function (source: any) {
  const sourceCopy = source instanceof Array ? [] : {};
  for (const item in source) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
  }
  return sourceCopy;
};
/**
 * 获取显示的个数
 * @param {*} ids
 * @param {*} classnames
 * @returns
 */
export function getActiveDisplayItem(ids = 'rightMenu', classnames = 'hide') {
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  const menus = document.getElementById(ids).childNodes;
  const temp = [];
  Array.from(menus).map(item => {
    // @ts-expect-error TS(2339): Property 'classList' does not exist on type 'Child... Remove this comment to see the full error message
    !item.classList.contains(classnames) && temp.push(item);
  });
  return temp.length;
}
/**
 * 获取字符宽度
 * @param {*} strValue
 * @param {*} width
 * @returns
 */
export function getCharacterWidthTwo(strValue: any, width = 7) {
  let number = 0;
  for (let i = 0; i < strValue.length; i++) {
    const v = strValue.charAt(i);
    const code = v.charCodeAt();
    if (code >= 48 && code <= 57) {
      number += 1.2;
    } else if (code >= 65 && code <= 90) {
      number += 2;
    } else if (code >= 97 && code <= 122) {
      number += 1;
    } else {
      number += 2;
    }
  }
  return Math.ceil(number * width);
}
/**
 * 获取字符宽度
 * @param {*} text
 * @param {*} font
 * @returns
 */
// @ts-expect-error TS(7023): 'getCharacterWidth' implicitly has return type 'an... Remove this comment to see the full error message
export function getCharacterWidth(text: any, font = 'bold 14px PingFang SC, Microsoft YaHei, Arial, Helvetica Neue, Helvetica, sans-serif, Avenir, Hiragino Sans GB') {
  // @ts-expect-error TS(7022): 'canvas' implicitly has type 'any' because it does... Remove this comment to see the full error message
  const canvas = getCharacterWidth.canvas || (getCharacterWidth.canvas = document.createElement('canvas'));
  // @ts-expect-error TS(7022): 'context' implicitly has type 'any' because it doe... Remove this comment to see the full error message
  const context = canvas.getContext('2d');
  context.font = font;
  // @ts-expect-error TS(7022): 'metrics' implicitly has type 'any' because it doe... Remove this comment to see the full error message
  const metrics = context.measureText(text);
  return Math.ceil(metrics.width);
}
/**
 * 选中的菜单父级推算
 * @param {*} str
 * @returns
 */
export function menuCombination(str: any) {
  let temp = [];
  const arr = str.split('^'); // - ==> ^
  if (arr.length <= 1) {
    temp = arr;
  } else {
    for (let i = 0; i < arr.length - 1; i++) {
      let value = '';
      for (let j = 0; j <= i; j++) {
        value += `^${arr[j]}`; // - ==> ^
      }
      temp.push(value.substring(1));
    }
  }
  return temp;
}
/**
 * 打开的 tab id
 * @param {*} str
 * @returns
 */
export function TabId(str: any) {
  return str && str.split('-').slice(-1)[0];
}
/**
 * 对象ID 格式化
 * @param {*} obj
 */
export function ObjTabId(obj: any) {
  let temp = null;
  if (obj) {
    return temp;
  }
  temp = { ...obj, id: TabId(obj.id) };
  return temp;
}
/**
 * 将多维数组转成一维数组
 * @param {*} arr
 * @returns
 */
export const deepFlattenTwo = (arr: any) => [].concat(...arr.map((v: any) => (Array.isArray(v) ? deepFlattenTwo(v) : v)));
/**
 * 将多维数组对象转成一维数组对象
 * @param {*} arr
 * @returns
 */
export function deepFlatten(arr: any) {
  return [].concat(
    ...arr.map((item: any) => {
      if (item.children) {
        const arr = [].concat(item, ...deepFlatten(item.children));
        delete item.children;
        return arr;
      }
      return [].concat(item);
    })
  );
}
export function addTitleAtr(currentPath: any, list: any) {
  list.map((x: any) => {
    x.title = x.name;
    x.address = `${currentPath}/@app-${x.id}`;
  });
  return list;
}
/**
 * 判断数组对象中是否有某个对象，有则替换无则添加
 * @param {*} initialArr 源数组
 * @param {*} obj 判定的对象
 * @param {*} pro 对象中的某个属性名（唯一，通常为id）
 */
export const formateArrObjData = (initialArr: any, obj: any, pro: any) => {
  if (!(initialArr instanceof Array)) {
    return '请传入正确格式的数组';
  }
  if (!(obj instanceof Object)) {
    return '请传入正确格式的对象';
  }
  if (!pro) {
    return '请传入正确格式的属性名';
  }

  const index = initialArr.findIndex(val => val[pro] === obj[pro]);
  const tempArr: any = [];
  // 如果有就替换  没有就添加
  if (initialArr.findIndex(val => val[pro] === obj[pro]) !== -1) {
    tempArr.splice(index, 1, obj);
  } else {
    tempArr.push(obj);
  }
  return tempArr;
};
/**
 * 判断是否重复
 * @param {*} list
 * @param {*} action
 * @returns
 */
export const formateArrObjChong = (list: any, action: any) => {
  let isExist = false; // action是否存在，默认为不存在 false
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === action.id) {
      isExist = true; // 代表重复了
      break;
    }
  }
  return isExist;
};
/**
 * 过滤掉所有函数
 * @param {*} obj
 */
export const formatObjFilterFun = (obj: any, _id = '1-1') => {
  const temp = {};
  const pageObj = obj[_id];
  const keys = Object.keys(pageObj);
  for (let i = 0; i < keys.length; i++) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    temp[keys[i]] = pageObj[keys[i]];
  }
  return temp;
};
/**
 * 打印消息
 * @param {*} namespace
 * @returns
 */
export const Logger = (namespace: any, debug = process.env.NODE_ENV !== 'production') => {
  return {
    info(msg: any, msg1 = '') {
      debug && console.log(`%c【 ${namespace} 】: %c${msg} %O`, 'color: #2980b9', 'color: #119c0f;', msg1);
    },
    error(error: any) {
      if (error instanceof Error) {
        throw error;
      } else if (typeof error === 'string') {
        console.log(`%c[${namespace}]: ${error}`, 'color: #c0392b');
      }
    },
  };
};
/**
 * 判断是否为空
 * @param {*} exp
 * @returns
 */
export const isNull = (exp: any) => {
  let flag = false;
  if (!exp && typeof exp !== 'undefined' && exp !== 0) {
    flag = true;
  }
  return flag;
};
/**
 * 判断undefined
 * @param {*} exp
 * @returns
 */
export const isUndefine = (exp: any) => {
  let tmp = false;
  if (typeof exp === 'undefined') {
    tmp = true;
  }
  return tmp;
};
/**
 * ICON ID
 */
export const ENUMER_ICON = {
  个人中心: 'K',
  更多: 'J',
  搜索: 'D',
  搜索框: 'M',
};
/**
 * 枚举变数组
 * @param {*} enumObject
 * @returns
 */
export function makeEnum(enumObject: any) {
  const all = [];
  for (const key in enumObject) {
    all.push(enumObject[key]);
  }
  return all;
}
/**
 * 最后剩余显示的ICON
 * @param {*} list
 * @returns // 比如 ['K', 'J', 'D', 'M']
 */
export const compreIcon = (list: any, moreId: any) => {
  if (!list || !list.length) {
    return {};
  }
  const temp: any = [];
  const _comT = Object.values(ENUMER_ICON);
  const _keyT = Object.keys(ENUMER_ICON);
  // 先映射
  const t1 = list.filter((item: any) => _keyT.indexOf(item.title) > -1);
  for (let i = 0; i < t1.length; i++) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    t1[i].eKey = ENUMER_ICON[t1[i].title];
  }
  list.filter(function (item1: any) {
    return _comT.map(function (item2) {
      return item2 === item1.eKey && temp.push(item1.id);
    });
  });
  const _moreId = list.filter((x: any) => x.eKey === moreId);

  return {
    _list: temp.reverse(),
    _moreId: _moreId[0].id,
  };
};
/**
 * 过滤隐藏数组
 * @param {*} list
 */
export const filterHideList = (list1: any, list2: any) => {
  const temp: any = [];
  const comT = list1;
  const result = list2.filter(function (item1: any) {
    return comT.every(function (item2: any) {
      return item2 !== item1.id;
    });
  });
  result.map((x: any) => temp.push(x.id));

  return temp.reverse();
};
/**
 * 改变icon样式
 * @param {*} obj
 */
export function changeSelectedClass(obj: any) {
  const { isSled, id } = obj;
  const _id = id.split('com_')[1];

  // @ts-expect-error TS(2531): Object is possibly 'null'.
  const _rightMenu = document.getElementById('rightMenu').childNodes;
  Array.from(_rightMenu).map(x => {
    // @ts-expect-error TS(2339): Property 'classList' does not exist on type 'Child... Remove this comment to see the full error message
    x.classList.contains('selected') && x.classList.remove('selected');
  });

  isSled
    ? // @ts-expect-error TS(2531): Object is possibly 'null'.
      document.getElementById(_id).classList.add('selected')
    : // @ts-expect-error TS(2531): Object is possibly 'null'.
      document.getElementById(_id).classList.contains('selected') &&
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      document.getElementById(_id).classList.remove('selected');
}
/**
 * 获取头部隐藏ICON
 */
export function getFindHideIcon(params: any) {
  const { _operationList, typename, _menuList } = params;
  const menuArray: any = [];
  _menuList.forEach((i: any) => {
    if (i.type === typename) {
      const _array = _operationList.filter((x: any) => {
        return x.title !== '搜索框' && x.id === i.id_name;
      });
      menuArray.push({ ...i, ..._array[0] });
    }
  });
  return menuArray;
}
/**
 * 停留几秒
 * @param {*} ms
 * @returns
 */
export const sleep = (ms: any) => {
  return new Promise(a => {
    setTimeout(a, ms);
  });
};

/**
 * 根据路径查找当前TAB page
 * @param {*} pagePath
 */
export const findPage = (pagePath: any, llpage: any) => {
  let _currentId = pagePath.split('@app-')[1];
  _currentId = _currentId.indexOf('/') === -1 ? _currentId : _currentId.split('/')[0];
  return llpage.getCurrentPage(_currentId);
};

/**
 * 合并参数
 * @param {*} createPageObj 创建调和器
 * @param {*} pageState 给调和器的页面参数
 * @param {*} ctxData 给调和器的子应用传的参数
 * @returns
 */
export const createPageState = (createPageObj: any, pageState: any, ctxData: any) => {
  return createPageObj({ ...pageState, ctxData });
};

/**
 * 区分Id
 * @param {*} pathname
 * @returns
 */
export const idSplitPath = (pathname: any) => {
  let _path = pathname.split('/');
  if (_path === 'null') {
    _path = '';
  } else {
    _path = _path.filter((x: any) => x.indexOf('@app-') > -1);
    _path = _path.length > 0 ? _path[0].split('@app-')[1] : '';
  }
  return _path;
};

// export const paramesReplace = ({ actionSource, winUrl = '', url = '' }) => {

//   if (actionSource === '') {
//     let winUrlAppId = winUrl.match(/@app-([^\/]*)/g);
//     let urlAppId = url.match(/@app-([^\/]*)/g);
//     if (winUrlAppId && urlAppId && winUrlAppId[0] === urlAppId[0]) {
//       winUrl = winUrl.replace(`${window.location.protocol}//${window.location.host}`, '');
//       if (winUrl.indexOf('/') === 0) {
//         winUrl = winUrl.substring(1);
//       }
//       return winUrl;
//     }
//   }
//   return url;
// }

// /**
//  * 路径替换地址
//  * @param {*} path
//  * @param {*} id
//  * @param {*} isxie '/' true带有
//  * @returns
//  */
// export const idReplace = ({ actionSource, path, id, isxie = true }) => {
//   let _newPath = paramesReplace({ actionSource, winUrl: window.location.href, url: path });
//   _newPath = _newPath.split('?');

//   let _path = _newPath.length > 0 ? _newPath[0].split('/') : _newPath.split('/');
//   let _search = getRequest(_newPath.length > 0 ? _newPath[1] : '');
//   let _index = _path.findIndex(x => x.indexOf('@app-') > -1);
//   _path[_index] = `@app-${id}`;
//   _path = isxie ? `/${_path.join('/')}` : `${_path.join('/')}`;

//   return { _path: _path, _query: _search };
// }
/**
//  * 路径替换地址
//  * @param {*} path
//  * @param {*} id
//  * @returns
//  */
export const idReplace = (path: any, id: any) => {
  let _path = path.split('/');
  let _index = _path.findIndex((x: any) => x.indexOf('@app-') > -1);
  _path[_index] = `@app-${id}`;

  _path = `${_path.join('/')}`;
  return _path;
};

function childrenFullId(fullId: any, level: any, list: any) {
  list.map((item: any) => {
    item.level = level;
    if (fullId === '') {
      item.fullId = item.id;
    } else {
      item.fullId = fullId + '^' + item.id;
    }
    item.isLastLevel = !(item.children && item.children.length > 0);
    if (!item.isLastLevel) {
      childrenFullId(item.fullId, level + 1, item.children);
    }
  });
  return list;
}

export const formatMenu = (list: any) => {
  let _temp = [];
  _temp = childrenFullId('', 0, list);
  return _temp;
};

export const addAdress = (path: any) => {
  return path.split('/')[0] === '' ? path.substr(1) : path;
};

export const removeRouterName = (list: any) => {
  list.map((x: any) => {
    x.address = x.address.substr(x.address.lastIndexOf('@app-')); //如果这里是‘/@app-’
  });
  return list;
};

export const addRouterName = (currentRouter: any, list: any) => {
  list.map((x: any) => {
    x.address = `${currentRouter}/${x.address}`; //那么这里是‘`${currentRouter}/${x.address}`’
  });
  return list;
};

export const getLastNewUrl = (currentRouteName: any, urlStr: any) => {
  let indexStr = `/${currentRouteName || 'homepage'}/@app-`;
  let lastIndex = urlStr.lastIndexOf(indexStr);
  urlStr = urlStr.substr(lastIndex);
  return urlStr;
};

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 * 立即执行版防抖：触发事件后函数立即执行，n秒内不触发事件才能继续执行
 * 非立即执行版防抖：事件触发后不立即执行，n秒后执行
 */
export function debounce(func: any, wait: any, immediate: any) {
  let timeout: any;
  return function (this: any) {
    const context = this;
    const args = [...arguments];
    if (timeout) {
      clearTimeout(timeout);
    }
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) {
        func.apply(context, args);
      }
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  };
}

export const getRequest = (url: any) => {
  const _url = url.match(/[?]([^\/]*)/g);
  const _search = _url ? _url[0] : '';
  const urlSearchParams = new URLSearchParams(_search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params;
};

export const getAppIdFromRoute = () => {
  const windowPath = window.location.pathname;
  const matched = windowPath.match(/@app-([^\/]*)/i);
  if (!matched) return '/';
  const [_, appId] = matched;

  return appId;
};

export const getAppId = (path: any) => {
  const [_, appId] = path.match(/@app-([^\/]*)/i) || [];

  return appId;
};

export const getHashByString = (str: any) => {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return hash.toString();
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};
