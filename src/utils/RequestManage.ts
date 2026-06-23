import axios from "axios";
import type { AnyFn } from "./util-type";
import type { AsyncReturnType, ArraySplice } from "type-fest";

type SignalFn<T> = (signal: AbortSignal) => Promise<T>;
type MapKey = string | symbol | number;

const DEFAULT_KEY = Symbol("default");

/**
 * 用于请求管理，取消请求
 */
export class RequestManage {
	private cancelMap: Map<MapKey, AbortController["abort"][]>;

	constructor() {
		this.cancelMap = new Map([[DEFAULT_KEY, []]]);
	}

	public proxy<T = any>(callback: SignalFn<T>): Promise<T>;
	public proxy<T = any>(key: string, callback: SignalFn<T>): Promise<T>;
	/**
	 * 代理一个请求
	 */
	public proxy<T = any>(arg: MapKey | SignalFn<T>, callback?: SignalFn<T>): Promise<T> {
		const controller = new AbortController();
		const fn = () => controller.abort();

		let abortList: AbortController["abort"][] | undefined;
		let key: MapKey;

		if (typeof arg === "function") {
			callback = arg;
			key = DEFAULT_KEY;
		} else {
			key = arg;
		}

		abortList = this.cancelMap.get(key);
		if (!abortList) {
			this.cancelMap.set(key, (abortList = []));
		}
		abortList.push(fn);

		return new Promise((resolve, reject) => {
			callback!(controller.signal)
				.then(resolve)
				.catch((error) => {
					axios.isCancel(error) || reject(error);
				})
				.finally(() => {
					abortList!.splice(abortList!.indexOf(fn), 1);
				});
		});
	}

	/**
	 * 取消请求
	 */
	public cancel(key?: MapKey) {
		const abortCbs = this.cancelMap.get(key ?? DEFAULT_KEY);

		if (abortCbs) {
			abortCbs.forEach((fn) => fn());
		}
	}

	/**
	 * 取消全部的请求
	 */
	public cancelAll() {
		this.cancelMap.forEach((abortList) => {
			abortList.forEach((fn) => fn());
		});
	}
}

export function createSimpleRequestManager<F extends (signal: AbortSignal, ...args: any[]) => any>(
	fn: F
) {
	let cancel: () => void;

	let cancelCallback: AnyFn | undefined;

	const onCancel = (callback: AnyFn) => {
		cancelCallback = callback;
	};

	function excute(...args: ArraySplice<Parameters<F>, 0, 1>): Promise<AsyncReturnType<F>> {
		const controller = new AbortController();
		cancel = () => {
			controller.abort();
			cancelCallback?.();
		};

		return new Promise<any>((resolve, reject) => {
			fn(controller.signal, ...args)
				.then(resolve)
				.catch((error: any) => {
					// 如果是取消的请求不去让Promise reject
					axios.isCancel(error) || reject(error);
				});
		});
	}

	return [excute, () => cancel && cancel(), onCancel] as const;
}
