import {DynamicPageMeta} from "@/components/types";
import DynamicPage from '@/components/DynamicPage.vue'
import * as actions from "@/store/actionTypes";
import {Country} from "@/models";
import router, {ROUTES} from "@/router";
import {Component, Prop} from 'vue-property-decorator'

@Component
export default class Countries extends DynamicPage {
   meta: DynamicPageMeta = {
      header: 'Countries',
      list: {
         headers: [
            {'name': 'Name'},
            {'createdAt': 'Date'}
         ],
         items: {
            getter: self => self.$store.getters.allCountries
         },
         actions: {
            loadAction: self => self.$store.dispatch(actions.LOAD_ALL_COUNTRIES)
         },
         chooseItem: (country: Country) =>
            router.push({name: ROUTES.COUNTRY, params: {id: country.id}})
      }
   }
}
