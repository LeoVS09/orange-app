import {crudActions, crudMutations, CrudState} from '@/store/CrudModule';
import {Country} from '@/models';
import {CountriesOrderBy, CountryInput} from '@/api/database/global-types';
import * as API from '@/api';
import * as fragmentsTypes from '@/api/database/fragments/types';
import {STATUS_SCOPES} from '@/store/statusScopes';

export default {
   namespaced: true,
   state: new CrudState<Country>(),
   mutations: crudMutations<Country>(),
   actions: crudActions<Country, CountriesOrderBy>(
      STATUS_SCOPES.COUNTRIES,
      () => ({
         id: '',
         name: '',
         code: '',
         createdAt: new Date(),
         updatedAt: new Date(),
      }),
      {
         readList: (variables) => API.countries(variables),

         create: (country) => API.createCountry({input: {country: countryToInput(country)}}),

         read: async (id) => responseToCountry(await API.country({id})),

         update: (country) => API.updateCountry({
            input: {
               id: country.id,
               patch: countryToInput(country),
            },
         }),

         delete: (id) => API.deleteCountry({input: {id}}),
      },
   ),
};

function responseToCountry(result: fragmentsTypes.FullCountry | undefined | null): Country | undefined | null {
   if (!result) {
      return result;
   }

   return {
      ...result,
      cities: result.cities.nodes as fragmentsTypes.FullCountry_cities_nodes[],
   };
}

function countryToInput(country: Country): CountryInput {
   return {
      name: country.name,
      code: country.code,
   };
}
