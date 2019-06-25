/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullContest
// ====================================================

export interface FullContest_creator_user {
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

export interface FullContest_creator {
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
  user: FullContest_creator_user | null;
}

export interface FullContest_contestsProblems_nodes_problem_author_user {
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

export interface FullContest_contestsProblems_nodes_problem_author {
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
  user: FullContest_contestsProblems_nodes_problem_author_user | null;
}

export interface FullContest_contestsProblems_nodes_problem_tester_user {
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

export interface FullContest_contestsProblems_nodes_problem_tester {
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
  user: FullContest_contestsProblems_nodes_problem_tester_user | null;
}

export interface FullContest_contestsProblems_nodes_problem_problemsTags_nodes_tag {
  __typename: "Tag";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  createdAt: any;
  updatedAt: any;
}

export interface FullContest_contestsProblems_nodes_problem_problemsTags_nodes {
  __typename: "ProblemsTag";
  /**
   * Reads a single `Tag` that is related to this `ProblemsTag`.
   */
  tag: FullContest_contestsProblems_nodes_problem_problemsTags_nodes_tag | null;
}

export interface FullContest_contestsProblems_nodes_problem_problemsTags {
  __typename: "ProblemsTagsConnection";
  /**
   * A list of `ProblemsTag` objects.
   */
  nodes: (FullContest_contestsProblems_nodes_problem_problemsTags_nodes | null)[];
}

export interface FullContest_contestsProblems_nodes_problem {
  __typename: "Problem";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  /**
   * Name of problem
   */
  name: string;
  /**
   * Level of difficulty. Where 0 is very easy and 100 is very hard
   */
  difficulty: number | null;
  /**
   * Date of problem creation
   */
  createdAt: any;
  /**
   * Date of last problem modification
   */
  updatedAt: any;
  /**
   * Define when this problem can be visible
   */
  publicationDate: any | null;
  /**
   * Reads a single `Profile` that is related to this `Problem`.
   */
  author: FullContest_contestsProblems_nodes_problem_author | null;
  /**
   * Reads a single `Profile` that is related to this `Problem`.
   */
  tester: FullContest_contestsProblems_nodes_problem_tester | null;
  /**
   * Reads and enables pagination through a set of `ProblemsTag`.
   */
  problemsTags: FullContest_contestsProblems_nodes_problem_problemsTags;
}

export interface FullContest_contestsProblems_nodes {
  __typename: "ContestsProblem";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  /**
   * Reads a single `Problem` that is related to this `ContestsProblem`.
   */
  problem: FullContest_contestsProblems_nodes_problem | null;
}

export interface FullContest_contestsProblems {
  __typename: "ContestsProblemsConnection";
  /**
   * The count of *all* `ContestsProblem` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `ContestsProblem` objects.
   */
  nodes: (FullContest_contestsProblems_nodes | null)[];
}

export interface FullContest_contestsProfiles_nodes_profile_user {
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

export interface FullContest_contestsProfiles_nodes_profile {
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
  user: FullContest_contestsProfiles_nodes_profile_user | null;
}

export interface FullContest_contestsProfiles_nodes {
  __typename: "ContestsProfile";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  /**
   * Reads a single `Profile` that is related to this `ContestsProfile`.
   */
  profile: FullContest_contestsProfiles_nodes_profile | null;
}

export interface FullContest_contestsProfiles {
  __typename: "ContestsProfilesConnection";
  /**
   * The count of *all* `ContestsProfile` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `ContestsProfile` objects.
   */
  nodes: (FullContest_contestsProfiles_nodes | null)[];
}

export interface FullContest_contestsTeams_nodes_team_teamsProfiles {
  __typename: "TeamsProfilesConnection";
  /**
   * The count of *all* `TeamsProfile` you could get from the connection.
   */
  totalCount: number;
}

export interface FullContest_contestsTeams_nodes_team {
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
  teamsProfiles: FullContest_contestsTeams_nodes_team_teamsProfiles;
}

export interface FullContest_contestsTeams_nodes {
  __typename: "ContestsTeam";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  /**
   * Reads a single `Team` that is related to this `ContestsTeam`.
   */
  team: FullContest_contestsTeams_nodes_team | null;
}

export interface FullContest_contestsTeams {
  __typename: "ContestsTeamsConnection";
  /**
   * The count of *all* `ContestsTeam` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `ContestsTeam` objects.
   */
  nodes: (FullContest_contestsTeams_nodes | null)[];
}

export interface FullContest {
  __typename: "Contest";
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
  creator: FullContest_creator | null;
  /**
   * Reads and enables pagination through a set of `ContestsProblem`.
   */
  contestsProblems: FullContest_contestsProblems;
  /**
   * Reads and enables pagination through a set of `ContestsProfile`.
   */
  contestsProfiles: FullContest_contestsProfiles;
  /**
   * Reads and enables pagination through a set of `ContestsTeam`.
   */
  contestsTeams: FullContest_contestsTeams;
}
