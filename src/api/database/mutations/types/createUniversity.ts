/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CreateUniversityInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: createUniversity
// ====================================================

export interface createUniversity_createUniversity_university {
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

export interface createUniversity_createUniversity {
  __typename: "CreateUniversityPayload";
  /**
   * The `University` that was created by this mutation.
   */
  university: createUniversity_createUniversity_university | null;
}

export interface createUniversity {
  /**
   * Creates a single `University`.
   */
  createUniversity: createUniversity_createUniversity | null;
}

export interface createUniversityVariables {
  input: CreateUniversityInput;
}
