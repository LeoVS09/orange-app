/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: University
// ====================================================

export interface University_university_city_country {
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

export interface University_university_city {
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
   * Reads a single `Country` that is related to this `City`.
   */
  country: University_university_city_country | null;
}

export interface University_university {
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
  /**
   * Reads a single `City` that is related to this `University`.
   */
  city: University_university_city | null;
}

export interface University {
  university: University_university | null;
}

export interface UniversityVariables {
  id: any;
}
