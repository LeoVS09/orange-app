/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProblemsOrderBy, ProblemCondition } from "./../../global-types";

// ====================================================
// GraphQL query operation: Problems
// ====================================================

export interface Problems_problems_nodes_author_user {
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

export interface Problems_problems_nodes_author {
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
  user: Problems_problems_nodes_author_user | null;
}

export interface Problems_problems_nodes_tester_user {
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

export interface Problems_problems_nodes_tester {
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
  user: Problems_problems_nodes_tester_user | null;
}

export interface Problems_problems_nodes_problemsTags_nodes_tag {
  __typename: "Tag";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
}

export interface Problems_problems_nodes_problemsTags_nodes {
  __typename: "ProblemsTag";
  /**
   * Reads a single `Tag` that is related to this `ProblemsTag`.
   */
  tag: Problems_problems_nodes_problemsTags_nodes_tag | null;
}

export interface Problems_problems_nodes_problemsTags {
  __typename: "ProblemsTagsConnection";
  /**
   * A list of `ProblemsTag` objects.
   */
  nodes: (Problems_problems_nodes_problemsTags_nodes | null)[];
}

export interface Problems_problems_nodes_inputType {
  __typename: "ProgramInputType";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
}

export interface Problems_problems_nodes_outputType {
  __typename: "ProgramOutputType";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
}

export interface Problems_problems_nodes_tests_nodes {
  __typename: "Test";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  index: number;
  input: string;
  output: string;
  isPublic: boolean | null;
  createdAt: any;
  updatedAt: any;
}

export interface Problems_problems_nodes_tests {
  __typename: "TestsConnection";
  /**
   * A list of `Test` objects.
   */
  nodes: (Problems_problems_nodes_tests_nodes | null)[];
}

export interface Problems_problems_nodes {
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
  author: Problems_problems_nodes_author | null;
  /**
   * Reads a single `Profile` that is related to this `Problem`.
   */
  tester: Problems_problems_nodes_tester | null;
  /**
   * Reads and enables pagination through a set of `ProblemsTag`.
   */
  problemsTags: Problems_problems_nodes_problemsTags;
  /**
   * Problem description
   */
  description: string;
  /**
   * Description for input data
   */
  inputDescription: string;
  /**
   * Description for output data
   */
  outputDescription: string;
  /**
   * Addition note, mostly used be author and tester
   */
  note: string | null;
  /**
   * Reads a single `ProgramInputType` that is related to this `Problem`.
   */
  inputType: Problems_problems_nodes_inputType | null;
  /**
   * Reads a single `ProgramOutputType` that is related to this `Problem`.
   */
  outputType: Problems_problems_nodes_outputType | null;
  /**
   * Time limit for problem. Units is milliseconds
   */
  limitTime: number;
  /**
   * Memory limit for problem. Units is bytes
   */
  limitMemory: number;
  /**
   * Reads and enables pagination through a set of `Test`.
   */
  tests: Problems_problems_nodes_tests;
}

export interface Problems_problems {
  __typename: "ProblemsConnection";
  /**
   * The count of *all* `Problem` you could get from the connection.
   */
  totalCount: number | null;
  /**
   * A list of `Problem` objects.
   */
  nodes: (Problems_problems_nodes | null)[];
}

export interface Problems {
  /**
   * Reads and enables pagination through a set of `Problem`.
   */
  problems: Problems_problems | null;
}

export interface ProblemsVariables {
  first?: number | null;
  last?: number | null;
  offset?: number | null;
  before?: any | null;
  after?: any | null;
  orderBy?: ProblemsOrderBy[] | null;
  condition?: ProblemCondition | null;
}
