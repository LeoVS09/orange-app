import {CrudActionApi, Identical} from "@/store/CrudModule";
import {StatusManipulation} from "@/store/modules/statuses/utils";
import {ModelStatus} from "@/store/modules";

export async function deleteAction<T extends Identical>(
   items: Array<T>,
   id: string,
   deleteMutation: (id: string) => void,
   {getStatus, setStatus, setReadState}: StatusManipulation,
   deleteRequest: (id: string) => Promise<T | undefined | null>
): Promise<T | undefined> {

   const status = getStatus(id)
   if (status !== ModelStatus.Synced)
      return

   setStatus(id, ModelStatus.Deleting)
   const model = await deleteRequest(id)

   if (!model) {
      setStatus(id, ModelStatus.ErrorDeleting)
      return
   }

   deleteMutation(id)
   setStatus(id, ModelStatus.None)

   return model
}
