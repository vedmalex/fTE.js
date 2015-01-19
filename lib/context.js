function set(data, path, value) {
	if ('object' === typeof data) {
		var parts = path.split('.');
		if (Array.isArray(parts)) {
			var curr = parts.shift();
			if (parts.length > 0) {
				if (!data[curr]) {
					if (isNaN(parts[0]))
						data[curr] = {};
					else data[curr] = [];
				}
				set(data[curr], parts.join('.'), value);
			} else data[path] = value;
		} else {
			data[path] = value;
		}
	}
}

function get(data, path) {
	if ('object' === typeof data) {
		if (data[path] === undefined) {
			var parts = path.split('.');
			if (Array.isArray(parts)) {
				var curr = parts.shift();
				if (parts.length > 0) {
					return get(data[curr], parts.join('.'));
				}
				return data[curr];
			}
		}
		return data[path];
	}
	return data;
}

var reserved = {
	"get": 1
};

function Context(config) {
	var self = this;
	if (Array.isArray(config)) {
		self.length = config.length; //array fake
	}
	self.overwrite(config);
}

Context.prototype.overwrite = function(config) {
	var self = this;
	if (config) {
		var val;
		for (var prop in config) {
			val = config[prop];
			if (!reserved[prop]) {
				if (val !== undefined && val !== null)
					self[prop] = config[prop];
			}
		}
	}
};

Context.prototype.get = function(path) {
	var root = get(this, path);
	if (root instanceof Object) {
		var result = root;
		if (!(result instanceof Context)) {
			set(this, path, result);
		}
		return result;
	} else {
		return root;
	}
};

exports.Context = Context;