/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Methods to use when ordering `City`.
 */
export enum CitiesOrderBy {
  COUNTRY_ID_ASC = "COUNTRY_ID_ASC",
  COUNTRY_ID_DESC = "COUNTRY_ID_DESC",
  CREATED_AT_ASC = "CREATED_AT_ASC",
  CREATED_AT_DESC = "CREATED_AT_DESC",
  ID_ASC = "ID_ASC",
  ID_DESC = "ID_DESC",
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
  NATURAL = "NATURAL",
  PRIMARY_KEY_ASC = "PRIMARY_KEY_ASC",
  PRIMARY_KEY_DESC = "PRIMARY_KEY_DESC",
  UPDATED_AT_ASC = "UPDATED_AT_ASC",
  UPDATED_AT_DESC = "UPDATED_AT_DESC",
}

/**
 * Methods to use when ordering `Country`.
 */
export enum CountriesOrderBy {
  CREATED_AT_ASC = "CREATED_AT_ASC",
  CREATED_AT_DESC = "CREATED_AT_DESC",
  ID_ASC = "ID_ASC",
  ID_DESC = "ID_DESC",
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
  NATURAL = "NATURAL",
  PRIMARY_KEY_ASC = "PRIMARY_KEY_ASC",
  PRIMARY_KEY_DESC = "PRIMARY_KEY_DESC",
  UPDATED_AT_ASC = "UPDATED_AT_ASC",
  UPDATED_AT_DESC = "UPDATED_AT_DESC",
}

/**
 * Methods to use when ordering `Problem`.
 */
export enum ProblemsOrderBy {
  AUTHOR_ID_ASC = "AUTHOR_ID_ASC",
  AUTHOR_ID_DESC = "AUTHOR_ID_DESC",
  CREATED_AT_ASC = "CREATED_AT_ASC",
  CREATED_AT_DESC = "CREATED_AT_DESC",
  DESCRIPTION_ASC = "DESCRIPTION_ASC",
  DESCRIPTION_DESC = "DESCRIPTION_DESC",
  DIFFICULTY_ASC = "DIFFICULTY_ASC",
  DIFFICULTY_DESC = "DIFFICULTY_DESC",
  ID_ASC = "ID_ASC",
  ID_DESC = "ID_DESC",
  INPUT_DESCRIPTION_ASC = "INPUT_DESCRIPTION_ASC",
  INPUT_DESCRIPTION_DESC = "INPUT_DESCRIPTION_DESC",
  INPUT_TYPE_ID_ASC = "INPUT_TYPE_ID_ASC",
  INPUT_TYPE_ID_DESC = "INPUT_TYPE_ID_DESC",
  LIMIT_MEMORY_ASC = "LIMIT_MEMORY_ASC",
  LIMIT_MEMORY_DESC = "LIMIT_MEMORY_DESC",
  LIMIT_TIME_ASC = "LIMIT_TIME_ASC",
  LIMIT_TIME_DESC = "LIMIT_TIME_DESC",
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
  NATURAL = "NATURAL",
  NOTE_ASC = "NOTE_ASC",
  NOTE_DESC = "NOTE_DESC",
  OUTPUT_DESCRIPTION_ASC = "OUTPUT_DESCRIPTION_ASC",
  OUTPUT_DESCRIPTION_DESC = "OUTPUT_DESCRIPTION_DESC",
  OUTPUT_TYPE_ID_ASC = "OUTPUT_TYPE_ID_ASC",
  OUTPUT_TYPE_ID_DESC = "OUTPUT_TYPE_ID_DESC",
  PRIMARY_KEY_ASC = "PRIMARY_KEY_ASC",
  PRIMARY_KEY_DESC = "PRIMARY_KEY_DESC",
  PUBLICATION_DATE_ASC = "PUBLICATION_DATE_ASC",
  PUBLICATION_DATE_DESC = "PUBLICATION_DATE_DESC",
  TESTER_ID_ASC = "TESTER_ID_ASC",
  TESTER_ID_DESC = "TESTER_ID_DESC",
  UPDATED_AT_ASC = "UPDATED_AT_ASC",
  UPDATED_AT_DESC = "UPDATED_AT_DESC",
}

/**
 * Methods to use when ordering `ProgramInputType`.
 */
export enum ProgramInputTypesOrderBy {
  CODE_ASC = "CODE_ASC",
  CODE_DESC = "CODE_DESC",
  CREATED_AT_ASC = "CREATED_AT_ASC",
  CREATED_AT_DESC = "CREATED_AT_DESC",
  ID_ASC = "ID_ASC",
  ID_DESC = "ID_DESC",
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
  NATURAL = "NATURAL",
  PRIMARY_KEY_ASC = "PRIMARY_KEY_ASC",
  PRIMARY_KEY_DESC = "PRIMARY_KEY_DESC",
  UPDATED_AT_ASC = "UPDATED_AT_ASC",
  UPDATED_AT_DESC = "UPDATED_AT_DESC",
}

/**
 * Methods to use when ordering `ProgramOutputType`.
 */
export enum ProgramOutputTypesOrderBy {
  CODE_ASC = "CODE_ASC",
  CODE_DESC = "CODE_DESC",
  CREATED_AT_ASC = "CREATED_AT_ASC",
  CREATED_AT_DESC = "CREATED_AT_DESC",
  ID_ASC = "ID_ASC",
  ID_DESC = "ID_DESC",
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
  NATURAL = "NATURAL",
  PRIMARY_KEY_ASC = "PRIMARY_KEY_ASC",
  PRIMARY_KEY_DESC = "PRIMARY_KEY_DESC",
  UPDATED_AT_ASC = "UPDATED_AT_ASC",
  UPDATED_AT_DESC = "UPDATED_AT_DESC",
}

/**
 * Methods to use when ordering `Tag`.
 */
export enum TagsOrderBy {
  CREATED_AT_ASC = "CREATED_AT_ASC",
  CREATED_AT_DESC = "CREATED_AT_DESC",
  ID_ASC = "ID_ASC",
  ID_DESC = "ID_DESC",
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
  NATURAL = "NATURAL",
  PRIMARY_KEY_ASC = "PRIMARY_KEY_ASC",
  PRIMARY_KEY_DESC = "PRIMARY_KEY_DESC",
  UPDATED_AT_ASC = "UPDATED_AT_ASC",
  UPDATED_AT_DESC = "UPDATED_AT_DESC",
}

/**
 * A condition to be used against `City` object types. All fields are tested for equality and combined with a logical ‘and.’
 */
export interface CityCondition {
  id?: any | null;
  name?: string | null;
  countryId?: any | null;
  createdAt?: any | null;
  updatedAt?: any | null;
}

/**
 * A condition to be used against `Country` object types. All fields are tested for equality and combined with a logical ‘and.’
 */
export interface CountryCondition {
  id?: any | null;
  name?: string | null;
  createdAt?: any | null;
  updatedAt?: any | null;
}

/**
 * All input for the create `Problem` mutation.
 */
export interface CreateProblemInput {
  clientMutationId?: string | null;
  problem: ProblemInput;
}

/**
 * All input for the create `ProgramInputType` mutation.
 */
export interface CreateProgramInputTypeInput {
  clientMutationId?: string | null;
  programInputType: ProgramInputTypeInput;
}

/**
 * All input for the create `ProgramOutputType` mutation.
 */
export interface CreateProgramOutputTypeInput {
  clientMutationId?: string | null;
  programOutputType: ProgramOutputTypeInput;
}

/**
 * All input for the create `Tag` mutation.
 */
export interface CreateTagInput {
  clientMutationId?: string | null;
  tag: TagInput;
}

/**
 * All input for the create `Test` mutation.
 */
export interface CreateTestInput {
  clientMutationId?: string | null;
  test: TestInput;
}

/**
 * All input for the `deleteProblem` mutation.
 */
export interface DeleteProblemInput {
  clientMutationId?: string | null;
  id: any;
}

/**
 * All input for the `deleteProgramInputType` mutation.
 */
export interface DeleteProgramInputTypeInput {
  clientMutationId?: string | null;
  id: any;
}

/**
 * All input for the `deleteProgramOutputType` mutation.
 */
export interface DeleteProgramOutputTypeInput {
  clientMutationId?: string | null;
  id: any;
}

/**
 * All input for the `deleteTag` mutation.
 */
export interface DeleteTagInput {
  clientMutationId?: string | null;
  id: any;
}

/**
 * All input for the `deleteTest` mutation.
 */
export interface DeleteTestInput {
  clientMutationId?: string | null;
  id: any;
}

/**
 * A condition to be used against `Problem` object types. All fields are tested for equality and combined with a logical ‘and.’
 */
export interface ProblemCondition {
  id?: any | null;
  name?: string | null;
  description?: string | null;
  inputDescription?: string | null;
  outputDescription?: string | null;
  note?: string | null;
  inputTypeId?: any | null;
  outputTypeId?: any | null;
  limitTime?: number | null;
  limitMemory?: number | null;
  difficulty?: number | null;
  createdAt?: any | null;
  updatedAt?: any | null;
  publicationDate?: any | null;
  authorId?: any | null;
  testerId?: any | null;
}

/**
 * An input for mutations affecting `Problem`
 */
export interface ProblemInput {
  name: string;
  description: string;
  note?: string | null;
  inputTypeId: any;
  outputTypeId: any;
  limitTime: number;
  limitMemory: number;
  publicationDate?: any | null;
  authorId: any;
  testerId?: any | null;
}

/**
 * Represents an update to a `Problem`. Fields that are set will be updated.
 */
export interface ProblemPatch {
  name?: string | null;
  description?: string | null;
  note?: string | null;
  inputTypeId?: any | null;
  outputTypeId?: any | null;
  limitTime?: number | null;
  limitMemory?: number | null;
  publicationDate?: any | null;
  authorId?: any | null;
  testerId?: any | null;
}

/**
 * A condition to be used against `ProgramInputType` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export interface ProgramInputTypeCondition {
  id?: any | null;
  name?: string | null;
  code?: string | null;
  createdAt?: any | null;
  updatedAt?: any | null;
}

/**
 * An input for mutations affecting `ProgramInputType`
 */
export interface ProgramInputTypeInput {
  name: string;
  code: string;
}

/**
 * Represents an update to a `ProgramInputType`. Fields that are set will be updated.
 */
export interface ProgramInputTypePatch {
  name?: string | null;
  code?: string | null;
}

/**
 * A condition to be used against `ProgramOutputType` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export interface ProgramOutputTypeCondition {
  id?: any | null;
  name?: string | null;
  code?: string | null;
  createdAt?: any | null;
  updatedAt?: any | null;
}

/**
 * An input for mutations affecting `ProgramOutputType`
 */
export interface ProgramOutputTypeInput {
  name: string;
  code: string;
}

/**
 * Represents an update to a `ProgramOutputType`. Fields that are set will be updated.
 */
export interface ProgramOutputTypePatch {
  name?: string | null;
  code?: string | null;
}

/**
 * A condition to be used against `Tag` object types. All fields are tested for equality and combined with a logical ‘and.’
 */
export interface TagCondition {
  id?: any | null;
  name?: string | null;
  createdAt?: any | null;
  updatedAt?: any | null;
}

/**
 * An input for mutations affecting `Tag`
 */
export interface TagInput {
  name: string;
}

/**
 * Represents an update to a `Tag`. Fields that are set will be updated.
 */
export interface TagPatch {
  name?: string | null;
}

/**
 * An input for mutations affecting `Test`
 */
export interface TestInput {
  index: number;
  input: string;
  output: string;
  isPublic?: boolean | null;
}

/**
 * Represents an update to a `Test`. Fields that are set will be updated.
 */
export interface TestPatch {
  index?: number | null;
  input?: string | null;
  output?: string | null;
  isPublic?: boolean | null;
}

/**
 * All input for the `updateProblem` mutation.
 */
export interface UpdateProblemInput {
  clientMutationId?: string | null;
  patch: ProblemPatch;
  id: any;
}

/**
 * All input for the `updateProgramInputType` mutation.
 */
export interface UpdateProgramInputTypeInput {
  clientMutationId?: string | null;
  patch: ProgramInputTypePatch;
  id: any;
}

/**
 * All input for the `updateProgramOutputType` mutation.
 */
export interface UpdateProgramOutputTypeInput {
  clientMutationId?: string | null;
  patch: ProgramOutputTypePatch;
  id: any;
}

/**
 * All input for the `updateTag` mutation.
 */
export interface UpdateTagInput {
  clientMutationId?: string | null;
  patch: TagPatch;
  id: any;
}

/**
 * All input for the `updateTest` mutation.
 */
export interface UpdateTestInput {
  clientMutationId?: string | null;
  patch: TestPatch;
  id: any;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
