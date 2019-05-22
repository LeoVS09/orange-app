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
