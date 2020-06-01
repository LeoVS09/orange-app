/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateProblemInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: updateProblem
// ====================================================

export interface updateProblem_updateProblem_problem_author_user {
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

export interface updateProblem_updateProblem_problem_author {
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
  user: updateProblem_updateProblem_problem_author_user | null;
}

export interface updateProblem_updateProblem_problem_tester_user {
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

export interface updateProblem_updateProblem_problem_tester {
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
  user: updateProblem_updateProblem_problem_tester_user | null;
}

export interface updateProblem_updateProblem_problem_problemsTags_nodes_tag {
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

export interface updateProblem_updateProblem_problem_problemsTags_nodes {
  __typename: "ProblemsTag";
  /**
   * Reads a single `Tag` that is related to this `ProblemsTag`.
   */
  tag: updateProblem_updateProblem_problem_problemsTags_nodes_tag | null;
}

export interface updateProblem_updateProblem_problem_problemsTags {
  __typename: "ProblemsTagsConnection";
  /**
   * A list of `ProblemsTag` objects.
   */
  nodes: (updateProblem_updateProblem_problem_problemsTags_nodes | null)[];
}

export interface updateProblem_updateProblem_problem_inputType {
  __typename: "ProgramInputType";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
}

export interface updateProblem_updateProblem_problem_outputType {
  __typename: "ProgramOutputType";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
}

export interface updateProblem_updateProblem_problem_tests_nodes {
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
  problemId: any;
  createdAt: any;
  updatedAt: any;
}

export interface updateProblem_updateProblem_problem_tests {
  __typename: "TestsConnection";
  /**
   * A list of `Test` objects.
   */
  nodes: (updateProblem_updateProblem_problem_tests_nodes | null)[];
}

export interface updateProblem_updateProblem_problem {
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
  author: updateProblem_updateProblem_problem_author | null;
  /**
   * Reads a single `Profile` that is related to this `Problem`.
   */
  tester: updateProblem_updateProblem_problem_tester | null;
  /**
   * Reads and enables pagination through a set of `ProblemsTag`.
   */
  problemsTags: updateProblem_updateProblem_problem_problemsTags;
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
  inputType: updateProblem_updateProblem_problem_inputType | null;
  /**
   * Reads a single `ProgramOutputType` that is related to this `Problem`.
   */
  outputType: updateProblem_updateProblem_problem_outputType | null;
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
  tests: updateProblem_updateProblem_problem_tests;
}

export interface updateProblem_updateProblem {
  __typename: "UpdateProblemPayload";
  /**
   * The `Problem` that was updated by this mutation.
   */
  problem: updateProblem_updateProblem_problem | null;
}

export interface updateProblem {
  /**
   * Updates a single `Problem` using a unique key and a patch.
   */
  updateProblem: updateProblem_updateProblem | null;
}

export interface updateProblemVariables {
  input: UpdateProblemInput;
}
