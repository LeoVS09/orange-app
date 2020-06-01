import { Test } from '@/models/tests'
import { ModelReadState, ModelStatus } from '@/store/modules/statuses/types'
import { PartialUserProfile, Profile } from './user'

export enum ProblemTestingStatus {
   NotTested = 'NotTested',
   Testing = 'Testing',
   AlmostSolved = 'AlmostSolved',
   Solved = 'Solved',
   Error = 'Error',
}

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

export enum ProblemFilter {
  All = 'All',
  Public = 'Open',
  NotPublic = 'Closed',
  Resolved = 'Resolved',
}
