<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";

defineProps<{ msg: string }>();

const count = ref(0);
const input = ref("element-plus");

const curDate = ref("");

const toast = () => {
	ElMessage.success("Hello");
};
</script>

<template>
	<h1 style="margin-bottom: 20px">{{ msg }}</h1>

	<!-- example components -->
	<el-button @click="toast">El Message</el-button>
	<el-button type="primary" @click="count++">count is: {{ count }}</el-button>
	<el-button type="success" @click="count++">count is: {{ count }}</el-button>
	<el-button type="warning" @click="count++">count is: {{ count }}</el-button>
	<el-button type="danger" @click="count++">count is: {{ count }}</el-button>
	<el-button type="info" @click="count++">count is: {{ count }}</el-button>
	<br />
	<el-input v-model="input" style="width: 200px; margin: 20px 20px 20px 0" />
	<el-tag>Tag 1</el-tag>

	<br />
	<el-date-picker v-model="curDate" type="date" placeholder="Pick a day"></el-date-picker>
</template>

<style>
.ep-button {
	margin: 4px;
}
</style>
