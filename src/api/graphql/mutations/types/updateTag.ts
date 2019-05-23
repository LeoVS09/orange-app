/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateTagInput } from "./../../global-types";

// ====================================================
// GraphQL mutation operation: updateTag
// ====================================================

export interface updateTag_updateTag_tag {
  __typename: "Tag";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
}

export interface updateTag_updateTag {
  __typename: "UpdateTagPayload";
  /**
   * The `Tag` that was updated by this mutation.
   */
  tag: updateTag_updateTag_tag | null;
}

export interface updateTag {
  /**
   * Updates a single `Tag` using a unique key and a patch.
   */
  updateTag: updateTag_updateTag | null;
}

export interface updateTagVariables {
  input: UpdateTagInput;
}
