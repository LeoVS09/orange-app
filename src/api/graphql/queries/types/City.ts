/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: City
// ====================================================

export interface City_city_universities_nodes {
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

export interface City_city_universities {
  __typename: "UniversitiesConnection";
  /**
   * A list of `University` objects.
   */
  nodes: (City_city_universities_nodes | null)[];
}

export interface City_city {
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
  /**
   * Reads and enables pagination through a set of `University`.
   */
  universities: City_city_universities;
}

export interface City {
  city: City_city | null;
}

export interface CityVariables {
  id: any;
}
