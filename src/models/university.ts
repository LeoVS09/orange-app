import Model from '@/lazyReactiveORM/Model';
import {ModelAttributeType} from '@/lazyReactiveORM/types';

export interface University {
   id: string;
   shortName: string;
   longName: string | null;
   createdAt: Date;
   updatedAt: Date;
   cityId: string;
}

export const UniversityModel = new Model(
   'university',
   {
      city: ModelAttributeType.OneToOne,
   },
);
