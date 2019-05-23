/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateTestInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: updateTest
// ====================================================

export interface updateTest_updateTest_test {
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

export interface updateTest_updateTest {
  __typename: "UpdateTestPayload";
  /**
   * The `Test` that was updated by this mutation.
   */
  test: updateTest_updateTest_test | null;
}

export interface updateTest {
  /**
   * Updates a single `Test` using a unique key and a patch.
   */
  updateTest: updateTest_updateTest | null;
}

export interface updateTestVariables {
  input: UpdateTestInput;
}
