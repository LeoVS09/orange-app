/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateProgramOutputTypeInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: updateOutputType
// ====================================================

export interface updateOutputType_updateProgramOutputType_programOutputType {
  __typename: "ProgramOutputType";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
}

export interface updateOutputType_updateProgramOutputType {
  __typename: "UpdateProgramOutputTypePayload";
  /**
   * The `ProgramOutputType` that was updated by this mutation.
   */
  programOutputType: updateOutputType_updateProgramOutputType_programOutputType | null;
}

export interface updateOutputType {
  /**
   * Updates a single `ProgramOutputType` using a unique key and a patch.
   */
  updateProgramOutputType: updateOutputType_updateProgramOutputType | null;
}

export interface updateOutputTypeVariables {
  input: UpdateProgramOutputTypeInput;
}
