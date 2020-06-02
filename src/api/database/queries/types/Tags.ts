/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TagsOrderBy, TagCondition } from "./../../global-types";

// ====================================================
// GraphQL query operation: Tags
// ====================================================

export interface Tags_tags_nodes {
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

export interface Tags_tags {
  __typename: "TagsConnection";
  /**
   * The count of *all* `Tag` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `Tag` objects.
   */
  nodes: (Tags_tags_nodes | null)[];
}

export interface Tags {
  /**
   * Reads and enables pagination through a set of `Tag`.
   */
  tags: Tags_tags | null;
}

export interface TagsVariables {
  first?: number | null;
  last?: number | null;
  offset?: number | null;
  before?: any | null;
  after?: any | null;
  orderBy?: TagsOrderBy[] | null;
  condition?: TagCondition | null;
}
