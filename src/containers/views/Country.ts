import {DynamicPageMeta} from "@/components/types";
import {ROUTES} from "@/router/rotues";
import * as models from "@/models";
import * as actions from "@/store/actionTypes";
import DynamicPage from '@/components/DynamicPage.vue'
import {Component, Prop} from 'vue-property-decorator'

@Component
export default class Country extends DynamicPage {
   @Prop({
      type: String,
      required: true
   })
   id: string

   meta: DynamicPageMeta = {
      header: {
         breadcrumbs: [{'Countries': {name: ROUTES.COUNTRIES}}],
         text: (country: models.Country) => country && country.name
      },
      list: {
         headers: [
            {'name': 'Name'},
            {'createdAt': 'Date'}
         ],
         items: {
            fromModel: (model: models.Country) => {
               if (!model)
                  return []

               return model.cities || []
            }
         },
      },
      model: {
         getter: self => self.$store.getters.countryById((self as Country).id),
         actions: {
            loadTrigger: (model: models.Country) => !model || !model.cities,
            loadAction: self => self.$store.dispatch(actions.LOAD_COUNTRY, (self as Country).id)
         }
      }
   }
}


