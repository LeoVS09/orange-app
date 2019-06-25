/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeleteTestInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: deleteTest
// ====================================================

export interface deleteTest_deleteTest_test {
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

export interface deleteTest_deleteTest {
  __typename: "DeleteTestPayload";
  /**
   * The `Test` that was deleted by this mutation.
   */
  test: deleteTest_deleteTest_test | null;
}

export interface deleteTest {
  /**
   * Deletes a single `Test` using a unique key.
   */
  deleteTest: deleteTest_deleteTest | null;
}

export interface deleteTestVariables {
  input: DeleteTestInput;
}
