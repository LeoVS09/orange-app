/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CreateCityInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: createCity
// ====================================================

export interface createCity_createCity_city {
  __typename: "City";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  countryId: any;
  createdAt: any;
  updatedAt: any;
}

export interface createCity_createCity {
  __typename: "CreateCityPayload";
  /**
   * The `City` that was created by this mutation.
   */
  city: createCity_createCity_city | null;
}

export interface createCity {
  /**
   * Creates a single `City`.
   */
  createCity: createCity_createCity | null;
}

export interface createCityVariables {
  input: CreateCityInput;
}
