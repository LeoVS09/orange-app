/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateProgramInputTypeInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: updateInputType
// ====================================================

export interface updateInputType_updateProgramInputType_programInputType {
  __typename: "ProgramInputType";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
}

export interface updateInputType_updateProgramInputType {
  __typename: "UpdateProgramInputTypePayload";
  /**
   * The `ProgramInputType` that was updated by this mutation.
   */
  programInputType: updateInputType_updateProgramInputType_programInputType | null;
}

export interface updateInputType {
  /**
   * Updates a single `ProgramInputType` using a unique key and a patch.
   */
  updateProgramInputType: updateInputType_updateProgramInputType | null;
}

export interface updateInputTypeVariables {
  input: UpdateProgramInputTypeInput;
}
