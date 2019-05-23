/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProgramInputTypesOrderBy, ProgramInputTypeCondition, ProgramOutputTypesOrderBy, ProgramOutputTypeCondition } from "./../../global-types";

// ====================================================
// GraphQL query operation: InputOutputTypes
// ====================================================

export interface InputOutputTypes_programInputTypes_nodes {
  __typename: "ProgramInputType";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
}

export interface InputOutputTypes_programInputTypes {
  __typename: "ProgramInputTypesConnection";
  /**
   * The count of *all* `ProgramInputType` you could get from the connection.
   */
  totalCount: number | null;
  /**
   * A list of `ProgramInputType` objects.
   */
  nodes: (InputOutputTypes_programInputTypes_nodes | null)[];
}

export interface InputOutputTypes_programOutputTypes_nodes {
  __typename: "ProgramOutputType";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
}

export interface InputOutputTypes_programOutputTypes {
  __typename: "ProgramOutputTypesConnection";
  /**
   * The count of *all* `ProgramOutputType` you could get from the connection.
   */
  totalCount: number | null;
  /**
   * A list of `ProgramOutputType` objects.
   */
  nodes: (InputOutputTypes_programOutputTypes_nodes | null)[];
}

export interface InputOutputTypes {
  /**
   * Reads and enables pagination through a set of `ProgramInputType`.
   */
  programInputTypes: InputOutputTypes_programInputTypes | null;
  /**
   * Reads and enables pagination through a set of `ProgramOutputType`.
   */
  programOutputTypes: InputOutputTypes_programOutputTypes | null;
}

export interface InputOutputTypesVariables {
  inputFirst?: number | null;
  inputLast?: number | null;
  inputOffset?: number | null;
  inputBefore?: any | null;
  inputAfter?: any | null;
  inputOrderBy?: ProgramInputTypesOrderBy[] | null;
  inputCondition?: ProgramInputTypeCondition | null;
  outputFirst?: number | null;
  outputLast?: number | null;
  outputOffset?: number | null;
  outputBefore?: any | null;
  outputAfter?: any | null;
  outputOrderBy?: ProgramOutputTypesOrderBy[] | null;
  outputCondition?: ProgramOutputTypeCondition | null;
}
