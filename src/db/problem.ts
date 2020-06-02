import { AosFieldType } from '@/abstractObjectSchema'
import { Repository } from '@/lazyDB'
import {
  Tag,
  Problem,
  ProgramInputType,
  ProgramOutputType,
  ProblemsTag,
  Test
} from '@/models'

export const TagRepository = new Repository<Tag>(
  'tag',
  {
    fields: {
      problemsTags: AosFieldType.OneToMany
    }
  }
)

export const ProblemRepository = new Repository<Problem>(
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
      inputType: {
        type: AosFieldType.OneToOne,
        table: 'programInputType'
      },
      outputType: {
        type: AosFieldType.OneToOne,
        table: 'programOutputType'
      },
      tests: AosFieldType.OneToMany,
      problemsTags: AosFieldType.OneToMany
    }
  }
)

export const ProgramInputTypeRepository = new Repository<ProgramInputType>(
  'programInputType',
  {
    fields: {
      problemsByInputTypeId: AosFieldType.OneToMany
    }
  }
)

export const ProgramOutputTypeRepository = new Repository<ProgramOutputType>(
  'programOutputType',
  {
    fields: {
      problemsByOutputTypeId: AosFieldType.OneToMany
    }
  }
)

export const ProblemsTagRepository = new Repository<ProblemsTag>(
  'problemsTag',
  {
    fields: {
      problem: AosFieldType.OneToOne,
      tag: AosFieldType.OneToOne
    }
  }
)

export const Tests = new Repository<Test>(
  'test',
  {
    fields: {
      problem: AosFieldType.OneToOne
    }
  }
)
