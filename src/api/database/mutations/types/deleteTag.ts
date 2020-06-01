/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeleteTagInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: deleteTag
// ====================================================

export interface deleteTag_deleteTag_tag {
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

export interface deleteTag_deleteTag {
  __typename: "DeleteTagPayload";
  /**
   * The `Tag` that was deleted by this mutation.
   */
  tag: deleteTag_deleteTag_tag | null;
}

export interface deleteTag {
  /**
   * Deletes a single `Tag` using a unique key.
   */
  deleteTag: deleteTag_deleteTag | null;
}

export interface deleteTagVariables {
  input: DeleteTagInput;
}
