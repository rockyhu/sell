<template>
	<div class="cartcontrol">
		<!-- 当food.count大于0时才显示 -->
		<transition name="move">
			<div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
				<span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<div class="icon-add_circle cart-add" @click.stop.prevent="addCart($event)"></div>
	</div>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue';

	export default {
		// 接收父组件传送过来的参数数据
		props: {
			food: {
				type: Object
			}
		},
		// 方法属性
		methods: {
			// 添加到购物车商品数量
			addCart(event) {
				// 解决在PC端点击执行两次点击事件：原生点击事件和better-scroll派发的点击事件
				// better-scroll组件派发的event事件存在_constructed属性,原生浏览器的不存在
				if (!event._constructed) {
					// 阻止掉原生的点击事件
					return;
				}
				if (!this.food.count) {
					// 在Vue中，直接给this.food添加一个新的属性count，Vue无法实时监控count属性的值
					// this.food.count = 1;
					// 所以，需要通过以下方式给vue实例中的this.food对象添加count属性，这样就能够实时监控count属性的值
					Vue.set(this.food, 'count', 1);
				} else {
					this.food.count++;
				}
				// 触发当前实例上的事件。附加参数都会传给监听器回调。
				this.$emit('add', event.target);
			},
			// 删除购物车商品数量
			decreaseCart($event) {
				// 解决在PC端点击执行两次点击事件：原生点击事件和better-scroll派发的点击事件
				// better-scroll组件派发的event事件存在_constructed属性,原生浏览器的不存在
				if (!event._constructed) {
					// 阻止掉原生的点击事件
					return;
				}
				if (this.food.count) {
					this.food.count--;
				}
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	.cartcontrol
		font-size: 0
		.cart-decrease, .cart-add
			display: inline-block
			padding: 6px
			// 定义过渡动画
			// move-enter-active表示进入过程中的过渡动画状态，move-leave-active表示离开过程中的过渡动画状态
			&.move-enter-active, &.move-leave-active
				transition: all 0.4s linear
				.inner
					transition: all 0.4s linear
			// move-enter表示定义进入过渡的开始状态，move-leave-to表示定义离开过渡的结束状态
			&.move-enter, &.move-leave-to
				opacity: 0
				transform: translate3d(24px, 0, 0)
				.inner
					transform: rotate(180deg)
			// move-enter-to表示定义进入过渡的结束状态，move-leave表示定义离开过渡的开始状态
			&.move-enter-to, &.move-leave
				opacity: 1
				transform: translate3d(0, 0, 0)
				.inner
					transform: rotate(0)
			.inner
				display: inline-block
				line-height: 24px
				font-size: 24px
				color: rgb(0, 160, 220)
		.cart-count
			display: inline-block
			vertical-align: top
			width: 12px
			padding-top: 6px
			line-height: 24px
			text-align: center
			font-size: 10px
			color: rgb(147, 153, 159)
		.cart-add
			display: inline-block
			padding: 6px
			line-height: 24px
			font-size: 24px
			color: rgb(0, 160, 220)
</style>