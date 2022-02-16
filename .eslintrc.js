module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['packages/app/tsconfig.json', 'packages/view/tsconfig.json', 'packages/shared/tsconfig.json'],
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    root: true,
    env: {
        node: true,
        jest: true
    },
    ignorePatterns: ['.eslintrc.js', 'changelog.config.js', 'commitlint.config.js'],
    rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                trailingComma: 'none',
                bracketSpacing: true,
                semi: false,
                printWidth: 120,
                arrowParens: 'avoid',
                tabWidth: 4
            }
        ],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off'
    }
}
