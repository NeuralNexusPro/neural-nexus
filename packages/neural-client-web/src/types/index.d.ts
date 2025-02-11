export interface BizResponse<T = Record<string, unknown> | Array<unknown>> {
  code: string;
  message: string;
  data: T & { pageNum?: number; pageSize?: number; total?: number };
  success: boolean;
}

export interface Rule {
  required?: boolean;
  message?: string;
  trigger?: string;
  validator?: (rule: Rule, value: string) => boolean;
}

export interface MenuItem {
  name: string;
  desc: string;
  key: string;
  url: string;
  icon?: string;
}
export interface MenuInfo extends MenuItem {
  subMenu?: MenuItem[];
}
