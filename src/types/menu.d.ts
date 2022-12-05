declare type DialogType = {
  title: string;
  visible: boolean;
};
/**
 * 菜单表单类型声明
 */
export interface MenuForm {
  select?:string
  /**
   * 菜单ID
   */
  id?: string;
  /**
   * 父菜单ID
   */
  parentId: string;
  /**
   * 菜单名称
   */
  name: string;
  /**
   * 菜单是否可见(1:是;0:否;)
   */
  /* 简称 */
  abbreviation?: String
  visible: number;
  icon?: string;
  /* 后端api */
  apiPath?: String;
  /**
   * 排序
   */
  sort: number;
  /**
   * 组件路径
   */
  component?: string;
  /**
   * 路由路径
   */
  path?: string;
  /**
   * 跳转路由路径
   */
  redirect?: string;

  /**
   * 菜单类型
   */
  type: string;

  /**
   * 权限标识
   */
   perm?: string;
}
