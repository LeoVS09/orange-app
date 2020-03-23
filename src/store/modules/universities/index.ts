import { CrudState, crudActions, crudMutations } from '@/store/CrudModule'
import { University } from '@/models'
import { UniversitiesOrderBy, UniversityInput } from '@/api/database/global-types'
import * as API from '@/api'
import * as fragmentsTypes from '@/api/database/fragments/types'
import { STATUS_SCOPES } from '@/store/statusScopes'

export default {
  namespaced: true,
  state: new CrudState<University>(),
  mutations: crudMutations<University>(),
  actions: crudActions<University, UniversitiesOrderBy>(
    STATUS_SCOPES.UNIVERSITIES,
    cityId => ({
      id: '',
      shortName: '',
      longName: '',
      cityId: cityId as string,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    {
      readList: variables => API.universities(variables),

      create: university => API.createUniversity({ input: { university: universityToInput(university) } }),

      read: async id => responseToUniversity(await API.university({ id })),

      update: university => API.updateUniversity({
        input: {
          id: university.id,
          patch: universityToInput(university)
        }
      }),

      delete: id => API.deleteUnviersity({ input: { id } })
    }
  )
}

function responseToUniversity(result: fragmentsTypes.PartialUniversity | null | undefined): University | null | undefined {
  return result
}

function universityToInput(university: University): UniversityInput {
  return {
    cityId: university.cityId,
    shortName: university.shortName,
    longName: university.longName
  }
}
