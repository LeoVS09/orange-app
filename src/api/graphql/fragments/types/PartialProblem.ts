/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PartialProblem
// ====================================================

export interface PartialProblem_author_user {
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

export interface PartialProblem_author {
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
  user: PartialProblem_author_user | null;
}

export interface PartialProblem_tester_user {
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

export interface PartialProblem_tester {
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
  user: PartialProblem_tester_user | null;
}

export interface PartialProblem_problemsTags_nodes_tag {
  __typename: "Tag";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
}

export interface PartialProblem_problemsTags_nodes {
  __typename: "ProblemsTag";
  /**
   * Reads a single `Tag` that is related to this `ProblemsTag`.
   */
  tag: PartialProblem_problemsTags_nodes_tag | null;
}

export interface PartialProblem_problemsTags {
  __typename: "ProblemsTagsConnection";
  /**
   * A list of `ProblemsTag` objects.
   */
  nodes: (PartialProblem_problemsTags_nodes | null)[];
}

export interface PartialProblem {
  __typename: "Problem";
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
  author: PartialProblem_author | null;
  /**
   * Reads a single `Profile` that is related to this `Problem`.
   */
  tester: PartialProblem_tester | null;
  /**
   * Reads and enables pagination through a set of `ProblemsTag`.
   */
  problemsTags: PartialProblem_problemsTags;
}
