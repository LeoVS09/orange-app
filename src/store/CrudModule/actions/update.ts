import {CrudActionApi, Identical} from "@/store/CrudModule";
import {StatusManipulation} from "@/store/modules/statuses/utils";
import {ModelStatus} from "@/store/modules";
import {getById} from "@/store/CrudModule/actions/utils";
import {ModelReadState} from "@/store/modules/statuses/types";

export async function updateAction<T extends Identical>(
   items: Array<T>,
   id: string,
   setOrAddMutation: (model: T) => void,
   {getStatus, setStatus, setReadState, setModelState, getRead}: StatusManipulation,
   update: (model: T) => Promise<T | undefined | null>,
): Promise<T | undefined> {
   let status = getStatus(id)
   if (status !== ModelStatus.Changed && status !== ModelStatus.ErrorUpdating)
      return

   const model = getById(items, id)
   if (!model) {
      console.error('Cannot find model for update', id)
      return
   }

   setStatus(id, ModelStatus.Updating)
   const response = await update(model)

   if (!response) {
      setStatus(id, ModelStatus.ErrorUpdating)
      return
   }

   status = getStatus(id)
   if (status === ModelStatus.Updating || status === ModelStatus.ErrorUpdating) {
      setOrAddMutation({
         ...model,
         ...response
      })
      setStatus(id, ModelStatus.Synced)
   }

   return model
}
