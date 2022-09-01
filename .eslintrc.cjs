module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
		// 开启setup语法糖环境
		"vue/setup-compiler-macros": true
	},
	extends: [
		"eslint:recommended",
		"plugin:vue/vue3-essential",
		// @vue/eslint-config-typescript
		"@vue/typescript/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended"
	],
	overrides: [],
	// 解析vue文件,使得eslint能解析<template>标签中的内容
	parser: "vue-eslint-parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module"
	},
	plugins: ["vue", "@typescript-eslint"],
	rules: {}
};
