/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeleteCountryInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: deleteCountry
// ====================================================

export interface deleteCountry_deleteCountry_country {
  __typename: "Country";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
  createdAt: any;
  updatedAt: any;
}

export interface deleteCountry_deleteCountry {
  __typename: "DeleteCountryPayload";
  /**
   * The `Country` that was deleted by this mutation.
   */
  country: deleteCountry_deleteCountry_country | null;
}

export interface deleteCountry {
  /**
   * Deletes a single `Country` using a unique key.
   */
  deleteCountry: deleteCountry_deleteCountry | null;
}

export interface deleteCountryVariables {
  input: DeleteCountryInput;
}
