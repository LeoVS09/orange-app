/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeleteContestInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: deleteContest
// ====================================================

export interface deleteContest_deleteContest_contest_creator_user {
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

export interface deleteContest_deleteContest_contest_creator {
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
  user: deleteContest_deleteContest_contest_creator_user | null;
}

export interface deleteContest_deleteContest_contest {
  __typename: "Contest";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  text: string | null;
  creatorId: any;
  startDate: any | null;
  endDate: any | null;
  startPublicationDate: any | null;
  endPublicationDate: any | null;
  createdAt: any;
  updatedAt: any;
  /**
   * Reads a single `Profile` that is related to this `Contest`.
   */
  creator: deleteContest_deleteContest_contest_creator | null;
}

export interface deleteContest_deleteContest {
  __typename: "DeleteContestPayload";
  /**
   * The `Contest` that was deleted by this mutation.
   */
  contest: deleteContest_deleteContest_contest | null;
}

export interface deleteContest {
  /**
   * Deletes a single `Contest` using a unique key.
   */
  deleteContest: deleteContest_deleteContest | null;
}

export interface deleteContestVariables {
  input: DeleteContestInput;
}
