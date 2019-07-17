import Vue from 'vue';
import vuexI18n from 'vuex-i18n';
import store from '@/store';

const translationsEn = {
};

const translationsRu = {
   'Problems': 'Задачи',
   'Contests': 'Соревнования',
   'Name': 'Название',
   'Author': 'Автор',
   'Updated': 'Обновлено',
   'Profile': 'Профиль',
   'Countries': 'Страны',
   'Country': 'Страна',
   'Cities': 'Города',
   'City': 'Город',
   'Code': 'Код',
   'Sign Out': 'Выйти',
   'Sign In': 'Вход',
   'All': 'Все',
   'Public': 'Открытые',
   'Not public': 'Скрытые',
   'Resolved': 'Решённые',
   'Add problem': 'Добавить',
   'Add': 'Добавить',
   'Previous': 'Предыдущая',
   'Next': 'Следующая',
   'Difficulty': 'Сложность',
};

export default function() {
   Vue.use(vuexI18n.plugin, store);

   Vue.i18n.add('en', translationsEn);
   Vue.i18n.add('ru', translationsRu);

   Vue.i18n.set(store.state.ui.locale);
}
