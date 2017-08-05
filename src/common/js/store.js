/**
 * 将数据存储到localStorage
 * @param id
 * @param key
 * @param value
 */
export function saveToLocal(id, key, value) {
	// 将所有的商家数据都存储到localStorage的__seller__属性字段下
	let seller = window.localStorage.__seller__;
	if (!seller) {
		seller = {};
		seller[id] = {};
	} else {
		// localStorage是采用JSON的方式保存数据的，不能直接存储对象
		seller = JSON.parse(seller);
		if (!seller[id]) {
			seller[id] = {};
		}
	}
	seller[id][key] = value;
	window.localStorage.__seller__ = JSON.stringify(seller);
};

/**
 * 从localStorage中读取数据
 * @param id
 * @param key
 */
export function loadFromLocal(id, key, def) {
	let seller = window.localStorage.__seller__;
	if (!seller) {
		return def;
	}
	seller = JSON.parse(seller)[id];
	if (!seller) {
		return def;
	}
	let ret = seller[key];
	return ret || def;
};
