/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeleteProgramOutputTypeInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: deleteOutputType
// ====================================================

export interface deleteOutputType_deleteProgramOutputType_programOutputType {
  __typename: "ProgramOutputType";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
}

export interface deleteOutputType_deleteProgramOutputType {
  __typename: "DeleteProgramOutputTypePayload";
  /**
   * The `ProgramOutputType` that was deleted by this mutation.
   */
  programOutputType: deleteOutputType_deleteProgramOutputType_programOutputType | null;
}

export interface deleteOutputType {
  /**
   * Deletes a single `ProgramOutputType` using a unique key.
   */
  deleteProgramOutputType: deleteOutputType_deleteProgramOutputType | null;
}

export interface deleteOutputTypeVariables {
  input: DeleteProgramOutputTypeInput;
}
