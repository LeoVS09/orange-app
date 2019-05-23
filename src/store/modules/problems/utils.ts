import * as fragmentTypes from "@/api/graphql/fragments/types";
import {FullProblem, PartialProblem, ProblemStatus, ProblemTestingStatus, Test, TestStatus, UserType} from "@/models";
import {PartialUserProfile} from "@/models/user";
import {ProblemReadState} from "@/models/problems";
import {FullProblem_tests_nodes, PartialProblem_problemsTags_nodes} from "@/api/graphql/fragments/types";
import {PartialProblem_problemsTags_nodes_tag} from "@/api/graphql/fragments/types";

export function responseToTest(t: fragmentTypes.Test): Test {
   return {
      id: t.id,
      index: t.index,
      input: t.input.split('\\n').join(String.fromCharCode(13, 10)), // TODO: dev fix, remove in production
      output: t.output.split('\\n').join(String.fromCharCode(13, 10)),
      status: TestStatus.Synced,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      isPublic: t.isPublic || false
   }
}

export function responseToPartialUserProfile(p: fragmentTypes.PartialProfile): PartialUserProfile {
   if(!p.user || !p.user.name)
      throw new Error('Profile not have user')

   return {
      id: p.id,
      userId: p.user.id,
      login: p.user.name ,
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      type: p.isTeacher ? UserType.TEACHER : UserType.CONTESTANT
   }
}

export function responseToPartialProblem(p: fragmentTypes.PartialProblem): PartialProblem {
   if(!p.author)
      throw new Error('Problem not have author')

   const tags = p.problemsTags.nodes as Array<PartialProblem_problemsTags_nodes>

   return {
      id: p.id,
      name: p.name,
      difficulty: p.difficulty || 0,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      publicationDate: p.publicationDate,
      author: responseToPartialUserProfile(p.author),
      tester: p.tester && responseToPartialUserProfile(p.tester),
      tags: tags.map(t => ({ ...t.tag })) as Array<PartialProblem_problemsTags_nodes_tag>,
      readState: ProblemReadState.Partial,
      status: ProblemStatus.Synced,
      testingStatus: ProblemTestingStatus.NotTested // TODO: make testing in database
   }
}

export function responseToFullProblem(p: fragmentTypes.FullProblem): FullProblem {
   if(!p.inputType || !p.outputType)
      throw new Error('Not have input output types')

   return {
      ...responseToPartialProblem(p),

      description: p.description.split('\\n').join(String.fromCharCode(13, 10)), // TODO: dev fix, remove in production
      note: p.note,
      limits: {
         time: p.limitTime,
         memory: p.limitMemory
      },
      io: {
         input: p.inputType,
         output: p.outputType,
      },
      tests: (p.tests.nodes as Array<FullProblem_tests_nodes>).map(responseToTest),
      readState: ProblemReadState.Full
   }
}
