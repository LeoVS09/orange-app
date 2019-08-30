import { createDecorator } from 'vue-class-component'

export interface RouterPushOptions {
   name: string
   params?: Array<string>
}

const defaultParams = ['id']

export const RouterPush = (decoratorOptions: RouterPushOptions | string) => createDecorator((options, key) => {
  if (typeof decoratorOptions === 'string')
    decoratorOptions = { name: decoratorOptions }

  const { name } = decoratorOptions
  const params = decoratorOptions.params || defaultParams

  if (!options.methods)
    options.methods = { }

  options.methods[key] = function (value?: { [key: string]: any }) {
    const resultParams: { [key: string]: any } = { }

    if (value) {
      for (const paramKey of params)
        resultParams[paramKey] = value[paramKey]
    }

    return this.$router.push({
      name,
      params: resultParams,
    })
  }
})

export const Filter = (target: any, key: string) => (

  createDecorator((options, paramKey) => {
    console.log('filter', target, options)
    if (!options.filters)
      options.filters = { }

    options.filters[paramKey] = target[paramKey]
  })
)(target, key)
