/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CitiesOrderBy, CityCondition } from "./../../global-types";

// ====================================================
// GraphQL query operation: Cities
// ====================================================

export interface Cities_cities_nodes {
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

export interface Cities_cities {
  __typename: "CitiesConnection";
  /**
   * The count of *all* `City` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `City` objects.
   */
  nodes: (Cities_cities_nodes | null)[];
}

export interface Cities {
  /**
   * Reads and enables pagination through a set of `City`.
   */
  cities: Cities_cities | null;
}

export interface CitiesVariables {
  first?: number | null;
  last?: number | null;
  offset?: number | null;
  before?: any | null;
  after?: any | null;
  orderBy?: CitiesOrderBy[] | null;
  condition?: CityCondition | null;
}
