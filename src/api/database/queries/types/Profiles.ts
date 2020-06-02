/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProfilesOrderBy, ProfileCondition } from "./../../global-types";

// ====================================================
// GraphQL query operation: Profiles
// ====================================================

export interface Profiles_profiles_nodes_user {
  __typename: "User";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  /**
   * Unique identifier for the user.
   */
  id: any;
  /**
   * Public-facing name (or pseudonym) of the user.
   */
  name: string | null;
}

export interface Profiles_profiles_nodes {
  __typename: "Profile";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  isTeacher: boolean | null;
  firstName: string | null;
  lastName: string | null;
  /**
   * Reads a single `User` that is related to this `Profile`.
   */
  user: Profiles_profiles_nodes_user | null;
}

export interface Profiles_profiles {
  __typename: "ProfilesConnection";
  /**
   * The count of *all* `Profile` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `Profile` objects.
   */
  nodes: (Profiles_profiles_nodes | null)[];
}

export interface Profiles {
  /**
   * Reads and enables pagination through a set of `Profile`.
   */
  profiles: Profiles_profiles | null;
}

export interface ProfilesVariables {
  first?: number | null;
  last?: number | null;
  offset?: number | null;
  before?: any | null;
  after?: any | null;
  orderBy?: ProfilesOrderBy[] | null;
  condition?: ProfileCondition | null;
}
