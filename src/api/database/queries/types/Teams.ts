/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TeamsOrderBy, TeamCondition } from "./../../global-types";

// ====================================================
// GraphQL query operation: Teams
// ====================================================

export interface Teams_teams_nodes_teamsProfiles {
  __typename: "TeamsProfilesConnection";
  /**
   * The count of *all* `TeamsProfile` you could get from the connection.
   */
  totalCount: number;
}

export interface Teams_teams_nodes {
  __typename: "Team";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  createdAt: any;
  updatedAt: any;
  /**
   * Reads and enables pagination through a set of `TeamsProfile`.
   */
  teamsProfiles: Teams_teams_nodes_teamsProfiles;
}

export interface Teams_teams {
  __typename: "TeamsConnection";
  /**
   * The count of *all* `Team` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `Team` objects.
   */
  nodes: (Teams_teams_nodes | null)[];
}

export interface Teams {
  /**
   * Reads and enables pagination through a set of `Team`.
   */
  teams: Teams_teams | null;
}

export interface TeamsVariables {
  first?: number | null;
  last?: number | null;
  offset?: number | null;
  before?: any | null;
  after?: any | null;
  orderBy?: TeamsOrderBy[] | null;
  condition?: TeamCondition | null;
}
