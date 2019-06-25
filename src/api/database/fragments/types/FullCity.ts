/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullCity
// ====================================================

export interface FullCity_universities_nodes {
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

export interface FullCity_universities {
  __typename: "UniversitiesConnection";
  /**
   * A list of `University` objects.
   */
  nodes: (FullCity_universities_nodes | null)[];
}

export interface FullCity {
  __typename: "City";
  id: any;
  name: string;
  countryId: any;
  createdAt: any;
  updatedAt: any;
  /**
   * Reads and enables pagination through a set of `University`.
   */
  universities: FullCity_universities;
}
