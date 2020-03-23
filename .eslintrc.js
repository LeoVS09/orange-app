module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: [
      'error',
      'never'
    ],
    curly: [
      'error',
      'multi-or-nest'
    ],
    'nonblock-statement-body-position': [
      'error',
      'below'
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1
      }
    ],
    'func-names': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-array-constructor': 'off',
    'consistent-return': 'off',
    'max-len': 'off', // TODO: on it rule
    'import/prefer-default-export': 'off', // not work when have only export
    'import/no-cycle': 'off',  // cannot allow cycle interface imports
    'no-use-before-define': 'off',  // it rule not allow write readable code
    'camelcase': 'off', // generated ts types from graphql not in camelcase
    'no-return-assign': 'off',
    'no-param-reassign': 'off',
    'no-return-await': 'off',
    'no-nested-ternary': 'off',
    'default-case': 'off',
    'class-methods-use-this': 'off',
    'no-mixed-operators': 'off',
    'vue/valid-v-model': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'import/no-named-as-default': 'off',
    'import/named': 'off', // have bugs
    'no-multi-assign': 'off',
    'no-restricted-syntax': 'off',
    'no-continue': 'off',
    'no-plusplus': 'off',
    'no-unused-vars': 'off', // not properly work with classes
    'padded-blocks': 'off',
    'comma-dangle': ['error', 'never'],
    'max-classes-per-file': 'off',
    'arrow-parens': ['error', 'as-needed'],
    // 'graphql/template-strings': [
    //   'error',
    //   {
    //     env: 'literal',
    //     projectName: 'app',
    //     schemaJsonFilepath: 'node_modules/.temp/graphql/schema.json'
    //   }
    // ]
  },

  // plugins: [
  //   'graphql'
  // ]
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
