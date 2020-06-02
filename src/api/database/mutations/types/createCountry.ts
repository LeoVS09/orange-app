/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CreateCountryInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: createCountry
// ====================================================

export interface createCountry_createCountry_country {
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

export interface createCountry_createCountry {
  __typename: "CreateCountryPayload";
  /**
   * The `Country` that was created by this mutation.
   */
  country: createCountry_createCountry_country | null;
}

export interface createCountry {
  /**
   * Creates a single `Country`.
   */
  createCountry: createCountry_createCountry | null;
}

export interface createCountryVariables {
  input: CreateCountryInput;
}
