export enum ColorLineType {
   success = 'success',
   error = 'error'
}

export interface ButtonEvent {
   key: string
}

export enum ButtonEvents {
   over = 'button-over',
   leave = 'button-leave'
}

export interface ListItemEvent {
   key: string
}

export interface DataItem {
   [key: string]: any
}

export interface Header {
   key: string,
   label: string,
   expand?: boolean
}

export interface SimpleHeader {
   [key: string]: string
}

export interface ListMeta {
   headers?: Array<Header | string>,
   exceptions?: Array<string>
}

export enum ListItemEvents {
   over = 'list-item-over',
   leave = 'list-item-leave',
   move = 'list-item-move',
   click = 'click'
}

export interface ListSortEvent {
   by: string
   ascending: boolean
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
   sort = 'sort'
}
