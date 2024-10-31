module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "import", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier"
  ],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/consistent-type-definitions": "error",
    "no-unused-vars": ["off", { args: "all", argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-unused-vars": ["off", { args: "all", argsIgnorePattern: "^_" }],
    "import/order": [
      "error",
      {
        "newlines-between": "never",
        groups: [
          ["builtin", "external"],
          ["internal", "parent", "sibling", "index"]
        ]
      }
    ]
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"]
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["./tsconfig.json"]
      }
    }
  }
};
