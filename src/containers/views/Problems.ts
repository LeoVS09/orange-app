import {DynamicPageMeta} from "@/components/types";
import DynamicPage from '@/components/DynamicPage.vue'
import * as actions from "@/store/actionTypes";
import {PartialProblem} from "@/models";
import router, {ROUTES} from "@/router";
import {Component, Prop} from 'vue-property-decorator'
import Vue from "vue";
import {Tag} from "@/models/problems";
import {ProblemFilter} from "@/store/modules";

@Component
export default class Problems extends DynamicPage {
   meta: DynamicPageMeta = {
      header: {
         text: 'Problems',
         actions: [
            {
               showTrigger: (self: Vue) => self.$store.getters.isTeacher,
               icon: 'add',
               text: 'Add problem',
               action: () => router.push({name: ROUTES.CREATE_PROBLEM})
            }
         ]
      },
      tags: {
         getter: (self: Vue) => self.$store.getters.allTags,
         active: (self: Vue) => self.$store.state.problems.filterTags,
         choose: (self: Vue, tag: Tag) => self.$store.dispatch(actions.TOGGLE_FILER_TAG, tag),
         actions: {
            loadAction: (self: Vue) => self.$store.dispatch(actions.READ_TAGS)
         }
      },
      list: {
         headers: [
            {'name': 'Name'},
            {'author': 'Author'},
            {'createdAt': 'Date'}
         ],
         filters: {
            buttons: [
               { 'All': ProblemFilter.All },
               { 'Public': ProblemFilter.Public },
               { 'Not public': ProblemFilter.NotPublic },
               { 'Resolved': ProblemFilter.Resolved }
            ],
            active: (self: Vue) => self.$store.state.problems.filter,
            choose: (self: Vue, filter: ProblemFilter) => self.$store.dispatch(actions.SET_PROBLEMS_FILTER, filter)
         },
         formatItem: (item: PartialProblem) => ({
            ...item,
            author: item.author.login
         }),
         items: {
            getter: self => self.$store.getters.filteredProblems
         },
         actions: {
            loadAction: self => self.$store.dispatch(actions.READ_PROBLEMS_LIST)
         },
         chooseItem: (problem: PartialProblem) =>
            router.push({name: ROUTES.PROBLEM, params: {id: problem.id}})
      }
   }
}
