/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CreateProgramInputTypeInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: createInputType
// ====================================================

export interface createInputType_createProgramInputType_programInputType {
  __typename: "ProgramInputType";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
}

export interface createInputType_createProgramInputType {
  __typename: "CreateProgramInputTypePayload";
  /**
   * The `ProgramInputType` that was created by this mutation.
   */
  programInputType: createInputType_createProgramInputType_programInputType | null;
}

export interface createInputType {
  /**
   * Creates a single `ProgramInputType`.
   */
  createProgramInputType: createInputType_createProgramInputType | null;
}

export interface createInputTypeVariables {
  input: CreateProgramInputTypeInput;
}
