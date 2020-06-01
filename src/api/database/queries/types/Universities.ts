/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UniversitiesOrderBy, UniversityCondition } from "./../../global-types";

// ====================================================
// GraphQL query operation: Universities
// ====================================================

export interface Universities_universities_nodes {
  __typename: "University";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  shortName: string;
  longName: string | null;
  createdAt: any;
  updatedAt: any;
  cityId: any;
}

export interface Universities_universities {
  __typename: "UniversitiesConnection";
  /**
   * The count of *all* `University` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `University` objects.
   */
  nodes: (Universities_universities_nodes | null)[];
}

export interface Universities {
  /**
   * Reads and enables pagination through a set of `University`.
   */
  universities: Universities_universities | null;
}

export interface UniversitiesVariables {
  first?: number | null;
  last?: number | null;
  offset?: number | null;
  before?: any | null;
  after?: any | null;
  orderBy?: UniversitiesOrderBy[] | null;
  condition?: UniversityCondition | null;
}
