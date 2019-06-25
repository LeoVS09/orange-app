/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Team
// ====================================================

export interface Team_team_teamsProfiles_nodes_profile_user {
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

export interface Team_team_teamsProfiles_nodes_profile {
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
  user: Team_team_teamsProfiles_nodes_profile_user | null;
}

export interface Team_team_teamsProfiles_nodes {
  __typename: "TeamsProfile";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  /**
   * Reads a single `Profile` that is related to this `TeamsProfile`.
   */
  profile: Team_team_teamsProfiles_nodes_profile | null;
}

export interface Team_team_teamsProfiles {
  __typename: "TeamsProfilesConnection";
  /**
   * The count of *all* `TeamsProfile` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `TeamsProfile` objects.
   */
  nodes: (Team_team_teamsProfiles_nodes | null)[];
}

export interface Team_team {
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
  teamsProfiles: Team_team_teamsProfiles;
}

export interface Team {
  team: Team_team | null;
}

export interface TeamVariables {
  id: any;
}
