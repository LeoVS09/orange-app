/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchCountries
// ====================================================

export interface SearchCountries_searchCountries_nodes {
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

export interface SearchCountries_searchCountries {
  __typename: "CountriesConnection";
  /**
   * The count of *all* `Country` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `Country` objects.
   */
  nodes: (SearchCountries_searchCountries_nodes | null)[];
}

export interface SearchCountries {
  /**
   * Reads and enables pagination through a set of `Country`.
   */
  searchCountries: SearchCountries_searchCountries;
}

export interface SearchCountriesVariables {
  search?: string | null;
  first?: number | null;
  last?: number | null;
  offset?: number | null;
  before?: any | null;
  after?: any | null;
}
