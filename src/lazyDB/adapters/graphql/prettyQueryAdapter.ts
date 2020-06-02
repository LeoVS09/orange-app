import IQueryBuilderOptions from 'gql-query-builder/build/IQueryBuilderOptions'
import DefaultQueryAdapter from 'gql-query-builder/build/adapters/DefaultQueryAdapter'
import { print, parse } from 'graphql'
import { sortFieldValues } from './sort'
import { QueryField } from './types'

const isDevelopment = true // process.env.NODE_ENV === "development"

/**
 * Pretify queries, sort fields to allow record them, and add quiery names
 */
// @ts-ignore
export class PrettyQueryAdapter extends DefaultQueryAdapter {

  static pretifyQuery = isDevelopment

  static sortFields = isDevelopment

  constructor(options: IQueryBuilderOptions | IQueryBuilderOptions[]) {
    if (Array.isArray(options) || !PrettyQueryAdapter.sortFields) {
      super(options)
      return
    }
    const { fields = [] } = options
    // will sort array of fields inside
    sortFieldValues({ fields } as QueryField)

    super({
      ...options,
      fields
    })
  }

  /**
   * if in development pretify query,
   * required parse query twise
   * do not use in production!
   */
  public queryBuilder() {
    if (!PrettyQueryAdapter.pretifyQuery)
      return super.queryBuilder()

    const { query, variables } = super.queryBuilder()
    return {
      query: `\n${print(parse(query))}`,
      variables
    }
  }

  /** Add query name based on operation name */
  private queryDataArgumentAndTypeMap() {
    // @ts-ignore
    const queryArguments = super.queryDataArgumentAndTypeMap()
    // @ts-ignore
    const queryName = firstToUpperCase(this.operation)

    return `${queryName} ${queryArguments}`
  }

}

function firstToUpperCase(str: string) {
  return str[0].toUpperCase() + str.slice(1)
}
