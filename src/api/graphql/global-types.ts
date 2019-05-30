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
 * Methods to use when ordering `CodeEditor`.
 */
export enum CodeEditorsOrderBy {
  ALIAS_ASC = "ALIAS_ASC",
  ALIAS_DESC = "ALIAS_DESC",
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
  VERSION_ASC = "VERSION_ASC",
  VERSION_DESC = "VERSION_DESC",
}

/**
 * Methods to use when ordering `Compiler`.
 */
export enum CompilersOrderBy {
  ALIAS_ASC = "ALIAS_ASC",
  ALIAS_DESC = "ALIAS_DESC",
  CODE_ASC = "CODE_ASC",
  CODE_DESC = "CODE_DESC",
  COMMENT_ASC = "COMMENT_ASC",
  COMMENT_DESC = "COMMENT_DESC",
  CREATED_AT_ASC = "CREATED_AT_ASC",
  CREATED_AT_DESC = "CREATED_AT_DESC",
  ID_ASC = "ID_ASC",
  ID_DESC = "ID_DESC",
  IS_INTERPRETER_ASC = "IS_INTERPRETER_ASC",
  IS_INTERPRETER_DESC = "IS_INTERPRETER_DESC",
  LANGUAGE_ID_ASC = "LANGUAGE_ID_ASC",
  LANGUAGE_ID_DESC = "LANGUAGE_ID_DESC",
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
  NATURAL = "NATURAL",
  PRIMARY_KEY_ASC = "PRIMARY_KEY_ASC",
  PRIMARY_KEY_DESC = "PRIMARY_KEY_DESC",
  UPDATED_AT_ASC = "UPDATED_AT_ASC",
  UPDATED_AT_DESC = "UPDATED_AT_DESC",
  VERSION_ASC = "VERSION_ASC",
  VERSION_DESC = "VERSION_DESC",
}

/**
 * Methods to use when ordering `Contest`.
 */
export enum ContestsOrderBy {
  CREATED_AT_ASC = "CREATED_AT_ASC",
  CREATED_AT_DESC = "CREATED_AT_DESC",
  CREATOR_ID_ASC = "CREATOR_ID_ASC",
  CREATOR_ID_DESC = "CREATOR_ID_DESC",
  END_DATE_ASC = "END_DATE_ASC",
  END_DATE_DESC = "END_DATE_DESC",
  END_PUBLICATION_DATE_ASC = "END_PUBLICATION_DATE_ASC",
  END_PUBLICATION_DATE_DESC = "END_PUBLICATION_DATE_DESC",
  ID_ASC = "ID_ASC",
  ID_DESC = "ID_DESC",
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
  NATURAL = "NATURAL",
  PRIMARY_KEY_ASC = "PRIMARY_KEY_ASC",
  PRIMARY_KEY_DESC = "PRIMARY_KEY_DESC",
  START_DATE_ASC = "START_DATE_ASC",
  START_DATE_DESC = "START_DATE_DESC",
  START_PUBLICATION_DATE_ASC = "START_PUBLICATION_DATE_ASC",
  START_PUBLICATION_DATE_DESC = "START_PUBLICATION_DATE_DESC",
  TEXT_ASC = "TEXT_ASC",
  TEXT_DESC = "TEXT_DESC",
  UPDATED_AT_ASC = "UPDATED_AT_ASC",
  UPDATED_AT_DESC = "UPDATED_AT_DESC",
}

/**
 * Methods to use when ordering `Country`.
 */
export enum CountriesOrderBy {
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
 * Methods to use when ordering `Profile`.
 */
export enum ProfilesOrderBy {
  CITY_ID_ASC = "CITY_ID_ASC",
  CITY_ID_DESC = "CITY_ID_DESC",
  COURSE_ASC = "COURSE_ASC",
  COURSE_DESC = "COURSE_DESC",
  CREATED_AT_ASC = "CREATED_AT_ASC",
  CREATED_AT_DESC = "CREATED_AT_DESC",
  FIRST_NAME_ASC = "FIRST_NAME_ASC",
  FIRST_NAME_DESC = "FIRST_NAME_DESC",
  GROUP_NUMBER_ASC = "GROUP_NUMBER_ASC",
  GROUP_NUMBER_DESC = "GROUP_NUMBER_DESC",
  ID_ASC = "ID_ASC",
  ID_DESC = "ID_DESC",
  IS_TEACHER_ASC = "IS_TEACHER_ASC",
  IS_TEACHER_DESC = "IS_TEACHER_DESC",
  LAST_NAME_ASC = "LAST_NAME_ASC",
  LAST_NAME_DESC = "LAST_NAME_DESC",
  MIDDLE_NAME_ASC = "MIDDLE_NAME_ASC",
  MIDDLE_NAME_DESC = "MIDDLE_NAME_DESC",
  NATURAL = "NATURAL",
  PHONE_ASC = "PHONE_ASC",
  PHONE_DESC = "PHONE_DESC",
  PRIMARY_KEY_ASC = "PRIMARY_KEY_ASC",
  PRIMARY_KEY_DESC = "PRIMARY_KEY_DESC",
  UNIVERSITY_ID_ASC = "UNIVERSITY_ID_ASC",
  UNIVERSITY_ID_DESC = "UNIVERSITY_ID_DESC",
  UPDATED_AT_ASC = "UPDATED_AT_ASC",
  UPDATED_AT_DESC = "UPDATED_AT_DESC",
  USER_ID_ASC = "USER_ID_ASC",
  USER_ID_DESC = "USER_ID_DESC",
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
 * Methods to use when ordering `ProgrammingLanguage`.
 */
export enum ProgrammingLanguagesOrderBy {
  ALIAS_ASC = "ALIAS_ASC",
  ALIAS_DESC = "ALIAS_DESC",
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
  VERSION_ASC = "VERSION_ASC",
  VERSION_DESC = "VERSION_DESC",
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
 * Methods to use when ordering `Team`.
 */
export enum TeamsOrderBy {
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
 * Methods to use when ordering `Test`.
 */
export enum TestsOrderBy {
  CREATED_AT_ASC = "CREATED_AT_ASC",
  CREATED_AT_DESC = "CREATED_AT_DESC",
  ID_ASC = "ID_ASC",
  ID_DESC = "ID_DESC",
  INDEX_ASC = "INDEX_ASC",
  INDEX_DESC = "INDEX_DESC",
  INPUT_ASC = "INPUT_ASC",
  INPUT_DESC = "INPUT_DESC",
  IS_PUBLIC_ASC = "IS_PUBLIC_ASC",
  IS_PUBLIC_DESC = "IS_PUBLIC_DESC",
  NATURAL = "NATURAL",
  OUTPUT_ASC = "OUTPUT_ASC",
  OUTPUT_DESC = "OUTPUT_DESC",
  PRIMARY_KEY_ASC = "PRIMARY_KEY_ASC",
  PRIMARY_KEY_DESC = "PRIMARY_KEY_DESC",
  PROBLEM_ID_ASC = "PROBLEM_ID_ASC",
  PROBLEM_ID_DESC = "PROBLEM_ID_DESC",
  UPDATED_AT_ASC = "UPDATED_AT_ASC",
  UPDATED_AT_DESC = "UPDATED_AT_DESC",
}

/**
 * Methods to use when ordering `University`.
 */
export enum UniversitiesOrderBy {
  CITY_ID_ASC = "CITY_ID_ASC",
  CITY_ID_DESC = "CITY_ID_DESC",
  CREATED_AT_ASC = "CREATED_AT_ASC",
  CREATED_AT_DESC = "CREATED_AT_DESC",
  ID_ASC = "ID_ASC",
  ID_DESC = "ID_DESC",
  LONG_NAME_ASC = "LONG_NAME_ASC",
  LONG_NAME_DESC = "LONG_NAME_DESC",
  NATURAL = "NATURAL",
  PRIMARY_KEY_ASC = "PRIMARY_KEY_ASC",
  PRIMARY_KEY_DESC = "PRIMARY_KEY_DESC",
  SHORT_NAME_ASC = "SHORT_NAME_ASC",
  SHORT_NAME_DESC = "SHORT_NAME_DESC",
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
 * An input for mutations affecting `City`
 */
export interface CityInput {
  name: string;
  countryId: any;
}

/**
 * Represents an update to a `City`. Fields that are set will be updated.
 */
export interface CityPatch {
  name?: string | null;
  countryId?: any | null;
}

/**
 * A condition to be used against `CodeEditor` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export interface CodeEditorCondition {
  id?: any | null;
  name?: string | null;
  alias?: string | null;
  version?: string | null;
  createdAt?: any | null;
  updatedAt?: any | null;
}

/**
 * A condition to be used against `Compiler` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export interface CompilerCondition {
  id?: any | null;
  name?: string | null;
  alias?: string | null;
  code?: string | null;
  version?: string | null;
  languageId?: any | null;
  comment?: string | null;
  isInterpreter?: boolean | null;
  createdAt?: any | null;
  updatedAt?: any | null;
}

/**
 * A condition to be used against `Contest` object types. All fields are tested for equality and combined with a logical ‘and.’
 */
export interface ContestCondition {
  id?: any | null;
  name?: string | null;
  text?: string | null;
  creatorId?: any | null;
  startDate?: any | null;
  endDate?: any | null;
  startPublicationDate?: any | null;
  endPublicationDate?: any | null;
  createdAt?: any | null;
  updatedAt?: any | null;
}

/**
 * A condition to be used against `Country` object types. All fields are tested for equality and combined with a logical ‘and.’
 */
export interface CountryCondition {
  id?: any | null;
  name?: string | null;
  code?: string | null;
  createdAt?: any | null;
  updatedAt?: any | null;
}

/**
 * An input for mutations affecting `Country`
 */
export interface CountryInput {
  name: string;
  code: string;
}

/**
 * Represents an update to a `Country`. Fields that are set will be updated.
 */
export interface CountryPatch {
  name?: string | null;
  code?: string | null;
}

/**
 * All input for the create `City` mutation.
 */
export interface CreateCityInput {
  clientMutationId?: string | null;
  city: CityInput;
}

/**
 * All input for the create `Country` mutation.
 */
export interface CreateCountryInput {
  clientMutationId?: string | null;
  country: CountryInput;
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
 * All input for the create `University` mutation.
 */
export interface CreateUniversityInput {
  clientMutationId?: string | null;
  university: UniversityInput;
}

/**
 * All input for the `deleteCity` mutation.
 */
export interface DeleteCityInput {
  clientMutationId?: string | null;
  id: any;
}

/**
 * All input for the `deleteCountry` mutation.
 */
export interface DeleteCountryInput {
  clientMutationId?: string | null;
  id: any;
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
 * All input for the `deleteUniversity` mutation.
 */
export interface DeleteUniversityInput {
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
 * A condition to be used against `Profile` object types. All fields are tested for equality and combined with a logical ‘and.’
 */
export interface ProfileCondition {
  id?: any | null;
  userId?: any | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  groupNumber?: string | null;
  course?: number | null;
  cityId?: any | null;
  universityId?: any | null;
  isTeacher?: boolean | null;
  createdAt?: any | null;
  updatedAt?: any | null;
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
 * A condition to be used against `ProgrammingLanguage` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export interface ProgrammingLanguageCondition {
  id?: any | null;
  name?: string | null;
  alias?: string | null;
  version?: string | null;
  createdAt?: any | null;
  updatedAt?: any | null;
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
 * A condition to be used against `Team` object types. All fields are tested for equality and combined with a logical ‘and.’
 */
export interface TeamCondition {
  id?: any | null;
  name?: string | null;
  createdAt?: any | null;
  updatedAt?: any | null;
}

/**
 * A condition to be used against `Test` object types. All fields are tested for equality and combined with a logical ‘and.’
 */
export interface TestCondition {
  id?: any | null;
  index?: number | null;
  input?: string | null;
  output?: string | null;
  isPublic?: boolean | null;
  problemId?: any | null;
  createdAt?: any | null;
  updatedAt?: any | null;
}

/**
 * An input for mutations affecting `Test`
 */
export interface TestInput {
  index: number;
  input: string;
  output: string;
  isPublic?: boolean | null;
  problemId: any;
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
 * A condition to be used against `University` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export interface UniversityCondition {
  id?: any | null;
  cityId?: any | null;
  shortName?: string | null;
  longName?: string | null;
  createdAt?: any | null;
  updatedAt?: any | null;
}

/**
 * An input for mutations affecting `University`
 */
export interface UniversityInput {
  cityId: any;
  shortName: string;
  longName?: string | null;
}

/**
 * Represents an update to a `University`. Fields that are set will be updated.
 */
export interface UniversityPatch {
  cityId?: any | null;
  shortName?: string | null;
  longName?: string | null;
}

/**
 * All input for the `updateCity` mutation.
 */
export interface UpdateCityInput {
  clientMutationId?: string | null;
  patch: CityPatch;
  id: any;
}

/**
 * All input for the `updateCountry` mutation.
 */
export interface UpdateCountryInput {
  clientMutationId?: string | null;
  patch: CountryPatch;
  id: any;
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

/**
 * All input for the `updateUniversity` mutation.
 */
export interface UpdateUniversityInput {
  clientMutationId?: string | null;
  patch: UniversityPatch;
  id: any;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
