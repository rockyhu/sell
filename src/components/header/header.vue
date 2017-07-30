<template>
	<div class="header">
		<div class="content-wrapper">
			<div class="avatar">
				<img width="64" height="64" :src="seller.avatar" alt="">
			</div>
			<div class="content">
				<div class="title"><span class="brand"></span><span class="name">{{seller.name}}</span></div>
				<div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
				<!-- div.supports可能不存在，采用v-if处理 -->
				<div v-if="seller.supports" class="supports">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div v-if="seller.supports" class="support-count" @click="showDetail">
				<span class="count">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<!-- 公告 -->
		<div class="bulletin-wrapper" @click="showDetail">
			<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<!-- header背景 -->
		<div class="background">
			<img :src="seller.avatar" width="100%" height="100%" alt="">
		</div>
		<!-- 弹窗浮层 -->
		<div v-show="detailShow" class="detail">
			<div class="detail-wrapper clearfix">
				<div class="detail-main">
					<h1 class="name">{{seller.name}}</h1>
				</div>
			</div>
			<div class="detail-close"><i class="icon-close"></i></div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	export default {
		// 通过props来接收父组件传送过来的参数数据,props 可以是数组或对象，用于接收来自父组件的数据
		props: {
			seller: {
				type: Object
			}
		},
		// 数据
		data() {
			return {
				// 用来控制弹窗是否显示，默认不显示，弹窗的状态会随着变量的变化而变化
				detailShow: false
			};
		},
		// methods 属性将被混入到 Vue 实例中
		methods: {
			// 弹窗显示
			showDetail() {
				this.detailShow = true;
			}
		},
		// 声明周期 - 钩子
		created() {
			// 创建classMap数据
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/mixin.styl'

	.header
		position: relative
		color: #fff
		background-color: rgba(7, 17, 27, 0.5)
		overflow: hidden
		.content-wrapper
			position: relative
			padding: 24px 12px 18px 24px
			font-size: 0
			.avatar
				display: inline-block
				vertical-align: top;
				img
					border-radius: 2px
			.content
				display: inline-block
				vertical-align: top;
				margin-left: 16px
				.title
					margin: 2px 0 8px 0
					.brand
						display: inline-block
						vertical-align: top
						width: 30px
						height: 18px
						bg-image('img/brand')
						background-size: 30px 18px
						background-repeat: no-repeat
					.name
						vertical-align: top
						margin-left: 6px
						font-size: 16px
						line-height: 18px
						font-weight: bold
				.description
					margin-bottom: 10px
					line-height: 12px
					font-size: 12px
				.supports
					.icon
						display: inline-block
						vertical-align: top
						width: 12px
						height: 12px
						margin-right: 4px
						background-size: 12px 12px
						background-repeat: no-repeat
						&.decrease
							bg-image('img/decrease_1')
						&.discount
							bg-image('img/discount_1')
						&.guarantee
							bg-image('img/guarantee_1')
						&.invoice
							bg-image('img/invoice_1')
						&.special
							bg-image('img/special_1')

					.text
						vertical-align: top
						line-height: 12px
						font-size: 10px
			.support-count
				position: absolute
				right: 12px
				bottom: 14px
				padding: 0 8px
				height: 24px
				line-height: 24px
				border-radius: 14px
				background-color: rgba(0, 0, 0, 0.2)
				text-align: center
				.count
					font-size: 10px
					vertical-align: top
				.icon-keyboard_arrow_right
					margin-left: 2px
					line-height: 24px
					font-size: 10px
		.bulletin-wrapper
			position: relative
			height: 28px
			line-height: 28px
			padding: 0 22px 0 12px
			white-space: nowrap
			overflow: hidden
			text-overflow: ellipsis
			background-color: rgba(7, 17, 27, 0.2)
			.bulletin-title
				display: inline-block
				vertical-align: top
				margin-top: 8px
				width: 22px
				height: 12px
				bg-image('img/bulletin')
				background-size: 22px 12px
				background-repeat: no-repeat
			.bulletin-text
				vertical-align: top
				margin: 0 4px
				font-size: 10px
			.icon-keyboard_arrow_right
				position: absolute
				font-size: 10px
				right: 12px
				top: 8px

		.background
			position: absolute
			top: 0
			left: 0
			width: 100%
			height: 100%
			z-index: -1
			filter: blur(10px)
		.detail
			position: fixed
			z-index: 100
			top: 0
			left: 0
			width: 100%
			height: 100%
			overflow: auto
			background-color: rgba(7, 17, 27, 0.8)
			.detail-wrapper
				width: 100%
				min-height: 100%
				.detail-main
					margin-top: 64px
					padding-bottom: 64px
					.name
						line-height: 16px
						text-a lign: center
						font-size: 16px
						font-weight: 700
			.detail-close
				position: relative
				width: 32px
				height: 32px
				margin: -64px auto 0 auto
				clear: both
				font-size: 32px
</style>