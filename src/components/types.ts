import Vue from 'vue';

export enum ColorLineType {
   success = 'success',
   error = 'error',
}

export interface ButtonEvent {
   key: string;
}

export enum ButtonEvents {
   over = 'button-over',
   leave = 'button-leave',
}

export interface ListItemEvent {
   key: string;
}

export interface DataItem {
   [key: string]: any;
}

export interface Header {
   key: string;
   label: string;
   expand?: boolean;
}

export interface SimpleHeader {
   [key: string]: string;
}

export interface ListMeta {
   headers?: Array<Header | string>;
   exceptions?: string[];
}

export enum ListItemEvents {
   over = 'list-item-over',
   leave = 'list-item-leave',
   move = 'list-item-move',
   click = 'click',
}

export interface ListSortEvent {
   by: string;
   ascending: boolean;
}

export enum ListEvents {
   chooseItem = 'choose-item',
   clickHeader = 'click-header',
   add = 'add',
   nextPage = 'next-page',
   previousPage = 'previous-page',
   toPage = 'to-page',
   onItemOver = 'on-item-over',
   onItemLeave = 'on-item-leave',
   onItemMove = 'on-item-move',
   sort = 'sort',
   loaded = 'loaded',
}

export interface ButtonGroupMetaItem {
   [key: string]: any;
}

export interface ButtonGroupMeta {
   attributes?: Object;
   active?: any;
   buttons?: ButtonGroupMetaItem[];
}

export interface IPropsBreadcrumb {
   [name: string]: any;
}

export interface DynamicPageAction {
   showTrigger?: (self: Vue) => boolean;
   icon: string;
   text: string;
   action: (self: Vue) => void;
}

export interface DynamicPageMeta {
   header: string | {
      breadcrumbs?: Array<IPropsBreadcrumb | string>
      text: string | ((model?: any) => string)
      actions?: DynamicPageAction[] | {
         showTrigger?: (self: Vue) => boolean,
         buttons: DynamicPageAction[],
      },
   };
   tags?: {
      getter: (self: Vue) => any[],
      active: (self: Vue) => any[],
      choose: (self: Vue, tag: any) => void,
      actions?: {
         loadTrigger?: (self: Vue) => boolean
         loadAction?: (self: Vue) => void,
      },
   };
   list?: {
      headers?: Array<Header | string | SimpleHeader>
      filters?: {
         buttons: ButtonGroupMetaItem[],
         active: (self: Vue) => any,
         choose: (self: Vue, filter: any) => void,
      }
      items: any[] | {
         getter?: (self: Vue) => any[]
         fromModel?: (model?: any) => any[],
      }
      formatItem?: (item: any) => any
      actions?: {
         loadTrigger?: (items?: any[]) => boolean
         loadAction?: (self: Vue) => void,
      }
      chooseItem?: (item: any) => void,
   };
   model?: {
      getter?: (self: Vue) => any
      actions?: {
         loadTrigger?: (model?: any) => boolean
         loadAction?: (self: Vue) => void,
      },
   };
}

