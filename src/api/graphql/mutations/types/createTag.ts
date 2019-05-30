/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CreateTagInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: createTag
// ====================================================

export interface createTag_createTag_tag {
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

export interface createTag_createTag {
  __typename: "CreateTagPayload";
  /**
   * The `Tag` that was created by this mutation.
   */
  tag: createTag_createTag_tag | null;
}

export interface createTag {
  /**
   * Creates a single `Tag`.
   */
  createTag: createTag_createTag | null;
}

export interface createTagVariables {
  input: CreateTagInput;
}
