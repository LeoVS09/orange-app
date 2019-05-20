import {PartialUserProfile, UserType} from "./user";
import {randomId} from "@/components/utils";

export enum ProblemStatus {
   Reading = 'Reading',
   Synced = 'Synced',
   Changed = 'Changed',
   Updating = 'Updating',
   ForCreate = 'For create',
   Creating = 'Creating',
   Deleting = 'Deleting',
   ErrorReading = 'Error loading',
   ErrorUpdating = 'Error syncing',
   ErrorCreating = 'Error creating',
   ErrorDeleting = 'Error deleting',
}

export enum ProblemReadState {
   Partial = 'Partial',
   Full = 'Full'
}

export enum ProblemTestingStatus {
   NotTested = 'NotTested',
   Testing = 'Testing',
   AlmostSolved = 'AlmostSolved',
   Solved = 'Solved',
   Error = 'Error'
}

interface BaseProblem {
   id: string
   name: string

   createdAt: Date
   updatedAt: Date
   publicationDate: Date

   difficulty: number

   author: PartialUserProfile
   tester: PartialUserProfile

   status: ProblemStatus
   testingStatus: ProblemTestingStatus
   tags: Array<Tag>
}

export interface PartialProblem extends BaseProblem {
   readState: ProblemReadState.Partial
}

export interface FullProblem extends BaseProblem {
   description: string
   note?: string

   limits: {
      time: number // ms
      memory: number // byte
   }

   io: {
      input: PartialProgramInput
      output: PartialProgramOutput
   }

   resultRun?: ResultRunProgram
   tests: Array<Test>
   readState: ProblemReadState.Full
}

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
      id: 'test' + name,
      name
   }
}

export function mockOutput(name: string): PartialProgramOutput {
   return {
      id: 'test' + name,
      name
   }
}

export interface Tag {
   id: string
   name: string
}

export interface ResultRunProgram {
   problemId: string
   isAllTestsSuccessful: boolean
   failedTest: number
   isCompilationSuccessful: boolean
   isUnexpectedError: boolean
   status: number
}

export interface PartialProgramInput {
   id: string,
   name: string
}

export interface PartialProgramOutput extends PartialProgramInput {
}

export enum TestStatus {
   ForCreate = 'ForCreate',
   Creating = 'Creating',
   Changed = 'Changed',
   Updating = 'Updating',
   Synced = 'Synced',
   Deleting = 'Deleting',
   ErrorCreating = 'ErrorCreating',
   ErrorUpdating = 'ErrorUpdating',
   ErrorDeleting = 'ErrorDeleting'
}

export interface Test {
   id: string
   index: number
   input: string
   output: string
   status: TestStatus
   isPublic: boolean
   createdAt: Date
   updatedAt: Date
}

export interface ResultOfTest {
   id: string,
   test: string,
   solved: boolean,
   time: number
}

export interface ResultOfProblem {
   id: string,
   member: string,
   testsResults: Array<ResultOfTest>
}

export interface ProblemError {
   problemId: string
   readState?: ProblemReadState
   status: ProblemStatus
   testingStatus?: ProblemTestingStatus
}
