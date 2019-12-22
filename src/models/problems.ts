import { PartialUserProfile, UserType } from './user'
import { Test } from '@/models/tests'
import { ModelReadState, ModelStatus } from '@/store/modules/statuses/types'
import {
  defaultPartialProfile, mockInput, mockOutput, mockTag,
} from '@/models/mock/mock'
import { Repository } from '@/lazyDB'
import { AosFieldType } from '@/abstractObjectScheme'

export {
  defaultPartialProfile,
  mockTag,
  mockOutput,
  mockInput,
  mockTags,
} from './mock/mock'

export enum ProblemTestingStatus {
   NotTested = 'NotTested',
   Testing = 'Testing',
   AlmostSolved = 'AlmostSolved',
   Solved = 'Solved',
   Error = 'Error',
}

export const TagRepository = new Repository(
  'tag',
  {
    fields: {
      problemsTags: AosFieldType.OneToMany,
    },
  },
)

export const ProblemRepository = new Repository(
  'problem',
  {
    fields: {
      author: AosFieldType.OneToOne,
      tester: AosFieldType.OneToOne,
      inputType: AosFieldType.OneToOne,
      outputType: AosFieldType.OneToOne,
      tests: AosFieldType.OneToMany,
      problemsTags: AosFieldType.OneToMany,
    },
  },
)

export const ProblemsTagRepository = new Repository(
  'problemsTag',
  {
    fields: {
      problem: AosFieldType.OneToOne,
      tag: AosFieldType.OneToOne,
    },
  },
)

export interface PartialProblem {
   id: string
   name: string

   createdAt: Date
   updatedAt: Date
   publicationDate: Date

   difficulty: number

   author: PartialUserProfile
   tester: PartialUserProfile | null

   testingStatus: ProblemTestingStatus
   problemsTags: {
     nodes: Array<ProblemsTag>
   }
}

export interface ProblemsTag {
  id: string
  createdAt: Date
  updatedAt: Date

  tag: Tag

  problem: FullProblem
}

export interface FullProblem extends PartialProblem {
   description: string
   note: string | null

   limits: {
      time: number // ms
      memory: number, // byte
   }

   io: {
      input: PartialProgramInput
      output: PartialProgramOutput,
   }

   resultRun?: ResultRunProgram
   tests: Array<Test>
}

export interface Tag {
   id: string
   name: string
   createdAt: Date
   updatedAt: Date

   problemsTags?: {
     nodes: Array<ProblemsTag>
   }
}

// TODO: refactor to solution
export interface ResultRunProgram {
   problemId: string
   isAllTestsSuccessful: boolean
   failedTest: number
   isCompilationSuccessful: boolean
   isUnexpectedError: boolean
   status: number
}

export interface PartialProgramInput {
   id: string
   name: string
}

export interface PartialProgramOutput extends PartialProgramInput {
}

export interface ProblemError {
   problemId: string
   readState: ModelReadState
   status: ModelStatus
   testingStatus?: ProblemTestingStatus
}

export function defaultProblem(): FullProblem {
  return {
    id: '',
    name: '',
    description: '',
    difficulty: 0,
    note: '',

    createdAt: new Date(),
    updatedAt: new Date(),
    publicationDate: new Date(),

    author: {
      ...defaultPartialProfile(),
      login: 'Author',
      type: UserType.TEACHER,
    },

    tester: {
      ...defaultPartialProfile(),
      login: 'Tester',
      type: UserType.TEACHER,
    },

    problemsTags: {
      nodes: [],
    },

    // tags: [mockTag('some'), mockTag('tags')],

    limits: {
      time: 30000,
      memory: 2048,
    },

    io: {
      input: mockInput('stdin'),
      output: mockOutput('stdout'),
    },

    testingStatus: ProblemTestingStatus.NotTested,

    tests: [],
  }
}
