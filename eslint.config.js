import js from "@eslint/js";
import airbnbBase from "eslint-config-airbnb-base";
import prettier from "eslint-config-prettier";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        process: "readonly",
      },
    },
    plugins: {},
    rules: {
      "no-console": "off", // Allow console.log in Node.js development
      "no-underscore-dangle": "off", // Allow _id from MongoDB
      "no-unused-vars": ["error", { argsIgnorePattern: "next" }], // Ignore unused 'next' parameter in Express middleware
      "max-classes-per-file": "off", // Allow multiple classes in a single file
    },
    ...js.configs.recommended,
    ...airbnbBase,
    ...prettier,
  },
];
