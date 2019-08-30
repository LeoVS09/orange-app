import { CrudActionApi, Identical, ISetByIdPayload} from '@/store/CrudModule'
import { StatusManipulation} from '@/store/modules/statuses/utils'
import { randomId} from '@/components/utils'
import { ModelStatus} from '@/store/modules'

export function addModelForCreateAction<T extends Identical>(
   items: Array<T>,
   defaultModel: () => T,
   setOrAddMutation: (model: T) => void,
   { setStatus}: StatusManipulation,
): T {
   const model = {
      ...defaultModel(),
      id: randomId(),
   }
   setOrAddMutation(model)

   setStatus(model.id, ModelStatus.ForCreate)

   return model
}

export async function createAction<T extends Identical, OrderBy>(
   items: Array<T>,
   model: T,
   setByIdMutation: (payload: ISetByIdPayload<T>) => void,
   { getStatus, setStatus, setReadState, setModelState, getRead}: StatusManipulation,
   create: (model: T) => Promise<T | undefined | null>,
): Promise<T | undefined> {
   const status = getStatus(model.id)
   if (
      status !== ModelStatus.ForCreate &&
      status !== ModelStatus.None &&
      status !== ModelStatus.ErrorCreating
   ) {
      return
   }

   const result = await create(model)
   if (!result) {
      setStatus(model.id, ModelStatus.ErrorCreating)
      return
   }

   setByIdMutation({
      id: model.id,
      model: result,
   })
   setStatus(result.id, ModelStatus.Synced)

   return result
}
