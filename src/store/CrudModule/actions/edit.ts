import {Identical} from '@/store/CrudModule'
import {StatusManipulation} from '@/store/modules/statuses/utils'
import {ModelStatus} from '@/store/modules'
import {findById} from '@/store/CrudModule/actions/utils'

export function editAction<T extends Identical>(
   items: T[],
   model: T,
   setOrAddMutation: (model: T) => void,
   {getStatus, setStatus}: StatusManipulation,
): boolean {

   const status = getStatus(model.id)
   if (status === ModelStatus.Reading) {
      return false
   }

   const have = findById(items, model.id)
   if (!have) {
      console.error('Cannot findOne model for editing', model.id)
      return false
   }

   setOrAddMutation({
      ...have,
      ...model,
   })

   setStatus(model.id, ModelStatus.Changed)
   return true
}
