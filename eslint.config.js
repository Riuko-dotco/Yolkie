import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
    {
        ignores: [
            "dist/**",
            "node_modules/**",
            "coverage/**",
        ],
    },

    js.configs.recommended,

    {
        files: ["**/*.{ts,tsx}"],

        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },

            globals: {
                ...globals.browser,
                chrome: "readonly",
            },
        },

        plugins: {
            "@typescript-eslint": tseslint.plugin,
        },

        rules: {
            ...tseslint.configs.recommendedTypeChecked.rules,
            ...tseslint.configs.stylisticTypeChecked.rules,

            "curly": ["error", "all"],
            "eqeqeq": ["error", "always"],

            "no-console": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],

            "@typescript-eslint/consistent-type-imports": [
                "error",
                {
                    prefer: "type-imports",
                },
            ],

            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-misused-promises": "error",
            "@typescript-eslint/await-thenable": "error",
        },
    },
);