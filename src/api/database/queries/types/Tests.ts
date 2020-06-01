/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TestsOrderBy, TestCondition } from "./../../global-types";

// ====================================================
// GraphQL query operation: Tests
// ====================================================

export interface Tests_tests_nodes {
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

export interface Tests_tests {
  __typename: "TestsConnection";
  /**
   * The count of *all* `Test` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `Test` objects.
   */
  nodes: (Tests_tests_nodes | null)[];
}

export interface Tests {
  /**
   * Reads and enables pagination through a set of `Test`.
   */
  tests: Tests_tests | null;
}

export interface TestsVariables {
  first?: number | null;
  last?: number | null;
  offset?: number | null;
  before?: any | null;
  after?: any | null;
  orderBy?: TestsOrderBy[] | null;
  condition?: TestCondition | null;
}
