/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CountriesOrderBy, CountryCondition } from "./../../global-types";

// ====================================================
// GraphQL query operation: Countries
// ====================================================

export interface Countries_countries_pageInfo {
  __typename: "PageInfo";
  /**
   * When paginating forwards, are there more items?
   */
  hasNextPage: boolean;
  /**
   * When paginating backwards, are there more items?
   */
  hasPreviousPage: boolean;
  /**
   * When paginating backwards, the cursor to continue.
   */
  startCursor: any | null;
  /**
   * When paginating forwards, the cursor to continue.
   */
  endCursor: any | null;
}

export interface Countries_countries_nodes {
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

export interface Countries_countries {
  __typename: "CountriesConnection";
  /**
   * The count of *all* `Country` you could get from the connection.
   */
  totalCount: number;
  /**
   * Information to aid in pagination.
   */
  pageInfo: Countries_countries_pageInfo;
  /**
   * A list of `Country` objects.
   */
  nodes: (Countries_countries_nodes | null)[];
}

export interface Countries {
  /**
   * Reads and enables pagination through a set of `Country`.
   */
  countries: Countries_countries | null;
}

export interface CountriesVariables {
  first?: number | null;
  last?: number | null;
  offset?: number | null;
  before?: any | null;
  after?: any | null;
  orderBy?: CountriesOrderBy[] | null;
  condition?: CountryCondition | null;
}
