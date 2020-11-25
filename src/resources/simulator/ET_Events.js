class ET_Events {
	events = {};

	on(name, listener) {
		if (!this.events[name]) {
			this.events[name] = [];
		}

		this.events[name].push(listener);
	}

	off(name, oldListener) {
		if (!this.events[name]) {
			throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`);
		}

		this.events[name] = this.events[name].filter((listener) => listener !== oldListener);
	}

	fire(name, data) {
		this._fire(name, data, false);
	}
	fireNow(name, data) {
		this._fire(name, data, true);
	}

	_fire(name, data, isNow) {
		if (!this.events[name]) {
			throw new Error(`Can't fire event [${name}], it doesn't exits.`);
		}

		this.events[name].forEach((callback) => {
			if (isNow) {
				callback(data);
			} else {
				Promise.resolve().then(() => {
					callback(data);
				});
			}
		});
	}
}
export const etEvents = new ET_Events();
