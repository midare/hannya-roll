// npm install --save-dev eslint eslint-config-airbnb-base eslint-plugin-import

module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: 'eslint-config-airbnb-base',
  rules: {
    'arrow-parens': ['error', 'always'],
    'no-underscore-dangle': [
      'error',
      {
        allowAfterThis: true,
      },
    ],
    'class-methods-use-this': 'off',
    'import/extensions': ['error', 'ignorePackages'],
    'no-unused-vars': ['off'],
  },
};
