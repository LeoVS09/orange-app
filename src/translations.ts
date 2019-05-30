import Vue from "vue";
import vuexI18n from "vuex-i18n";
import store from "@/store";

const translationsEn = {
};

const translationsRu = {
   "Problems": "Задачи"
};

export enum Translations {
   EN = 'en',
   RU = 'ru'
}

export default function (translation: Translations = Translations.RU) {
   Vue.use(vuexI18n.plugin, store);

   Vue.i18n.add('en', translationsEn);
   Vue.i18n.add('ru', translationsRu);

   Vue.i18n.set(translation);
}
