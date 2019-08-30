import { PluginFunction } from 'vue'
import { formatDate, isDate } from '@/components/utils'

const Filters: PluginFunction<any> = (Vue) => {
  Vue.filter('formatDate', (value: any) => {
    if (!isDate(value))
      return value

    return formatDate(value)
  })

  Vue.filter('capitalise', (value: any) => {
    if (typeof value !== 'string')
      return value

    return capitalise(value)
  })

  Vue.filter('normalise', (value: any) => {
    if (typeof value !== 'string')
      return value

    return normaliseName(value)
  })
}

export default Filters

function capitalise(s: string): string {
  return s[0].toUpperCase() + s.slice(1)
}

function normaliseName(key: string): string {
  return key.split('').map((c) => {
    if (c.match(/[A-Z]/))
      return ` ${c.toLowerCase()}`

    return c
  }).join('')
}
