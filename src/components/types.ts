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

export interface ListMeta {
   headers?: Array<Header | string>,
   exceptions?: Array<string>
}

export enum ListItemEvents {
   over = 'list-item-over',
   leave = 'list-item-leave',
   move = 'list-item-move'
}

export enum ListEvents {
   chooseItem = 'chooseItem',
   chooseHeader = 'chooseHeader',
   add = 'add'
}
