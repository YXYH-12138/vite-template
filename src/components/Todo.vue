<script setup lang="ts">
import { ref, computed } from "vue";
import {
	useStorage,
	useTitle,
	useClipboard,
	useDark,
	useToggle,
} from "@vueuse/core";
import { ElMessage } from "element-plus";
import {
	Sunny,
	Moon,
	CopyDocument,
	Delete,
	Plus,
} from "@element-plus/icons-vue";

interface TodoItem {
	id: number;
	text: string;
	done: boolean;
	createdAt: number;
}

// Local storage
const todos = useStorage<TodoItem[]>("vue-todos", []);

// Dark / Light mode
const isDark = useDark();
const toggleDark = useToggle(isDark);

// Clipboard
const { copy } = useClipboard();

// Browser title with remaining count
const remainingCount = computed(
	() => todos.value.filter((t) => !t.done).length,
);
useTitle(
	computed(() => {
		const base = "Todo App";
		return remainingCount.value > 0
			? `${base} (${remainingCount.value})`
			: base;
	}),
);

// New todo input
const newTodoText = ref("");

function addTodo() {
	const text = newTodoText.value.trim();
	if (!text) return;
	todos.value.unshift({
		id: Date.now(),
		text,
		done: false,
		createdAt: Date.now(),
	});
	newTodoText.value = "";
	resetScroll();
}

function removeTodo(id: number) {
	const idx = todos.value.findIndex((t) => t.id === id);
	if (idx !== -1) todos.value.splice(idx, 1);
}

function toggleTodo(id: number) {
	const todo = todos.value.find((t) => t.id === id);
	if (todo) todo.done = !todo.done;
}

function copyTodoText(text: string) {
	copy(text);
	ElMessage.success("Copied!");
}

function formatDate(ts: number) {
	return new Date(ts).toLocaleString();
}

// Infinite scroll
const ITEMS_PER_PAGE = 20;
const visibleCount = ref(ITEMS_PER_PAGE);
const visibleTodos = computed(() => todos.value.slice(0, visibleCount.value));
const listRef = ref<HTMLDivElement | null>(null);

function resetScroll() {
	visibleCount.value = ITEMS_PER_PAGE;
	if (listRef.value) {
		listRef.value.scrollTop = 0;
	}
}

function handleScroll() {
	if (!listRef.value) return;
	const { scrollTop, scrollHeight, clientHeight } = listRef.value;
	if (scrollTop + clientHeight >= scrollHeight - 100) {
		if (visibleCount.value < todos.value.length) {
			visibleCount.value += ITEMS_PER_PAGE;
		}
	}
}

// Total count for display
const totalCount = computed(() => todos.value.length);
const completedCount = computed(() => todos.value.filter((t) => t.done).length);
</script>

<template>
	<div class="todo-app">
		<header class="todo-header">
			<h1 class="todo-title">Todo</h1>
			<el-button
				:icon="isDark ? Sunny : Moon"
				circle
				@click="toggleDark()"
				:title="isDark ? 'Switch to Light' : 'Switch to Dark'"
			/>
		</header>

		<div class="todo-input-row">
			<el-input
				v-model="newTodoText"
				placeholder="What needs to be done?"
				clearable
				@keyup.enter="addTodo"
			/>
			<el-button type="primary" :icon="Plus" @click="addTodo"> Add </el-button>
		</div>

		<div class="todo-list-wrapper" ref="listRef" @scroll="handleScroll">
			<div
				v-for="todo in visibleTodos"
				:key="todo.id"
				class="todo-item"
				:class="{ completed: todo.done }"
			>
				<el-checkbox :model-value="todo.done" @change="toggleTodo(todo.id)" />
				<div class="todo-content">
					<span class="todo-text">{{ todo.text }}</span>
					<span class="todo-date">{{ formatDate(todo.createdAt) }}</span>
				</div>
				<div class="todo-actions">
					<el-button
						:icon="CopyDocument"
						circle
						size="small"
						@click="copyTodoText(todo.text)"
						title="Copy"
					/>
					<el-button
						:icon="Delete"
						circle
						size="small"
						type="danger"
						@click="removeTodo(todo.id)"
						title="Delete"
					/>
				</div>
			</div>
			<div v-if="todos.length === 0" class="todo-empty">
				No todos yet. Add one above!
			</div>
		</div>

		<footer class="todo-footer">
			<span
				>{{ remainingCount }} item{{
					remainingCount !== 1 ? "s" : ""
				}}
				remaining</span
			>
			<span>{{ completedCount }} / {{ totalCount }} completed</span>
		</footer>
	</div>
</template>

<style lang="scss">
@use "element-plus/theme-chalk/dark/css-vars.css";
html.dark {
	color-scheme: normal;
}
body {
	background-color: var(--el-bg-color);
	transition:
		background 0.4s ease,
		color 0.4s ease;
}
</style>
<style lang="scss" scoped>
.todo-app {
	height: 100%;
	max-width: 600px;
	margin: 0 auto;
	padding: 24px 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	height: 100%;
	box-sizing: border-box;
}

.todo-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.todo-title {
	font-size: 28px;
	font-weight: 700;
	margin: 0;
	color: var(--el-text-color-primary);
}

.todo-input-row {
	display: flex;
	gap: 8px;
}

.todo-list-wrapper {
	flex: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding-right: 4px;
	min-height: 0;
}

.todo-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 10px 12px;
	border-radius: 8px;
	background: var(--el-fill-color-lighter);
	transition: background 0.2s;

	&:hover {
		background: var(--el-fill-color-light);

		.todo-actions {
			opacity: 1;
		}
	}

	&.completed {
		.todo-text {
			text-decoration: line-through;
			color: var(--el-text-color-placeholder);
		}
	}
}

.todo-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2px;
	overflow: hidden;
}

.todo-text {
	font-size: 14px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: var(--el-text-color-primary);
}

.todo-date {
	font-size: 11px;
	color: var(--el-text-color-placeholder);
}

.todo-actions {
	display: flex;
	gap: 4px;
	opacity: 0.4;
	transition: opacity 0.2s;
}

.todo-empty {
	text-align: center;
	color: var(--el-text-color-placeholder);
	padding: 40px 0;
}

.todo-footer {
	display: flex;
	justify-content: space-between;
	font-size: 13px;
	color: var(--el-text-color-secondary);
	padding-top: 8px;
	border-top: 1px solid var(--el-border-color-light);
}
</style>
