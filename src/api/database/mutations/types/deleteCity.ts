/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeleteCityInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: deleteCity
// ====================================================

export interface deleteCity_deleteCity_city {
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

export interface deleteCity_deleteCity {
  __typename: "DeleteCityPayload";
  /**
   * The `City` that was deleted by this mutation.
   */
  city: deleteCity_deleteCity_city | null;
}

export interface deleteCity {
  /**
   * Deletes a single `City` using a unique key.
   */
  deleteCity: deleteCity_deleteCity | null;
}

export interface deleteCityVariables {
  input: DeleteCityInput;
}
