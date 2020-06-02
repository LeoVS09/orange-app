/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CreateTestInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: createTest
// ====================================================

export interface createTest_createTest_test {
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

export interface createTest_createTest {
  __typename: "CreateTestPayload";
  /**
   * The `Test` that was created by this mutation.
   */
  test: createTest_createTest_test | null;
}

export interface createTest {
  /**
   * Creates a single `Test`.
   */
  createTest: createTest_createTest | null;
}

export interface createTestVariables {
  input: CreateTestInput;
}
