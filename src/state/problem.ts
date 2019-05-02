export interface Problem {
   id: string,
   name: string,
   description: string,
   note?: string,
   examples: Array<Test>,
   isOpen: boolean,
   createdAt: Date,
   updatedAt: Date,
   publishedAt: Date,
   author: string,
   tester: string,
   tags: Array<Tag>,
   limits: {
      time: number, // ms
      memory: number // byte
   }
   io: {
      input: ProgramInput,
      output: ProgramOutput
   },
   resultRun?: ResultRunProgram,
   tests?: Array<Test>,
   synced: boolean
}

export function defaultProblem(): Problem {
   return {
      id: '',
      name: '',
      description: '',
      examples: [],
      isOpen: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      author: "Author",
      tester: "Tester",
      tags: [mockTag('some'), mockTag('tags')],
      limits: {
         time: 30000,
         memory: 2048
      },
      io: {
         input: mockInput('stdin'),
         output: mockOutput('stdout'),
      },
      synced: false
   }
}

export function mockTag(name: string): Tag {
   return {
      id: 'test' + name,
      name
   }
}

export function mockInput(name: string): ProgramInput {
   return {
      id: 'test' + name,
      name
   }
}

export function mockOutput(name: string): ProgramOutput {
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
   problemId: string,
   isAllTestsSuccessful: boolean,
   failedTest: number
}

export interface ProgramInput {
   id: string,
   name: string
}

export interface ProgramOutput extends ProgramInput {
}

export interface Test {
   id: string,
   input: string,
   output: string,
   synced: boolean
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
