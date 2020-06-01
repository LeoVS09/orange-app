/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateUniversityInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: updateUniversity
// ====================================================

export interface updateUniversity_updateUniversity_university {
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

export interface updateUniversity_updateUniversity {
  __typename: "UpdateUniversityPayload";
  /**
   * The `University` that was updated by this mutation.
   */
  university: updateUniversity_updateUniversity_university | null;
}

export interface updateUniversity {
  /**
   * Updates a single `University` using a unique key and a patch.
   */
  updateUniversity: updateUniversity_updateUniversity | null;
}

export interface updateUniversityVariables {
  input: UpdateUniversityInput;
}
