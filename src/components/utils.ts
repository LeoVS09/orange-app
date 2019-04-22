
export function toStringWhenDefined(value: any): string {
   if(value === undefined)
      return ''

   if(value === null)
      return ''

   return '' + value
}
