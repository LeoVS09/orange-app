/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProgrammingLanguage
// ====================================================

export interface ProgrammingLanguage_programmingLanguage_translatorsByLanguageId_nodes_language {
  __typename: "ProgrammingLanguage";
  id: any;
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
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

export interface ProgrammingLanguage_programmingLanguage_translatorsByLanguageId_nodes {
  __typename: "Translator";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  /**
   * Translators name
   */
  name: string;
  /**
   * Alias of translator. Mostly used as search word, like gcc
   */
  alias: string | null;
  /**
   * Translators full code name aka "g++.exe (i686-posix-dwarf-rev0, Built by MinGW-W64 project) 8.1.0"
   */
  code: string | null;
  /**
   * Translators version
   */
  version: string;
  comment: string;
  /**
   * Is this interpreter ot compiler
   */
  isInterpreter: boolean | null;
  createdAt: any;
  updatedAt: any;
  /**
   * Reads a single `ProgrammingLanguage` that is related to this `Translator`.
   */
  language: ProgrammingLanguage_programmingLanguage_translatorsByLanguageId_nodes_language | null;
}

export interface ProgrammingLanguage_programmingLanguage_translatorsByLanguageId {
  __typename: "TranslatorsConnection";
  /**
   * The count of *all* `Translator` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `Translator` objects.
   */
  nodes: (ProgrammingLanguage_programmingLanguage_translatorsByLanguageId_nodes | null)[];
}

export interface ProgrammingLanguage_programmingLanguage {
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
  /**
   * Reads and enables pagination through a set of `Translator`.
   */
  translatorsByLanguageId: ProgrammingLanguage_programmingLanguage_translatorsByLanguageId;
}

export interface ProgrammingLanguage {
  programmingLanguage: ProgrammingLanguage_programmingLanguage | null;
}

export interface ProgrammingLanguageVariables {
  id: any;
}
