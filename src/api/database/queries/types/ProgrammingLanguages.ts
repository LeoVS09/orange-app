/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProgrammingLanguagesOrderBy, ProgrammingLanguageCondition } from "./../../global-types";

// ====================================================
// GraphQL query operation: ProgrammingLanguages
// ====================================================

export interface ProgrammingLanguages_programmingLanguages_nodes {
  __typename: "ProgrammingLanguage";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
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

export interface ProgrammingLanguages_programmingLanguages {
  __typename: "ProgrammingLanguagesConnection";
  /**
   * The count of *all* `ProgrammingLanguage` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `ProgrammingLanguage` objects.
   */
  nodes: (ProgrammingLanguages_programmingLanguages_nodes | null)[];
}

export interface ProgrammingLanguages {
  /**
   * Reads and enables pagination through a set of `ProgrammingLanguage`.
   */
  programmingLanguages: ProgrammingLanguages_programmingLanguages | null;
}

export interface ProgrammingLanguagesVariables {
  first?: number | null;
  last?: number | null;
  offset?: number | null;
  before?: any | null;
  after?: any | null;
  orderBy?: ProgrammingLanguagesOrderBy[] | null;
  condition?: ProgrammingLanguageCondition | null;
}
