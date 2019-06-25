/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateCountryInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: updateCountry
// ====================================================

export interface updateCountry_updateCountry_country {
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

export interface updateCountry_updateCountry {
  __typename: "UpdateCountryPayload";
  /**
   * The `Country` that was updated by this mutation.
   */
  country: updateCountry_updateCountry_country | null;
}

export interface updateCountry {
  /**
   * Updates a single `Country` using a unique key and a patch.
   */
  updateCountry: updateCountry_updateCountry | null;
}

export interface updateCountryVariables {
  input: UpdateCountryInput;
}
