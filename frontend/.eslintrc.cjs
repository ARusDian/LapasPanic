module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": ["plugin:react/recommended", "plugin:@typescript-eslint/recommended"],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": ["error", {
            "skipUndeclared": true
        }]
    }
}
