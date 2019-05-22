import {PartialUserProfile} from "./user";
import {Test} from "@/models/tests";

export {
   defaultProblem,
   defaultPartialProfile,
   defaultTest,
   mockTag,
   mockOutput,
   mockInput,
   mockTags
} from './mock/mock'

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


export interface Tag {
   id: string
   name: string
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
   id: string,
   name: string
}

export interface PartialProgramOutput extends PartialProgramInput {
}

export interface ProblemError {
   problemId: string
   readState?: ProblemReadState
   status: ProblemStatus
   testingStatus?: ProblemTestingStatus
}
