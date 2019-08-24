import {PartialUserProfile, UserType} from './user'
import {Test} from '@/models/tests'
import {ModelReadState, ModelStatus} from '@/store/modules/statuses/types'
import {defaultPartialProfile, mockInput, mockOutput, mockTag} from '@/models/mock/mock'
import {Repository} from '@/lazyDB'
import {ModelAttributeType} from "@/lazyDB/core/types";

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
      problemsTags: ModelAttributeType.OneToMany,
   },
)

export const ProblemRepository = new Repository(
   'problem',
   {
      author: ModelAttributeType.OneToOne,
      tester: ModelAttributeType.OneToOne,
      inputType: ModelAttributeType.OneToOne,
      outputType: ModelAttributeType.OneToOne,
      tests: ModelAttributeType.OneToMany,
      problemsTags: ModelAttributeType.OneToMany,
   },
)

export const ProblemsTagRepository = new Repository(
   'problemsTag',
   {
      problem: ModelAttributeType.OneToOne,
      tag: ModelAttributeType.OneToOne,
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
   tags: Tag[]
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
   tests: Test[]
}


export interface Tag {
   id: string
   name: string
   createdAt: Date
   updatedAt: Date

   problemsTags?: ProblemTag[]
}

export interface ProblemTag {
   nodeId: string
   createdAt: Date
   updatedAt: Date

   problem: PartialProblem
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

      tags: [mockTag('some'), mockTag('tags')],

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
