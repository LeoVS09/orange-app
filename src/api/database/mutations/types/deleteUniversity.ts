/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeleteUniversityInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: deleteUniversity
// ====================================================

export interface deleteUniversity_deleteUniversity_university {
  __typename: "University";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  shortName: string;
  longName: string | null;
  createdAt: any;
  updatedAt: any;
  cityId: any;
}

export interface deleteUniversity_deleteUniversity {
  __typename: "DeleteUniversityPayload";
  /**
   * The `University` that was deleted by this mutation.
   */
  university: deleteUniversity_deleteUniversity_university | null;
}

export interface deleteUniversity {
  /**
   * Deletes a single `University` using a unique key.
   */
  deleteUniversity: deleteUniversity_deleteUniversity | null;
}

export interface deleteUniversityVariables {
  input: DeleteUniversityInput;
}
