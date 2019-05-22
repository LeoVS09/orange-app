import {
   ResponseDataPartialProblem,
   ResponseDataPartialProfile,
   ResponseDataProblem,
   ResponseDataTest
} from "@/api/graphql/fragments/types";
import {FullProblem, PartialProblem, ProblemStatus, ProblemTestingStatus, Test, TestStatus, UserType} from "@/models";
import {PartialUserProfile} from "@/models/user";
import {ProblemReadState} from "@/models/problems";

export function responseToTest(t: ResponseDataTest): Test {
   return {
      id: t.id,
      index: t.index,
      input: t.input.split('\\n').join(String.fromCharCode(13, 10)), // TODO: dev fix, remove in production
      output: t.output.split('\\n').join(String.fromCharCode(13, 10)),
      status: TestStatus.Synced,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      isPublic: t.isPublic
   }
}

export function responseToPartialUserProfile(p: ResponseDataPartialProfile): PartialUserProfile {
   return {
      id: p.id,
      userId: p.user.id,
      login: p.user.name,
      firstName: p.firstName,
      lastName: p.lastName,
      type: p.isTeacher ? UserType.TEACHER : UserType.CONTESTANT
   }
}

export function responseToPartialProblem(p: ResponseDataPartialProblem): PartialProblem {
   return {
      id: p.id,
      name: p.name,
      difficulty: p.difficulty,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      publicationDate: p.publicationDate,
      author: responseToPartialUserProfile(p.author),
      tester: responseToPartialUserProfile(p.tester),
      tags: p.problemsTags.nodes.map(t => ({ ...t.tag })),
      readState: ProblemReadState.Partial,
      status: ProblemStatus.Synced,
      testingStatus: ProblemTestingStatus.NotTested // TODO: make testing in database
   }
}

export function responseToFullProblem(p: ResponseDataProblem): FullProblem {
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
      tests: p.tests.nodes.map(responseToTest),
      readState: ProblemReadState.Full
   }
}
