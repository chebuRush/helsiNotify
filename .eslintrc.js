{
	"extends": [
		"airbnb",
		"prettier",
		"prettier/react"
	],
	"plugins": [
		"prettier"
	],
	"rules": {
		"prettier/prettier": ["error", {
			"printWidth": 120,
			"tabWidth": 4,
			"singleQuote": true,
			"trailingComma": "none",
			"bracketSpacing": true,
			"jsxBracketSameLine": true,
			"parser": "flow"
		}],
		"import/no-unresolved": [2, { "caseSensitive": false }]
	},
  	"parser": "babel-eslint",
	"parserOptions": {
		"ecmaVersion": 2016,
		"sourceType": "module",
		"ecmaFeatures": {
			"jsx": true
		}
	},
	"env": {
		"es6": true,
		"browser": true,
		"node": true,
		"jest": true
	}
}
