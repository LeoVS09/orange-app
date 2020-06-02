/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CreateProgramOutputTypeInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: createOutputType
// ====================================================

export interface createOutputType_createProgramOutputType_programOutputType {
  __typename: "ProgramOutputType";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
}

export interface createOutputType_createProgramOutputType {
  __typename: "CreateProgramOutputTypePayload";
  /**
   * The `ProgramOutputType` that was created by this mutation.
   */
  programOutputType: createOutputType_createProgramOutputType_programOutputType | null;
}

export interface createOutputType {
  /**
   * Creates a single `ProgramOutputType`.
   */
  createProgramOutputType: createOutputType_createProgramOutputType | null;
}

export interface createOutputTypeVariables {
  input: CreateProgramOutputTypeInput;
}
