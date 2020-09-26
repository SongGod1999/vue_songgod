module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    indent: ['off', 2],
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren': 0,
    'space-before-blocks': 0,
    'no-trailing-spaces': 0,
    'comma-dangle': 0
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}
