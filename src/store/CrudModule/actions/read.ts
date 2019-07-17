import {CrudActionApi, Identical} from '@/store/CrudModule';
import {StatusManipulation} from '@/store/modules/statuses/utils';
import {findById} from '@/store/CrudModule/actions/utils';
import {ModelStatus} from '@/store/modules';
import {ModelReadState} from '@/store/modules/statuses/types';

export async function readAction<T extends Identical>(
   items: T[],
   id: string,
   setOrAddMutation: (model: T) => void,
   {getStatus, setStatus, setReadState}: StatusManipulation,
   read: (id: string) => Promise<T | undefined | null>,
): Promise<T | undefined> {
   console.log('read', id);

   const have = findById(items, id);
   if (have) {
      const status = getStatus(id);
      if (
         status !== ModelStatus.None &&
         status !== ModelStatus.Synced &&
         status !== ModelStatus.ErrorReading
      ) {
         return have;
      }
   }

   setStatus(id, ModelStatus.Reading);
   const model = await read(id);

   if (!model) {
      setStatus(id, ModelStatus.ErrorReading);
      return;
   }

   setOrAddMutation(model);
   setReadState(id, ModelReadState.Full);

   console.log('read', model);
   return model;
}
