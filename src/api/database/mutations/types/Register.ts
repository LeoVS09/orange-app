/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_register_user_userEmails_nodes {
  __typename: "UserEmail";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  /**
   * The users email address, in `a@b.c` format.
   */
  email: string;
  /**
   * True if the user has is_verified their email address (by clicking the link in
   * the email we sent them, or logging in with a social login provider), false otherwise.
   */
  isVerified: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface Register_register_user_userEmails {
  __typename: "UserEmailsConnection";
  /**
   * A list of `UserEmail` objects.
   */
  nodes: (Register_register_user_userEmails_nodes | null)[];
}

export interface Register_register_user_profiles_nodes_city {
  __typename: "City";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  countryId: any;
  createdAt: any;
  updatedAt: any;
}

export interface Register_register_user_profiles_nodes_university {
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

export interface Register_register_user_profiles_nodes {
  __typename: "Profile";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  phone: string | null;
  groupNumber: string | null;
  course: number | null;
  isTeacher: boolean | null;
  createdAt: any;
  updatedAt: any;
  /**
   * Reads a single `City` that is related to this `Profile`.
   */
  city: Register_register_user_profiles_nodes_city | null;
  /**
   * Reads a single `University` that is related to this `Profile`.
   */
  university: Register_register_user_profiles_nodes_university | null;
}

export interface Register_register_user_profiles {
  __typename: "ProfilesConnection";
  /**
   * A list of `Profile` objects.
   */
  nodes: (Register_register_user_profiles_nodes | null)[];
}

export interface Register_register_user {
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
  /**
   * Public-facing username (or 'handle') of the user.
   */
  username: string;
  /**
   * If true, the user has elevated privileges.
   */
  isAdmin: boolean;
  /**
   * Optional avatar URL.
   */
  avatarUrl: string | null;
  createdAt: any;
  updatedAt: any;
  /**
   * Reads and enables pagination through a set of `UserEmail`.
   */
  userEmails: Register_register_user_userEmails;
  /**
   * Reads and enables pagination through a set of `Profile`.
   */
  profiles: Register_register_user_profiles;
}

export interface Register_register {
  __typename: "RegisterPayload";
  user: Register_register_user;
}

export interface Register {
  register: Register_register | null;
}

export interface RegisterVariables {
  username: string;
  email: string;
  password: string;
  name?: string | null;
  avatarUrl?: string | null;
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
}
