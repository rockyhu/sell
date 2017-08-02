<template>
	<div class="ratingselect">
		<div class="rating-type border-1px">
			<span class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span
					class="count">47</span></span>
			<span class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span
					class="count">40</span></span>
			<span class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span
					class="count">7</span></span>
		</div>
		<div class="switch" :class="{'on':onlyContent}">
			<i class="icon-check_circle"></i>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	// 评价的类型状态定义
	// const POSITIVE = 0;
	// const NEGATIVE = 1;
	const ALL = 2;

	export default {
		// 通过props来接收父组件传送过来的参数数据,props 可以是数组或对象，用于接收来自父组件的数据
		props: {
			// 评论数据
			ratings: {
				type: Array,
				default() {
					return [];
				}
			},
			// 评价的类型
			selectType: {
				type: Number,
				default: ALL
			},
			// 是否只显示有内容的评价
			onlyContent: {
				type: Boolean,
				default: false
			},
			// 描述
			desc: {
				type: Object,
				default() {
					return {
						all: '全部',
						positive: '满意',
						negative: '不满意'
					};
				}
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"

	.ratingselect
		.rating-type
			padding: 18px 0
			margin: 0 18px
			border-1px(rgba(7, 17, 27, 0.1))
			font-size: 0
			.block
				display: inline-block
				padding: 8px 12px
				margin-right: 8px
				line-height: 16px
				border-radius: 1px
				font-size: 12px
				color: rgb(77, 85, 93)
				&.active
					color: #fff
				.count
					margin-left: 2px
					font-size: 8px
				&.positive
					background-color: rgba(0, 160, 220, 0.2)
					&.active
						background-color: rgb(0, 160, 220)
				&.negative
					background-color: rgba(77, 85, 93, 0.2)
					&.active
						background-color: rgb(77, 85, 93)
		.switch
			padding: 12px 18px
			line-height: 24px
			border-bottom: 1px solid rgba(7, 17, 27, 0.1)
			color: rgb(147, 153, 159)
			font-size: 0
			&.on
				.icon-check_circle
					color: #00c850
			.icon-check_circle
				display: inline-block
				vertical-align: top
				margin-right: 4px
				font-size: 24px
			.text
				display: inline-block
				vertical-align: top
				font-size: 12px
</style>