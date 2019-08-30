import {
  CrudActionApi, Identical, ReadListResponse, ReadListVariables,
} from '@/store/CrudModule'
import { StatusManipulation } from '@/store/modules/statuses/utils'
import { ModelStatus } from '@/store/modules'
import { ModelReadState } from '@/store/modules/statuses/types'
import { findById } from '@/store/CrudModule/actions/utils'

export async function readListAction<T extends Identical, OrderBy>(
  items: Array<T>,
  setOrAddMutation: (model: T) => void,
  {
    getStatus, setStatus, setReadState, setModelState, getRead,
  }: StatusManipulation,
  readList: (variables: ReadListVariables<OrderBy>) => Promise<ReadListResponse<T> | undefined | null>,
  setGlobalStatus: (status: ModelStatus) => void,
): Promise<boolean> {
  const list = await readList({ })
  if (!list) {
    setGlobalStatus(ModelStatus.ErrorReading)
    return false
  }

  const setNode = (model: T) => {
    setOrAddMutation(model)
    setModelState(model.id, ModelStatus.Synced, ModelReadState.Partial)
  }

  list.nodes.forEach((node) => {
    if (!node)
      return

    const have = findById(items, node.id)
    if (!have)
      return setNode(node)

    const status = getStatus(node.id)
    const readState = getRead(node.id)

    if (status === ModelStatus.None || status === ModelStatus.Reading || status === ModelStatus.ErrorReading)
      return setNode(node)

    if (status !== ModelStatus.Synced)
      return

    if (readState !== ModelReadState.Full)
      return setNode(node)

    if (have.updatedAt !== node.updatedAt)
      return setNode(node)
  })

  return true
}
