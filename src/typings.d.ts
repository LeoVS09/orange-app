declare module "*.vue" {
  import Vue from "vue";
  const _default: Vue;
  export default _default;
}

declare module "*.json" {
  const value: any;
  export default value;
}

declare module "*.gql" {
  const content: any;
  export default content;
}

declare module "*.graphql" {
  const content: any;
  export default content;
}
