<script lang="tsx">
import { defineComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMenu, ElMenuItem, ElSubMenu } from "element-plus";
import SvgIcon from "../SvgIcon/index.vue";
import { resolveRouterPath } from "@/utils/common";

export default defineComponent({
	name: "MenuList",
	inheritAttrs: false,
	components: { SvgIcon },
	props: {
		// 显示的菜单
		menus: {
			type: Array,
			required: true,
		},
		// children字段
		children: {
			type: String,
			default: "children",
		},
		// 是否开启路由模式
		router: Boolean,
		// 递归的深度
		deep: {
			type: Number,
			default: Infinity,
		},
	},
	emits: ["change"],
	setup(props, { emit, attrs }) {
		const { push } = useRouter();
		const route = useRoute();

		const createMenuItem = (
			data: any[],
			deep: number,
			rootPath = "",
		): any[] | undefined => {
			return data.map((item) => {
				const path = resolveRouterPath(rootPath, item.path);

				const { title, icon } = item.meta || {};
				return deep < props.deep &&
					item[props.children] &&
					item[props.children].length > 0 ? (
					<ElSubMenu
						index={path || title}
						v-slots={{
							title: () => (
								<>
									{icon && icon != "#" && (
										<SvgIcon class="icon" iconName={icon} />
									)}
									<span>{title}</span>
								</>
							),
						}}
					>
						{createMenuItem(item[props.children], deep + 1, item.path)}
					</ElSubMenu>
				) : (
					item.hidden || (
						<ElMenuItem
							class="font-size-16px tracking-[.1em]"
							index={path}
							v-slots={{
								default: () => (
									<>
										{icon && icon != "#" && (
											<SvgIcon class="icon" iconName={icon} />
										)}
									</>
								),
								title: () => (
									<>
										<li class={deep === 1 ? ["menu-item"] : "menu-item"}>
											{/* {icon && icon != "#" && <SvgIcon class="icon" iconName={icon} />} */}
											<span>{title}</span>
										</li>
									</>
								),
							}}
						></ElMenuItem>
					)
				);
			});
		};

		const handleClick = (index: string, indexPath: string[], item: any) => {
			props.router && push(index);
			emit("change", index, indexPath, item);
		};

		return () => {
			return (
				<ElMenu
					class="menu-list"
					ellipsis={false}
					default-active={route.path}
					menu-trigger="click"
					background-color="#324157"
					text-color="#bfcbd9"
					{...attrs}
					onSelect={handleClick}
				>
					{createMenuItem(props.menus || [], 1)}
				</ElMenu>
			);
		};
	},
});
</script>

<style lang="scss" scoped>
.menu-list {
	--el-menu-item-height: 50px;
	// --el-menu-bg-color: #324157;
	--el-menu-active-color: #fff;
	--el-menu-hover-text-color: #fff;
	--el-menu-item-font-size: var(--font-size-small);
	--el-menu-hover-text-color: var(--text-color-active);
	// --el-menu-hover-bg-color: rgba(67, 74, 80, 0.5);
	// --el-menu-active-color: var(--text-color-active);
	height: 100%;
	border-right: 0;
	border-bottom: none;
	.icon {
		margin-right: 6px;
		color: inherit;
	}
	:deep(.el-menu-item) {
		--el-menu-hover-text-color: #fff;
		--el-menu-active-color: #fff;
		// --el-menu-text-color: #fff;
		// --el-menu-hover-bg-color: #545c64;
		border-bottom: none;
		&.is-active {
			background-color: #0960bd;
		}
	}
	:deep(.el-sub-menu) {
		// --el-menu-hover-bg-color: #545c64;
		// --el-menu-text-color: #fff;
		--el-menu-active-color: #fff;
		--el-menu-hover-text-color: #fff;
		// --el-menu-item-font-size: var(--header-main-size);
		.el-sub-menu__title,
		&.is-active .el-sub-menu__title {
			border-bottom: none;
		}
	}
}
</style>
