/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullProfile
// ====================================================

export interface FullProfile_city {
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

export interface FullProfile_university {
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

export interface FullProfile {
  __typename: "Profile";
  id: any;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  phone: string | null;
  groupNumber: string | null;
  course: number | null;
  isTeacher: boolean | null;
  createdAt: any;
  updatedAt: any;
  /**
   * Reads a single `City` that is related to this `Profile`.
   */
  city: FullProfile_city | null;
  /**
   * Reads a single `University` that is related to this `Profile`.
   */
  university: FullProfile_university | null;
}
