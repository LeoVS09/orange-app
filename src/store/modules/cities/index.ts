import {crudActions, crudMutations, CrudState} from '@/store/CrudModule';
import {City, Country} from '@/models';
import {CitiesOrderBy, CityInput, CountriesOrderBy} from '@/api/database/global-types';
import * as API from '@/api';
import * as fragmentsTypes from '@/api/database/fragments/types';
import {STATUS_SCOPES} from '@/store/statusScopes';

export default {
   namespaced: true,
   state: new CrudState<City>(),
   mutations: crudMutations(),
   actions: crudActions<City, CitiesOrderBy>(
      STATUS_SCOPES.CITIES,
      (countryId) => ({
         id: '',
         name: '',
         countryId: countryId as string,
         createdAt: new Date(),
         updatedAt: new Date(),
      }),
      {
         readList: (variables) => API.cities(variables),

         create: (city) => API.createCity({input: {city: cityToInput(city)}}),

         read: async (id) => responseToCity(await API.city({id})),

         update: (city) => API.updateCity({
            input: {
               id: city.id,
               patch: cityToInput(city),
            },
         }),

         delete: (id) => API.deleteCity({input: {id}}),
      },
   ),
};

function responseToCity(result?: fragmentsTypes.FullCity | null): City | undefined | null {
   if (!result) {
      return result;
   }

   return {
      ...result,
      universities: result.universities.nodes as fragmentsTypes.FullCity_universities_nodes[],
   };
}

function cityToInput(city: City): CityInput {
   return {
      name: city.name,
      countryId: city.countryId,
   };
}
