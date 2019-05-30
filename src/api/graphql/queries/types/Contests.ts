/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ContestsOrderBy, ContestCondition } from "./../../global-types";

// ====================================================
// GraphQL query operation: Contests
// ====================================================

export interface Contests_contests_nodes_creator_user {
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

export interface Contests_contests_nodes_creator {
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
  user: Contests_contests_nodes_creator_user | null;
}

export interface Contests_contests_nodes {
  __typename: "Contest";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  text: string | null;
  creatorId: any;
  startDate: any | null;
  endDate: any | null;
  startPublicationDate: any | null;
  endPublicationDate: any | null;
  createdAt: any;
  updatedAt: any;
  /**
   * Reads a single `Profile` that is related to this `Contest`.
   */
  creator: Contests_contests_nodes_creator | null;
}

export interface Contests_contests {
  __typename: "ContestsConnection";
  /**
   * The count of *all* `Contest` you could get from the connection.
   */
  totalCount: number | null;
  /**
   * A list of `Contest` objects.
   */
  nodes: (Contests_contests_nodes | null)[];
}

export interface Contests {
  /**
   * Reads and enables pagination through a set of `Contest`.
   */
  contests: Contests_contests | null;
}

export interface ContestsVariables {
  first?: number | null;
  last?: number | null;
  offset?: number | null;
  before?: any | null;
  after?: any | null;
  orderBy?: ContestsOrderBy[] | null;
  condition?: ContestCondition | null;
}
