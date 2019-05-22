import {
   FullProblem,
   PartialProgramInput,
   PartialProgramOutput, ProblemReadState,
   ProblemStatus, ProblemTestingStatus,
   Tag,
} from "@/models/problems";
import {PartialUserProfile, UserType} from "@/models/user";
import {randomId} from "@/components/utils";
import {Test, TestStatus} from "@/models/tests";


export function defaultPartialProfile(): PartialUserProfile {
   return {
      id: randomId(),
      userId: randomId(),
      login: 'SomeUser',
      firstName: 'First',
      lastName: 'Last',
      type: UserType.CONTESTANT
   }
}

export function defaultProblem(): FullProblem {
   return {
      id: '',
      name: '',
      description: '',
      difficulty: 0,

      createdAt: new Date(),
      updatedAt: new Date(),
      publicationDate: new Date(),

      author: {
         ...defaultPartialProfile(),
         login: 'Author',
         type: UserType.TEACHER
      },

      tester: {
         ...defaultPartialProfile(),
         login: 'Tester',
         type: UserType.TEACHER
      },

      tags: [mockTag('some'), mockTag('tags')],

      limits: {
         time: 30000,
         memory: 2048
      },

      io: {
         input: mockInput('stdin'),
         output: mockOutput('stdout'),
      },

      status: ProblemStatus.Synced,
      readState: ProblemReadState.Full,
      testingStatus: ProblemTestingStatus.NotTested,

      tests: []
   }
}

export function defaultTest(): Test {
   return {
      id: "",
      index: 0,
      input: "",
      output: "",
      status: TestStatus.ForCreate,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false
   }
}

export function mockTag(name: string): Tag {
   return {
      id: 'test-' + name,
      name
   }
}

export function mockTags(): Array<Tag> {
   return [
      'implementation',
      'math',
      'greedy',
      'brute force',
      'data structures',
      'constructive algorithms',
      'sorting',
      'binary search',
      'graphs',
      'trees',
      'strings',
      'number theory',
      'geometry',
      'combinatorics',
      'two pointers',
      'bitmasks',
      'probabilities',
      'shortest paths',
      'hashing',
      'divide and conquer',
      'games',
      'matrices',
      'flows',
      'string suffix structures',
      'expression parsing',
      'graph matchings',
      'ternary search',
      'meet-in-the-middle',
      '2-set',
      'chinese remainder theorem',
      'schedules'
   ].map(mockTag)
}

export function mockInput(name: string): PartialProgramInput {
   return {
      id: 'tests.ts' + name,
      name
   }
}

export function mockOutput(name: string): PartialProgramOutput {
   return {
      id: 'tests.ts' + name,
      name
   }
}
