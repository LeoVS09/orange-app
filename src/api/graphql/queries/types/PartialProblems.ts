/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProblemsOrderBy, ProblemCondition } from "./../../global-types";

// ====================================================
// GraphQL query operation: PartialProblems
// ====================================================

export interface PartialProblems_problems_nodes_author_user {
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

export interface PartialProblems_problems_nodes_author {
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
  user: PartialProblems_problems_nodes_author_user | null;
}

export interface PartialProblems_problems_nodes_tester_user {
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

export interface PartialProblems_problems_nodes_tester {
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
  user: PartialProblems_problems_nodes_tester_user | null;
}

export interface PartialProblems_problems_nodes_problemsTags_nodes_tag {
  __typename: "Tag";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
}

export interface PartialProblems_problems_nodes_problemsTags_nodes {
  __typename: "ProblemsTag";
  /**
   * Reads a single `Tag` that is related to this `ProblemsTag`.
   */
  tag: PartialProblems_problems_nodes_problemsTags_nodes_tag | null;
}

export interface PartialProblems_problems_nodes_problemsTags {
  __typename: "ProblemsTagsConnection";
  /**
   * A list of `ProblemsTag` objects.
   */
  nodes: (PartialProblems_problems_nodes_problemsTags_nodes | null)[];
}

export interface PartialProblems_problems_nodes {
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
  author: PartialProblems_problems_nodes_author | null;
  /**
   * Reads a single `Profile` that is related to this `Problem`.
   */
  tester: PartialProblems_problems_nodes_tester | null;
  /**
   * Reads and enables pagination through a set of `ProblemsTag`.
   */
  problemsTags: PartialProblems_problems_nodes_problemsTags;
}

export interface PartialProblems_problems {
  __typename: "ProblemsConnection";
  /**
   * The count of *all* `Problem` you could get from the connection.
   */
  totalCount: number | null;
  /**
   * A list of `Problem` objects.
   */
  nodes: (PartialProblems_problems_nodes | null)[];
}

export interface PartialProblems {
  /**
   * Reads and enables pagination through a set of `Problem`.
   */
  problems: PartialProblems_problems | null;
}

export interface PartialProblemsVariables {
  first?: number | null;
  last?: number | null;
  offset?: number | null;
  before?: any | null;
  after?: any | null;
  orderBy?: ProblemsOrderBy[] | null;
  condition?: ProblemCondition | null;
}
