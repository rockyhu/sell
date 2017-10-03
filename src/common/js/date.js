export function formateDate(date, fmt) {
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDay(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	};
	for (let k in o) {
		// 动态构建正则表达式
		if (new RegExp(`(${k})`).test(fmt)) {
			// 先转换为字符串
			let str = o[k] + '';
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
		}
	}
	return fmt;
};

// 前置补0
function padLeftZero(str) {
	return ('00' + str).substr(str.length);
}
