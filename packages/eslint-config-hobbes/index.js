module.exports = {
  extends: ['airbnb', 'cleanjs'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      generators: true,
      experimentalObjectRestSpread: true,
    },
  },
  rules: {
    'no-underscore-dangle': 0,
    'arrow-parens': 0,

    // ###  import
    // our src modules are in node_modules but not package.json
    'import/no-extraneous-dependencies': 0,
    // I just found these two kind of annoying
    'import/no-named-as-default-member': 0,
    'import/prefer-default-export': 0,

    // ###  react
    // we just use js for everything
    'react/jsx-filename-extension': 0,
    // this seems to ignore flow type
    'react/no-unused-prop-types': 0,

    // ###  jsx
    // doesn't check props for children
    'jsx-a11y/anchor-has-content': 0,

    // ###  fp
    // need nulls for GraphQL variables
    'fp/no-nil': 0,
    // Tests blow up with this
    'fp/no-unused-expression': 0,

    // ###  better
    // we might want the use new Set/Map
    'better/no-new': 0,
    // already have a rule against nested ternary
    'better/no-ifs': 0,
    // Tests blow up with this
    'better/explicit-return': 0,

    // ###  flowtype
    'flowtype/boolean-style': [2, 'boolean'],
    'flowtype/define-flow-type': 2,
    'flowtype/delimiter-dangle': [2, 'always-multiline'],
    'flowtype/generic-spacing': [2, 'never'],
    'flowtype/no-dupe-keys': 2,
    'flowtype/no-weak-types': 2,
    'flowtype/require-parameter-type': [2, {
      excludeArrowFunctions: true,
    }],
    'flowtype/require-return-type': [2, 'always', {
      annotateUndefined: 'always',
      excludeArrowFunctions: true,
    }],
    'flowtype/require-valid-file-annotation': [2, 'always'],
    'flowtype/semi': [2, 'always'],
    'flowtype/sort-keys': [2, 'asc'],
    'flowtype/space-after-type-colon': [2, 'always'],
    'flowtype/space-before-generic-bracket': [2, 'never'],
    'flowtype/space-before-type-colon': [2, 'never'],
    'flowtype/type-id-match': [2, '^([A-Z][a-z0-9]+)+Type$'],
    'flowtype/union-intersection-spacing': [2, 'always'],
    'flowtype/use-flow-type': 0,
    // deprecated
    'flowtype/valid-syntax': 0,
  },
  plugins: [
    'flowtype',
  ],
  env: {
    browser: true,
    jasmine: true,
  },
  globals: {
    __DEBUG__: true,
    __DEV__: true,
    sinon: true,
  },
};
