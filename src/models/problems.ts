import { Test } from '@/models/tests'
import { ModelReadState, ModelStatus } from '@/store/modules/statuses/types'
import {
  defaultPartialProfile, mockInput, mockOutput, mockTag
} from '@/models/mock/mock'
import { Repository } from '@/lazyDB'
import { AosFieldType } from '@/abstractObjectScheme'
import { PartialUserProfile, UserType, Profile } from './user'

export {
  defaultPartialProfile,
  mockTag,
  mockOutput,
  mockInput,
  mockTags
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
      problemsTags: AosFieldType.OneToMany
    }
  }
)

export const ProblemRepository = new Repository(
  'problem',
  {
    fields: {
      author: {
        type: AosFieldType.OneToOne,
        table: 'profile'
      },
      tester: {
        type: AosFieldType.OneToOne,
        table: 'profile'
      },
      inputType: AosFieldType.OneToOne,
      outputType: AosFieldType.OneToOne,
      tests: AosFieldType.OneToMany,
      problemsTags: AosFieldType.OneToMany
    }
  }
)

export const ProgramInputType = new Repository(
  'programInputType',
  {
    fields: {
      problemsByInputTypeId: AosFieldType.OneToMany
    }
  }
)

export const ProgramOutputType = new Repository(
  'programOutputType',
  {
    fields: {
      problemsByOutputTypeId: AosFieldType.OneToMany
    }
  }
)

export const ProblemsTagRepository = new Repository(
  'problemsTag',
  {
    fields: {
      problem: AosFieldType.OneToOne,
      tag: AosFieldType.OneToOne
    }
  }
)

export interface Problem {
  id: string
  name: string | null

  description: string | null
  inputDescription: string | null
  outputDescription: string | null

  note: string // TODO: make nullable

  inputTypeId: string
  outputTypeId: string
  limitTime: number
  limitMemory: number

  difficulty: number

  createdAt: Date
  updatedAt: Date
  publicationDate: Date | null

  authorId: string
  testerId: string | null

  inputType: ProgramInputType
  outputType: ProgramOutputType

  author: Profile
  tester: Profile | null

  problemsTags: {
    nodes: Array<ProblemsTag>
    totalCount: number
  }
}

export interface ProgramInputType {
  id: string
  name: string
  code: string
  createdAt: Date
  updatedAt: Date
}

export type ProgramOutputType = ProgramInputType

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
     totalCount: number
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
      type: UserType.TEACHER
    },

    tester: {
      ...defaultPartialProfile(),
      login: 'Tester',
      type: UserType.TEACHER
    },

    problemsTags: {
      nodes: [],
      totalCount: 0
    },

    // tags: [mockTag('some'), mockTag('tags')],

    limits: {
      time: 30000,
      memory: 2048
    },

    io: {
      input: mockInput('stdin'),
      output: mockOutput('stdout')
    },

    testingStatus: ProblemTestingStatus.NotTested,

    tests: []
  }
}

export enum ProblemFilter {
  All = 'All',
  Public = 'Open',
  NotPublic = 'Closed',
  Resolved = 'Resolved',
}
