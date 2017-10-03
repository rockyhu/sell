<template>
	<div class="star" :class="starType">
		<span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
	</div>
</template>

<script type="text/ecmascript-6">
	const LENGTH = 5;
	const CLS_ON = 'on';
	const CLS_HALF = 'half';
	const CLS_OFF = 'off';

	export default {
		// 接收父组件传送过来的参数数据
		props: {
			// 大小
			size: {
				type: Number
			},
			// 分数
			score: {
				type: Number
			}
		},
		// 计算属性 计算属性将被混入到 Vue 实例中。
		// 所有 getter 和 setter 的 this 上下文自动地绑定为 Vue 实例。
		// 计算属性的结果会被缓存，除非依赖的响应式属性变化才会重新计算。
		computed: {
			// 拼装class样式名
			starType() {
				return 'star-' + this.size;
			},
			// 评星的数据，全星(on)、半星(half)和没有星星(off)的样式数组
			itemClasses() {
				let result = [];
				// 评分处理
				let score = Math.floor(this.score * 2) / 2;
				// 小数部分
				let hasDecimal = score % 1 !== 0;
				// 整数部分
				let integer = Math.floor(score);
				// 全星处理
				for (let i = 0; i < integer; i++) {
					result.push(CLS_ON);
				}
				// 半星处理
				if (hasDecimal) {
					result.push(CLS_HALF);
				}
				// 没星处理
				while (result.length < LENGTH) {
					result.push(CLS_OFF);
				}
				return result;
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"

	.star
		font-size: 0
		.star-item
			display: inline-block
			background-repeat: no-repeat
		&.star-48
			.star-item
				width: 20px
				height: 20px
				margin-right: 22px
				background-size: 20px 20px
				&:last-child
					margin-right: 0
				&.on
					bg-image('imgs/star48_on')
				&.half
					bg-image('imgs/star48_half')
				&.off
					bg-image('imgs/star48_off')
		&.star-36
			.star-item
				width: 15px
				height: 15px
				margin-right: 6px
				background-size: 15px 15px
				&:last-child
					margin-right: 0
				&.on
					bg-image('imgs/star36_on')
				&.half
					bg-image('imgs/star36_half')
				&.off
					bg-image('imgs/star36_off')
		&.star-24
			.star-item
				width: 10px
				height: 10px
				margin-right: 3px
				background-size: 10px 10px
				&:last-child
					margin-right: 0
				&.on
					bg-image('imgs/star24_on')
				&.half
					bg-image('imgs/star24_half')
				&.off
					bg-image('imgs/star24_off')
</style>