import * as fragmentTypes from '@/api/database/fragments/types'
import {
  FullProblem, PartialProblem, ProblemTestingStatus, Test,
} from '@/models'
import { responseToPartialUserProfile } from '@/store/modules/problems/utils'
import { PartialUserProfile } from '@/models/user'

export function responseToPartialProblem(p: fragmentTypes.PartialProblem | null | undefined): PartialProblem | null | undefined {
  if (!p)
    return p

  if (!p.author)
    throw new Error('Problem not have author')

  const tags = p.problemsTags.nodes as Array<fragmentTypes.PartialProblem_problemsTags_nodes>

  return {
    id: p.id,
    name: p.name,
    difficulty: p.difficulty || 0,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    publicationDate: p.publicationDate,
    author: responseToPartialUserProfile(p.author) as PartialUserProfile,
    tester: p.tester && responseToPartialUserProfile(p.tester) as PartialUserProfile,
    tags: tags.map(t => ({ ...t.tag })) as Array<fragmentTypes.PartialProblem_problemsTags_nodes_tag>,
    testingStatus: ProblemTestingStatus.NotTested, // TODO: make testing in database
  }
}

export function responseToFullProblem(p: fragmentTypes.FullProblem | null | undefined): FullProblem | null | undefined {
  if (!p)
    return p

  if (!p.inputType || !p.outputType)
    throw new Error('Not have input output types')

  return {
    ...responseToPartialProblem(p) as PartialProblem,

    description: p.description.split('\\n').join(String.fromCharCode(13, 10)), // TODO: dev fix, remove in production
    note: p.note,
    limits: {
      time: p.limitTime,
      memory: p.limitMemory,
    },
    io: {
      input: p.inputType,
      output: p.outputType,
    },
    tests: (p.tests.nodes as Array<fragmentTypes.FullProblem_tests_nodes>).map(responseToTest),
  }
}

export function responseToTest(t: fragmentTypes.Test): Test {
  return {
    ...t,
    input: t.input.split('\\n').join(String.fromCharCode(13, 10)),
    output: t.output.split('\\n').join(String.fromCharCode(13, 10)),
    isPublic: t.isPublic || false,
  }
}
