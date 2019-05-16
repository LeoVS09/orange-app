
export function toStringWhenDefined(value: any): string {
   if(value === undefined)
      return ''

   if(value === null)
      return ''

   return '' + value
}

export function formatDate(date: Date) {
   if(!date)
      return ''

   return date.toLocaleDateString()
}

export function randomId(): string {
   return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}
