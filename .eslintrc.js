module.exports = {
  "extends": "airbnb",
  "rules": {
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    "quotes": ['error', 'single'],
    "semi": ['error', 'never'],
    'max-len': ['error', 200],
    'no-shadow': 'off', // 解构需要，比如 const { getUser } = this.props
    'no-return-assign': 'off', // 这与 react 中获取元素的方式冲突， ref = {ele => this.input = ele}
    'no-nested-ternary': 'off', // 习惯了在jsx语法各种三元操作了  
    'linebreak-style': ["off", "windows"],  
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/prop-types': 0,
    'react/no-danger': 'off',
    'react/react-in-jsx-scope': 0,

    'jsx-a11y/anchor-is-valid': ['error', {
      components: [''],
      specialLink: ['hrefLeft', 'hrefRight'],
      aspects: ['noHref', 'invalidHref', 'preferButton'],
    }],
  }
}