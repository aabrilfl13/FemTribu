/** @type {import("prettier").Config} */
export default {
	printWidth: 100,
	semi: false,
	singleQuote: false,
	jsxSingleQuote: false,
	quoteProps: "consistent",
	tabWidth: 2,
	trailingComma: "es5",
	useTabs: true,
	endOfLine: "lf",
	arrowParens: "always",
	plugins: [
		"prettier-plugin-astro",
		"@ianvs/prettier-plugin-sort-imports",
		"prettier-plugin-tailwindcss",
	],
	importOrder: ["<BUILTIN_MODULES>", "<THIRD_PARTY_MODULES>", "", "^@/(.*)$", "", "^[./]"],
	overrides: [
		{
			files: "*.astro",
			options: {
				parser: "astro",
			},
		},
		{
			files: ["*.json", "*.md", "*.toml", "*.yml"],
			options: {
				useTabs: false,
			},
		},
	],
}
