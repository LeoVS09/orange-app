import {
   PartialProgramInput,
   PartialProgramOutput,
   Tag,
} from '@/models/problems'
import { PartialUserProfile, UserType} from '@/models/user'
import { randomId} from '@/components/utils'


export function defaultPartialProfile(): PartialUserProfile {
   return {
      id: randomId(),
      userId: randomId(),
      login: 'SomeUser',
      firstName: 'First',
      lastName: 'Last',
      type: UserType.CONTESTANT,
   }
}



export function mockTag(name: string): Tag {
   return {
      id: 'test-' + name,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      'schedules',
   ].map(mockTag)
}

export function mockInput(name: string): PartialProgramInput {
   return {
      id: 'tests.ts' + name,
      name,
   }
}

export function mockOutput(name: string): PartialProgramOutput {
   return {
      id: 'tests.ts' + name,
      name,
   }
}
