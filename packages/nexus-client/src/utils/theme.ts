import lodash from "lodash";
import { isRunningInMobile } from "./common";

interface NestedObject<T> {
  [key: string]: NestedObject<T> | T;
}

const cssUnitReg = /^\d+(px)$/;
const SESSION_THEME_ID = "session_theme_style";

export const defaultTheme = {
  "background": {
    // "type": "solid",
    "value": "#F2F4F8",
  },
  "userBubble": {
    // "backgroundType": "gradient",
    "backgroundValue": "linear-gradient( 57deg, #32ACE6 0%, #4B7AFF 100%)",
    // "borderType": "solid",
    "borderColor": "",
    "borderWidth": "0px",
    "fontColor": "#FFFFFF",
  },
  "botBubble": {
    // "backgroundType": "solid",
    "backgroundValue": "#ffffff",
    // "borderType": "solid",
    "borderColor": "",
    "borderWidth": "0px",
    "fontColor": "#3D3E42",
  },
  "font": {
    "family": "PingFangSC",
    "size": "14px",
    "weight": "normal",
    "color": "#323233",
    "lineHeight": "22px",
    "letterSpacing": "normal"
  }
}

const defaultVars = flatternStyleObject(defaultTheme, '--default');

function transformUnit(value: string) {
  if (!value.match(cssUnitReg)) return value;
  const mobileFontSize = parseFloat(value) * 2 / 100;
  return isRunningInMobile() ? `${mobileFontSize}rem` : value;
}

function flatternStyleObject(object: NestedObject<string>, keyChain: string) {
  return Object.entries(object).reduce((acc, [key, value]) => {
    const kcKey = lodash.kebabCase(key);
    const chain = keyChain ? `${keyChain}-${kcKey}` : kcKey;
    if (typeof value === 'object') {
      acc = Object.assign(acc, flatternStyleObject(value, chain));
    } else {
      acc[chain] = transformUnit(value);
    }
    return acc;
  }, {})
}

function styleToCss(object: Record<string, string>) {
  return Object.entries(object).reduce((list, item) => {
    const [key, value] = item;
    list += `${key}: ${value};`;
    return list;
  }, '');
}

function appendVarsStyle(vars: Record<string, string>, styleId: string) {
  let $style = document.getElementById(`${styleId}_${SESSION_THEME_ID}`);
  if (!$style) {
    $style = document.createElement("style");
    $style.id = `${styleId}_${SESSION_THEME_ID}`;
  }
  $style.innerHTML = `:root{${styleToCss(vars)}}}`;
  document.head.appendChild($style);
}

function stripComments(json: string) {
  return json.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
}

function initSessionTheme(themeStr: string) {
  let styleObject = {};
  try {
    const jsonStr = stripComments(themeStr);
    const themeObject = JSON.parse(jsonStr);
    styleObject = themeObject;
  } catch (error) {
    console.log(`parse chat style error: ${error}`);
  }
  const mergedVars = flatternStyleObject(styleObject, '--session');
  appendVarsStyle(mergedVars, 'custom');
}

function initDefaultTheme() {
  appendVarsStyle(defaultVars, 'default');
}

export { initSessionTheme, initDefaultTheme };