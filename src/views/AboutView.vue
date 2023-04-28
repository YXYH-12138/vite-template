<template>
	<div class="about">
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
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";

withDefaults(defineProps<{ msg?: string }>(), { msg: "hello" });

const count = ref(0);
const input = ref("element-plus");

const curDate = ref("");

const toast = () => {
	ElMessage.success("Hello");
};
</script>

<style lang="scss" scoped>
@media (min-width: 1024px) {
	.about {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}
}
.about {
	:deep(.el-button) {
		margin-left: 0;
		&:nth-child(n + 2) {
			margin-top: 6px;
		}
	}
}
</style>
