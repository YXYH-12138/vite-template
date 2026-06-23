import mitt, { type EventType } from "mitt";
import type { Emitter, Handler } from "mitt";

export class Evented<T extends Record<EventType, any>> {
	protected emitter?: Emitter<T>;

	protected getMitt() {
		if (!this.emitter) this.emitter = mitt<T>();
		return this.emitter;
	}

	public on<Key extends keyof T | "*">(type: Key, handler: Handler<T[Key]>) {
		const emitter = this.getMitt();
		emitter.on(type, handler);
	}

	public only<Key extends keyof T | "*">(type: Key, handler: Handler<T[Key]>) {
		const emitter = this.getMitt();
		if (emitter.all.has(type)) return;
		emitter.on(type, handler);
	}

	public off<Key extends keyof T | "*">(type?: Key, handler?: Handler<T[Key]>) {
		if (!this.emitter) return;
		if (type) {
			this.emitter.off(type, handler);
		} else {
			this.emitter.all.clear();
		}
	}

	public emit<Key extends keyof T>(type: Key, event?: T[Key]) {
		this.emitter && this.emitter.emit(type, event as T[Key]);
	}

	public dispatch<Key extends keyof T>(type: Key, data?: T[Key]) {
		this.emit(type, data);
		return this;
	}

	public dispatchSync<Key extends keyof T>(type: Key, data?: T[Key]) {
		setTimeout(() => {
			this.emit(type, data);
		});
		return this;
	}
}
