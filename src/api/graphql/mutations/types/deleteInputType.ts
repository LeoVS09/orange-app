/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeleteProgramInputTypeInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: deleteInputType
// ====================================================

export interface deleteInputType_deleteProgramInputType_programInputType {
  __typename: "ProgramInputType";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
}

export interface deleteInputType_deleteProgramInputType {
  __typename: "DeleteProgramInputTypePayload";
  /**
   * The `ProgramInputType` that was deleted by this mutation.
   */
  programInputType: deleteInputType_deleteProgramInputType_programInputType | null;
}

export interface deleteInputType {
  /**
   * Deletes a single `ProgramInputType` using a unique key.
   */
  deleteProgramInputType: deleteInputType_deleteProgramInputType | null;
}

export interface deleteInputTypeVariables {
  input: DeleteProgramInputTypeInput;
}
