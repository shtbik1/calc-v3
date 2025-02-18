import { dirname } from "path"
import { fileURLToPath } from "url"

import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      semi: ["error", "never"],
      "consistent-return": "off",
      "import/no-extraneous-dependencies": "off",
      "import/extensions": "off",
      "react/react-in-jsx-scope": "off",
      "no-shadow": "off",
      "no-param-reassign": "off",
      "react/jsx-props-no-spreading": "off",
      "jsx-a11y/label-has-associated-control": "off",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "react/jsx-no-bind": "off",
      "import/prefer-default-export": "off",
      "react/destructuring-assignment": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "react/require-default-props": "off",
      "react/button-has-type": "off",
      "react/function-component-definition": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal"],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
]

export default eslintConfig
