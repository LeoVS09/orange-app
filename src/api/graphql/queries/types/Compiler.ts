/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Compiler
// ====================================================

export interface Compiler_compiler_language {
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

export interface Compiler_compiler {
  __typename: "Compiler";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  /**
   * Compiler name
   */
  name: string;
  /**
   * Alias of compiler. Mostly used as search word, like gcc
   */
  alias: string | null;
  /**
   * Compiler full code name aka "g++.exe (i686-posix-dwarf-rev0, Built by MinGW-W64 project) 8.1.0"
   */
  code: string | null;
  /**
   * Compiler version
   */
  version: string;
  comment: string;
  /**
   * Is this interpreter
   */
  isInterpreter: boolean | null;
  createdAt: any;
  updatedAt: any;
  /**
   * Reads a single `ProgrammingLanguage` that is related to this `Compiler`.
   */
  language: Compiler_compiler_language | null;
}

export interface Compiler {
  compiler: Compiler_compiler | null;
}

export interface CompilerVariables {
  id: any;
}
