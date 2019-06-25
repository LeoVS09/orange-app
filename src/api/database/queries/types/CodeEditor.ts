/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CodeEditor
// ====================================================

export interface CodeEditor_codeEditor {
  __typename: "CodeEditor";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  /**
   * Name of code editor. Use official name, like Visual Studio
   */
  name: string;
  /**
   * Alias for code editor. Mostly used as search keyword, like VSC
   */
  alias: string | null;
  /**
   * Version of code editor. Version is used for define which margin version is will be used, like Visual Studio 2017
   */
  version: string;
  createdAt: any;
  updatedAt: any;
}

export interface CodeEditor {
  codeEditor: CodeEditor_codeEditor | null;
}

export interface CodeEditorVariables {
  id: any;
}
