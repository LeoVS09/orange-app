/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeleteProblemInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: deleteProblem
// ====================================================

export interface deleteProblem_deleteProblem_problem_author_user {
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

export interface deleteProblem_deleteProblem_problem_author {
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
  user: deleteProblem_deleteProblem_problem_author_user | null;
}

export interface deleteProblem_deleteProblem_problem_tester_user {
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

export interface deleteProblem_deleteProblem_problem_tester {
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
  user: deleteProblem_deleteProblem_problem_tester_user | null;
}

export interface deleteProblem_deleteProblem_problem_problemsTags_nodes_tag {
  __typename: "Tag";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
}

export interface deleteProblem_deleteProblem_problem_problemsTags_nodes {
  __typename: "ProblemsTag";
  /**
   * Reads a single `Tag` that is related to this `ProblemsTag`.
   */
  tag: deleteProblem_deleteProblem_problem_problemsTags_nodes_tag | null;
}

export interface deleteProblem_deleteProblem_problem_problemsTags {
  __typename: "ProblemsTagsConnection";
  /**
   * A list of `ProblemsTag` objects.
   */
  nodes: (deleteProblem_deleteProblem_problem_problemsTags_nodes | null)[];
}

export interface deleteProblem_deleteProblem_problem_inputType {
  __typename: "ProgramInputType";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
}

export interface deleteProblem_deleteProblem_problem_outputType {
  __typename: "ProgramOutputType";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
}

export interface deleteProblem_deleteProblem_problem_tests_nodes {
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

export interface deleteProblem_deleteProblem_problem_tests {
  __typename: "TestsConnection";
  /**
   * A list of `Test` objects.
   */
  nodes: (deleteProblem_deleteProblem_problem_tests_nodes | null)[];
}

export interface deleteProblem_deleteProblem_problem {
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
  author: deleteProblem_deleteProblem_problem_author | null;
  /**
   * Reads a single `Profile` that is related to this `Problem`.
   */
  tester: deleteProblem_deleteProblem_problem_tester | null;
  /**
   * Reads and enables pagination through a set of `ProblemsTag`.
   */
  problemsTags: deleteProblem_deleteProblem_problem_problemsTags;
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
  inputType: deleteProblem_deleteProblem_problem_inputType | null;
  /**
   * Reads a single `ProgramOutputType` that is related to this `Problem`.
   */
  outputType: deleteProblem_deleteProblem_problem_outputType | null;
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
  tests: deleteProblem_deleteProblem_problem_tests;
}

export interface deleteProblem_deleteProblem {
  __typename: "DeleteProblemPayload";
  /**
   * The `Problem` that was deleted by this mutation.
   */
  problem: deleteProblem_deleteProblem_problem | null;
}

export interface deleteProblem {
  /**
   * Deletes a single `Problem` using a unique key.
   */
  deleteProblem: deleteProblem_deleteProblem | null;
}

export interface deleteProblemVariables {
  input: DeleteProblemInput;
}
