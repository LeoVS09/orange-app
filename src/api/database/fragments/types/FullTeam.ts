/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullTeam
// ====================================================

export interface FullTeam_teamsProfiles_nodes_profile_user {
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

export interface FullTeam_teamsProfiles_nodes_profile {
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
  user: FullTeam_teamsProfiles_nodes_profile_user | null;
}

export interface FullTeam_teamsProfiles_nodes {
  __typename: "TeamsProfile";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  /**
   * Reads a single `Profile` that is related to this `TeamsProfile`.
   */
  profile: FullTeam_teamsProfiles_nodes_profile | null;
}

export interface FullTeam_teamsProfiles {
  __typename: "TeamsProfilesConnection";
  /**
   * The count of *all* `TeamsProfile` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `TeamsProfile` objects.
   */
  nodes: (FullTeam_teamsProfiles_nodes | null)[];
}

export interface FullTeam {
  __typename: "Team";
  id: any;
  name: string;
  createdAt: any;
  updatedAt: any;
  /**
   * Reads and enables pagination through a set of `TeamsProfile`.
   */
  teamsProfiles: FullTeam_teamsProfiles;
}
