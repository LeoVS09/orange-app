/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CodeEditorsOrderBy, CodeEditorCondition } from "./../../global-types";

// ====================================================
// GraphQL query operation: CodeEditors
// ====================================================

export interface CodeEditors_codeEditors_nodes {
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

export interface CodeEditors_codeEditors {
  __typename: "CodeEditorsConnection";
  /**
   * The count of *all* `CodeEditor` you could get from the connection.
   */
  totalCount: number | null;
  /**
   * A list of `CodeEditor` objects.
   */
  nodes: (CodeEditors_codeEditors_nodes | null)[];
}

export interface CodeEditors {
  /**
   * Reads and enables pagination through a set of `CodeEditor`.
   */
  codeEditors: CodeEditors_codeEditors | null;
}

export interface CodeEditorsVariables {
  first?: number | null;
  last?: number | null;
  offset?: number | null;
  before?: any | null;
  after?: any | null;
  orderBy?: CodeEditorsOrderBy[] | null;
  condition?: CodeEditorCondition | null;
}
