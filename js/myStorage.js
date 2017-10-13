;(function () {

	window.ms = {
		set: set,
		get: get,
	};

	function set (key, val) {
		localStorage.setItem(key, JSON.stringify(val));
	}

	function get (key) {
		var json = localStorage.getItem(key);  // 取出为 json 格式的字符串
		if (json) {
			return JSON.parse(json);
		}
	}
})();

// ms.set("name", "whh");
// var name = ms.get("name");
// console.log(name);