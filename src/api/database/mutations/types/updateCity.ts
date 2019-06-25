/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateCityInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: updateCity
// ====================================================

export interface updateCity_updateCity_city {
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

export interface updateCity_updateCity {
  __typename: "UpdateCityPayload";
  /**
   * The `City` that was updated by this mutation.
   */
  city: updateCity_updateCity_city | null;
}

export interface updateCity {
  /**
   * Updates a single `City` using a unique key and a patch.
   */
  updateCity: updateCity_updateCity | null;
}

export interface updateCityVariables {
  input: UpdateCityInput;
}
