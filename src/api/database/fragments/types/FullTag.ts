/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullTag
// ====================================================

export interface FullTag_problemsTags_nodes_problem_author_user {
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

export interface FullTag_problemsTags_nodes_problem_author {
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
  user: FullTag_problemsTags_nodes_problem_author_user | null;
}

export interface FullTag_problemsTags_nodes_problem_tester_user {
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

export interface FullTag_problemsTags_nodes_problem_tester {
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
  user: FullTag_problemsTags_nodes_problem_tester_user | null;
}

export interface FullTag_problemsTags_nodes_problem_problemsTags_nodes_tag {
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

export interface FullTag_problemsTags_nodes_problem_problemsTags_nodes {
  __typename: "ProblemsTag";
  /**
   * Reads a single `Tag` that is related to this `ProblemsTag`.
   */
  tag: FullTag_problemsTags_nodes_problem_problemsTags_nodes_tag | null;
}

export interface FullTag_problemsTags_nodes_problem_problemsTags {
  __typename: "ProblemsTagsConnection";
  /**
   * A list of `ProblemsTag` objects.
   */
  nodes: (FullTag_problemsTags_nodes_problem_problemsTags_nodes | null)[];
}

export interface FullTag_problemsTags_nodes_problem {
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
  author: FullTag_problemsTags_nodes_problem_author | null;
  /**
   * Reads a single `Profile` that is related to this `Problem`.
   */
  tester: FullTag_problemsTags_nodes_problem_tester | null;
  /**
   * Reads and enables pagination through a set of `ProblemsTag`.
   */
  problemsTags: FullTag_problemsTags_nodes_problem_problemsTags;
}

export interface FullTag_problemsTags_nodes {
  __typename: "ProblemsTag";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  createdAt: any;
  updatedAt: any;
  /**
   * Reads a single `Problem` that is related to this `ProblemsTag`.
   */
  problem: FullTag_problemsTags_nodes_problem | null;
}

export interface FullTag_problemsTags {
  __typename: "ProblemsTagsConnection";
  /**
   * The count of *all* `ProblemsTag` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `ProblemsTag` objects.
   */
  nodes: (FullTag_problemsTags_nodes | null)[];
}

export interface FullTag {
  __typename: "Tag";
  id: any;
  name: string;
  createdAt: any;
  updatedAt: any;
  /**
   * Reads and enables pagination through a set of `ProblemsTag`.
   */
  problemsTags: FullTag_problemsTags;
}
