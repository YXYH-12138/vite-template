import { isPlainObject, isString } from "es-toolkit";
import type { AnyFn } from "./util-type";

export function isEmptyValue(value: any) {
	return value == null || value === "";
}

export function uuid() {
	// 生成一个符合UUID v4标准的随机字符串
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0,
			v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

/**
 * 获取错误信息
 * @param error
 * @param defaultError
 * @returns
 */
export function getError(error: any, defaultError = "错误") {
	return isString(error)
		? error.length > 60
			? defaultError
			: error || defaultError
		: defaultError;
}

/**
 * 是否是一个Number类型，如果字符串也会转为Number判断
 *  NaN, Infinity, -Infinity 都不算数值类型
 * @param val
 * @returns
 */
export function isNumber(val: any): val is number {
	if (typeof val === "number" || (typeof val === "string" && val.length > 0)) {
		const _val = Number(val);
		return !Number.isNaN(_val) && _val !== Infinity && _val !== -Infinity;
	}
	return false;
}

/**
 * @description 判断是否为有效数值
 * @param value
 * @returns {boolean}
 */
export function isEffectiveValue(value: any) {
	return (
		!Number.isNaN(Number(value)) &&
		typeof value !== "boolean" &&
		!Array.isArray(value) &&
		value !== "" &&
		value !== null
	);
}

/**
 * 装换成number类型
 * @param val 需要转换的值
 * @param defaultStr 不是number时返回的默认字符
 * @returns
 */
export function toNumber(val: any, defaultStr = "") {
	return isNumber(val) ? Number(val) : defaultStr;
}

/**
 * 转换数字
 * @param num
 * @param fractionDigits 保留的小数
 * @param defaultStr 转换失败时返回的默认字符
 * @param strict 严格模式下0也返回defaultStr
 * @param ignoreTrailingZeros 去除末尾无意义的‘0’
 * @returns
 */
export function parseNumber(
	num: string | number | undefined | null,
	fractionDigits?: number,
	defaultStr = "",
	strict = false,
	ignoreTrailingZeros = false
): string | number {
	if (!isNumber(num)) return defaultStr;
	if (strict && num == 0) return defaultStr;
	if (ignoreTrailingZeros) return Number(Number(num).toFixed(fractionDigits));
	return Number(num).toFixed(fractionDigits);
}

/**
 * 数字格式化
 * @param val
 * @param fractionDigits
 * @returns
 */
export function toFixed(val: any, fractionDigits: number): number {
	return isNumber(val) ? Number(Number(val).toFixed(fractionDigits)) : val;
}

/**
 * 解析json字符串
 * @param json
 * @returns
 */
export function parseJson<T = any>(json: string): Promise<T> {
	if (typeof json !== "string") return Promise.reject();
	try {
		const result = JSON.parse(json);
		return Promise.resolve(result);
	} catch (error) {
		return Promise.reject(error);
	}
}

/**
 * 将数组转化为对象
 * @param data
 * @param keyField
 * @param valueField
 * @returns
 */
export function arrayToObject<T extends Record<string, any>, K extends keyof T>(
	data: T[],
	keyField: K,
	valueField: K
) {
	return data.reduce(
		(obj, item) => {
			obj[item[keyField]] = item[valueField];
			return obj;
		},
		{} as Record<T[K], T[K]>
	);
}

/**
 * 将数组转化为对象
 * @param data
 * @param keyField
 * @param valueField
 * @returns
 */
export function arrayToObjectValue<T extends Record<string, any>, K extends keyof T>(
	data: T[],
	keyField: K
) {
	return data.reduce(
		(obj, item) => {
			obj[item[keyField]] = item;
			return obj;
		},
		{} as Record<T[K], T>
	);
}

/** 格式化数组 */
export function fixedArray(data: number[], fractionDigits: number) {
	return data.map((value) => toFixed(value, fractionDigits));
}

/**
 * 对象数组转化为一维数组
 * @param data 需要转化的数据
 * @param keys 数组对象中的key
 * @example
 * { Z: "1", Q: "4" },
 * { Z: "2", Q: "5" },
 * =>
 * [[1,2],[4,5]]
 * @returns
 */
export function transformArray<T extends Record<string, any>, K extends keyof T>(
	data: T[],
	keys: K[],
	format?: AnyFn
) {
	const result: Array<any[]> = [];
	data.forEach((row) => {
		keys.forEach((key, i) => {
			(result[i] || (result[i] = [])).push(format ? format(row[key]) : row[key]);
		});
	});
	return result;
}

/**
 * 解析字符串文本转成数组 TODO:无法识别 2022-01-01 08:00 这样的时间格式
 * @param text
 * @example
 *  `2022-01-01 1 2
 *	2022-01-02 3 4`
 *  =>
 *  [["2022-01-01", "1", "2"],
 *	 ["2022-01-02", "3", "4"]]
 * @returns
 */
export function stringToArray(text: string) {
	return text
		.split("\n")
		.map((row) => row.split(/\t|\s/g).filter(Boolean))
		.filter((item) => item.length);
	// .map((item) => {
	// 	// 进行时间的判断
	// 	if (item.length >= 2) {
	// 		const tm = `${item[0]} ${item[1]}`;
	// 		return dayjs(tm).isValid() ? [tm, ...item.slice(2)] : item;
	// 	}
	// 	return item;
	// });
}

/**
 * 将输入的字符串转为数组
 * @param input
 * @example
 * { Z: "1,2,3", Q: "4,5,6", T: "8,9,10" }
 * => [
 *	{ Z: "1", Q: "4", T: "8" },
 *	{ Z: "2", Q: "5", T: "9" },
 *	{ Z: "3", Q: "6", T: "10" }
 * ];
 * @returns
 */
export function parseMultipleString<T = any>(input: Record<string, string>) {
	const spReg = /,|，|\s/;
	const keys = Object.keys(input);
	const arrays: string[][] = [];
	const keyMap: string[] = [];
	keys.forEach((key) => {
		arrays.push(input[key].split(spReg));
		keyMap.push(key);
	});
	const [first, ...other] = arrays;

	const data = first.map((val, i) => {
		const row = { [keyMap[0]]: val };
		other.forEach((otherArr, j) => {
			row[keyMap[j + 1]] = otherArr[i];
		});
		return row;
	}) as T[];

	return data;
}

/**
 * 创建一个promise的resolve
 * @returns
 */
export function withResolvers<T = any>() {
	let resolve!: (value: T) => void;
	let reject!: (value?: any) => void;
	const promise = new Promise<T>((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});

	return { promise, resolve, reject };
}

/**
 * 数组转map对象
 * @param data
 * @param key
 * @returns
 */
export function arraryToMap<T extends Record<string, any>, K extends keyof T>(data: T[], key: K) {
	const map = new Map<T[K], T>();
	for (const item of data) {
		map.set(item[key], item);
	}
	return map;
}

/**
 * 获取对象第一个有值的value
 * @param obj
 * @returns
 */
export function getItemByObject<T extends Record<string, any>>(obj: T) {
	const keys = Object.keys(obj);
	for (let i = 0, len = keys.length; i < len; i++) {
		const item = obj[keys[i]];
		if (item != null) return item;
	}
}

/**
 * 下载文件
 * @param data
 * @param filename
 */
export function download(data: Blob | string, filename: string) {
	let url: string;
	const isBolb = data instanceof Blob;
	if (isBolb) {
		url = window.URL.createObjectURL(data);
	} else {
		url = data;
	}
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.target = "_blank"; // 可选，新标签页打开
	a.click();
	isBolb && window.URL.revokeObjectURL(url);
}

/**
 * Excel下载
 * @param data
 * @param filename
 */
export function downloadExcel<T extends BlobPart>(data: T, filename = "表格") {
	const blob = new Blob([data], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	});
	download(blob, filename);
}

/**
 * await处理函数
 * @param { Promise } promise
 * @param { Object } errorExt -可以传递给err对象的附加信息
 * @return { Promise }
 */
export function awaitTo<T, U = Error>(
	promise: Promise<T>,
	errorExt?: Record<string, any>
): Promise<[U, undefined] | [null, T]> {
	return promise
		.then<[null, T]>((data: T) => [null, data])
		.catch<[U, undefined]>((err: U) => {
			if (errorExt) {
				const parsedError = Object.assign({}, err, errorExt);
				return [parsedError, undefined];
			}
			return [err, undefined];
		});
}

/**
 * 拼接路由的path
 * @param rootPath
 * @param path
 * @returns
 */
export function resolveRouterPath(rootPath: string, path: string) {
	if (!path) return rootPath;
	if (path.startsWith("/")) return path;
	(rootPath && rootPath.endsWith("/")) || (rootPath += "/");
	return rootPath + path;
}

/**
 * 延迟函数
 * @param delay
 * @returns
 */
export async function sleep(delay: number) {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, delay);
	});
}

/** 删除全部对象的属性 */
export function deleteAllObjectProperty<T extends Record<string, any>>(obj: T) {
	Object.keys(obj).forEach((key) => Reflect.deleteProperty(obj, key));
}

/**
 * 根据传入的fields字段值排序数组
 * @param data
 * @param fields 字段值数组
 * @param key 字段
 * @returns
 */
export function sortByFields<T extends Array<any>>(
	data: T,
	fields: Array<keyof T>,
	key: keyof T[number]
): T {
	let index = -1;
	const firstList = Array.from({ length: fields.length });
	const lastList = new Array<T>();

	data.forEach((item) => {
		index = fields.indexOf(item[key]);
		if (index !== -1) {
			firstList[index] = item;
		} else {
			lastList.push(item);
		}
	});
	return firstList.filter(Boolean).concat(lastList) as T;
}

/**
 * 并发控制函数
 * @param poolLimit 最大并发数量
 * @param iterable 数组，会再函数中回调每一个参数
 * @param iteratorFn 返回Promise的回调函数，会传入iterable的每一项
 * @returns
 */
export function asyncPool<T, P = any>(
	poolLimit: number,
	iterable: T[],
	iteratorFn: (arg: T, array: T[]) => Promise<P>
) {
	let i = 0;
	const ret: any[] = [];
	const executing = new Set();
	const enqueue: () => Promise<void> = function () {
		if (i === iterable.length) {
			return Promise.resolve();
		}
		const item = iterable[i++];
		const p = Promise.resolve().then(() => iteratorFn(item, iterable));
		ret.push(p);
		executing.add(p);
		const clean = () => executing.delete(p);
		p.then(clean).catch(clean);
		let r = Promise.resolve();
		if (executing.size >= poolLimit) {
			r = Promise.race<any>(executing);
		}
		return r.then(() => enqueue());
	};
	return enqueue().then(() => Promise.all(ret));
}

type ReadFileOption = {
	// 是否多选
	multiple?: boolean;
	// 文件类型
	accept?: string;
	// before的提示信息
	beforeErrorMessage?: string;
	//resolve前的回调，可用于判断文件类型以及大小
	before?: (file: File) => boolean;
};

/**
 * 读取文件
 * @param options
 * @returns
 */
export function readFile(options?: ReadFileOption) {
	return new Promise<File[]>((resolve, reject) => {
		const { multiple, accept, before } = Object.assign(
			{ multiple: false, accept: "*" },
			options || {}
		);
		let input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", accept);
		multiple && input.setAttribute("multiple", "");
		input.addEventListener("change", fileChange, false);

		function fileChange(this: HTMLInputElement) {
			const { files } = this;
			if (!files) return resolve([]);
			const fileArray: File[] = [];
			for (let i = 0, len = files.length; i < len; i++) {
				const file = files[i];
				if (before && before(file)) return reject(options?.beforeErrorMessage ?? "文件类型错误");
				fileArray.push(file);
			}
			resolve(fileArray);
			input.removeEventListener("change", fileChange);
			input = null as any;
		}

		input.click();
	});
}

interface ArrayToTreeOption {
	parentKey?: string;
	children?: string;
	key?: string;
}
/**
 * 数组转树结构
 * @param arr
 * @param option
 * @returns
 */
export function arrayToTree<T extends Record<string, any>>(arr: T[], option?: ArrayToTreeOption) {
	const { parentKey, children, key } = Object.assign(
		{ parentKey: "parentId", children: "children", key: "id" },
		option
	) as Required<ArrayToTreeOption>;

	const tree: T[] = [];
	const cache: Record<string, any> = Object.create(null);

	for (let i = 0, len = arr.length; i < len; i++) {
		const item = { ...arr[i] };
		const parentId = item[parentKey];
		const currentKey = item[key];
		// 如果缓存中有，则代表该节点有子节点
		if (cache[currentKey]) {
			item[children as keyof T] = cache[currentKey][children];
		} else {
			// 缓存节点，这里每一个缓存的都是父节点
			cache[currentKey] = item;
		}
		// 一级节点直接添加
		if (parentId == null) {
			tree.push(item);
		} else {
			let childrenData = cache[parentId]?.[children];
			// 如果没有从缓存中找到父节点，说明父节点在后面，那么先添加一个只有children的数据
			if (!childrenData) {
				cache[parentId] || (cache[parentId] = {});
				childrenData = Object.assign(cache[parentId], { [children]: [] })[children];
			}
			childrenData.push(item);
		}
	}

	return tree;
}

interface FilterTreeOptions {
	children?: string;
}
/**
 * 过滤树树数据
 * @param tree 数据
 * @param filterFn 取值函数
 * @param option
 * @returns
 */
export function filterTreeData<T = any>(
	tree: T[],
	filterFn: (node: T) => boolean,
	{ children }: FilterTreeOptions = { children: "children" }
): T[] {
	if (!children) children = "children";

	const filteredTree: T[] = [];

	for (const node of tree) {
		if (filterFn(node)) {
			const filteredNode: any = { ...node };
			if ((node as any)[children]) {
				filteredNode[children] = filterTreeData((node as any)[children], filterFn, { children });
			}

			filteredTree.push(filteredNode);
		}
	}

	return filteredTree;
}

/**
 * 遍历属性，触发依赖收集
 * @param value
 * @param seen
 * @returns
 */
export function traverse<T>(value: T, seen = new Set()): T {
	// 是原始值或被读取过则直接返回
	if (!isPlainObject(value) || seen.has(value)) return value;
	// 将数据添加到seen中，避免循环引用导致的问题
	seen.add(value);
	// 暂未考虑其他结构
	for (const key in value) {
		traverse(value[key], seen);
	}
	return value;
}

/**
 * 将任何一个多维数组组成的纬经度转成经纬度,或者将经纬度转成纬经度
 * @param coordinates
 * @returns
 */
export function convertCoordinates(coordinates: any[]): any[] {
	if (!coordinates || !Array.isArray(coordinates)) return coordinates;
	if (coordinates.length == 2) {
		if (Array.isArray(coordinates[1]) && Array.isArray(coordinates[0])) {
			return [convertCoordinates(coordinates[0]), convertCoordinates(coordinates[1])];
		}
		return [convertCoordinates(coordinates[1]), convertCoordinates(coordinates[0])];
	}
	return coordinates.map((coord) => convertCoordinates(coord));
}

/** 解析出响应头的文件名称 */
export function parseFileName(contentDisposition: string) {
	let fileName = "";
	const parts = contentDisposition.split("; ");
	for (const part of parts) {
		if (part.includes("filename*=")) {
			const fileNamePart = part.split("''")[1];
			fileName = decodeURIComponent(fileNamePart);
			break;
		}
	}
	return fileName;
}

/** 随机颜色 */
export function randomColor() {
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += ((Math.random() * 16) | 0).toString(16);
	}
	return color;
}

/**
 * 将文件转为ArrayBuffer
 * @param file
 * @returns
 */
export function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target) {
				resolve(e.target.result as ArrayBuffer);
			}
		};
		reader.onerror = (e) => {
			reject(e);
		};
		reader.readAsArrayBuffer(file);
	});
}

/**
 * 移除表格数据
 * @param dataSource 原始数据
 * @param records 需要移除的记录
 * @param compare 比较函数
 * @returns
 */
export function removeTableDataByRecords<T, R = T>(
	dataSource: T[],
	records: R[],
	compare: (dataSource: T, record: R) => boolean
) {
	const len = dataSource.length;

	const result: T[] = [];

	const list = [...records];
	let rLen = list.length;

	for (let i = 0; i < len; i++) {
		const item = dataSource[i];
		let isRemove = false;
		for (let j = 0; j < rLen; j++) {
			const record = list[j];
			if (compare(item, record)) {
				isRemove = true;
				rLen--;
				list.splice(j, 1);
				break;
			}
		}
		if (!isRemove) {
			result.push(item);
		}
	}
	return result;
}
