/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProgrammingLanguage
// ====================================================

export interface ProgrammingLanguage {
  __typename: "ProgrammingLanguage";
  id: any;
  /**
   * Name of language. Use official name, like C++, Go, JavaScript, but not cpp, Golang, ES
   */
  name: string;
  /**
   * Alias for language. Mostly used as search keyword, like Golang, or define explicitly version of language, like ECMAScript
   */
  alias: string | null;
  /**
   * Version of language. Version is used for compiler or interpreter. Also can have definition of used extensions and presets
   */
  version: string;
  createdAt: any;
  updatedAt: any;
}
