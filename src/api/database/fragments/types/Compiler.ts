/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Compiler
// ====================================================

export interface Compiler_language {
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

export interface Compiler {
  __typename: "Translator";
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
  language: Compiler_language | null;
}
