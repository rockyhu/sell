<template>
	<div class="shopcartwrapper">
		<div class="shopcart">
			<div class="content" @click="toggleList">
				<div class="content-left">
					<div class="logo-wrapper">
						<div class="logo" :class="{'highlight':totalCount>0}">
							<i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
						</div>
						<div class="num" v-show="totalCount>0">{{totalCount}}</div>
					</div>
					<div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
					<div class="desc">另需配送费{{deliveryPrice}}元</div>
				</div>
				<div class="content-right" @click.stop.prevent="pay">
					<div class="pay" :class="payClass">{{payDesc}}</div>
				</div>
			</div>
			<div class="ball-container">
				<div v-for="ball in balls">
					<transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
						<div class="ball" v-show="ball.show">
							<div class="inner inner-hook"></div>
						</div>
					</transition>
				</div>
			</div>
			<transition name="fold">
				<div class="shopcart-list" v-show="listShow">
					<div class="list-header">
						<h1 class="title">购物车</h1>
						<span class="empty" @click="empty">清空</span>
					</div>
					<div class="list-content" ref="listContent">
						<ul>
							<li class="food" v-for="food in selectFoods">
								<span class="name">{{food.name}}</span>
								<div class="price">
									<span>￥{{food.price * food.count}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<!-- 监听子组件的add事件,子组件的add方法通过this.$emit('add', event.target)触发 -->
									<cartcontrol @add="addFood" :food="food"></cartcontrol>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<!-- 购物车弹窗背景 -->
		<transition name="fade">
			<!-- 点击mask背景遮罩也可以隐藏购物车列表 -->
			<div class="list-mask" @click="hideList" v-show="listShow"></div>
		</transition>
	</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll';
	import cartcontrol from '@/components/cartcontrol/cartcontrol';

	export default {
		// 数据
		data() {
			return {
				// 下落小球状态数组
				balls: [
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					}
				],
				// 下落小球的数组，里面一般只有一个下落小球
				dropBall: [],
				// 购物车列表状态，默认为true，表示折叠的意思
				fold: true
			};
		},
		// 接收父组件传送过来的参数数据
		props: {
			// 配送费
			deliveryPrice: {
				type: Number,
				default: 0
			},
			// 起送费
			minPrice: {
				type: Number,
				default: 0
			},
			// 选择了多少商品
			selectFoods: {
				type: Array,
				// 在Vue里，如果type为Array或者Object，那么默认值为一个函数
				default() {
					return [];
				}
			}
		},
		// 计算属性 计算属性的结果会被缓存，除非依赖的响应式属性变化才会重新计算
		computed: {
			// 计算选择商品的总价格
			totalPrice() {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price * food.count;
				});
				return total;
			},
			// 选择了商品的数量
			totalCount() {
				let count = 0;
				this.selectFoods.forEach((food) => {
					count += food.count;
				});
				return count;
			},
			// 支付的状态描述
			payDesc() {
				if (this.totalPrice === 0) {
					return `￥${this.minPrice}起送`;
				} else if (this.totalPrice < this.minPrice) {
					let diff = this.minPrice - this.totalPrice;
					return `还差￥${diff}起送`;
				} else {
					return '去结算';
				}
			},
			// 支付状态的样式
			payClass() {
				if (this.totalPrice < this.minPrice) {
					return 'not-enough';
				} else {
					return 'enough';
				}
			},
			// 购物车列表的状态，显示还是隐藏
			listShow() {
				if (!this.totalCount) {
					// 购物车没有添加商品的时候，为折叠状态
					this.fold = true;
					return false;
				}
				let show = !this.fold;
				if (show) {
					this.$nextTick(() => {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.listContent, {
								click: true
							});
						} else {
							// 强制 scroll 重新计算，当 better-scroll 中的元素发生变化的时候调用此方法。
							this.scroll.refresh();
						}
					});
				}
				return show;
			}
		},
		// 方法属性
		methods: {
			// 找到一个隐藏的小球，拿出来作为接下来的小球下落的对象
			drop(el) {
				for (let i = 0; i < this.balls.length; i++) {
					let ball = this.balls[i];
					if (!ball.show) {
						// 取出当前的小球作为动画元素
						ball.show = true;
						// 保存当前的动画DOM
						ball.el = el;
						// 将当前下落的小球保存在数组中
						this.dropBall.push(ball);
						return;
					}
				}
			},
			// 小球开始下落钩子
			beforeDrop(el) {
				let count = this.balls.length;
				while (count--) {
					let ball = this.balls[count];
					if (ball.show) {
						let rect = ball.el.getBoundingClientRect();
						let x = rect.left - 32;
						let y = -(window.innerHeight - rect.top - 22);
						el.style.display = '';
						el.style.webkitTransform = `translate3d(0,${y}px,0)`;
						let inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
						inner.style.transform = `translate3d(${x}px,0,0)`;
					}
				}
			},
			// 小球下落过程中钩子
			dropping(el, done) {
				/* eslint-disable no-unused-vars */
				let rf = el.offsetHeight;
				this.$nextTick(() => {
					el.style.webkitTransform = 'translate3d(0,0,0)';
					el.style.transform = 'translate3d(0,0,0)';
					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = 'translate3d(0,0,0)';
					inner.style.transform = 'translate3d(0,0,0)';
					el.addEventListener('transitionend', done);
				});
			},
			// 小球下落完成的钩子
			afterDrop(el) {
				// 获取dropBall的第一个元素
				let ball = this.dropBall.shift();
				if (ball) {
					ball.show = false;
					el.style.display = 'none';
				}
			},
			// 购物车显示和隐藏来回切换
			toggleList() {
				if (!this.totalCount) {
					return;
				}
				this.fold = !this.fold;
			},
			// 父组件实现添加商品到购物车的方法
			addFood(target) {
				this.drop(target);
			},
			// 清空购物车里的商品
			empty() {
				this.selectFoods.forEach((food) => {
					food.count = 0;
				});
			},
			// 点击购物车列表背景遮罩隐藏购物车列表
			hideList() {
				// this.fold改变会导致计算属性computed中的listShow重新计算
				this.fold = true;
			},
			// 点击去结算按钮结算
			pay() {
				if (this.totalPrice < this.minPrice) {
					return;
				}
				window.alert(`支付${this.totalPrice}元`);
			}
		},
		// 注册子组件
		components: {
			cartcontrol
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"

	.shopcart
		position: fixed
		left: 0
		bottom: 0
		z-index: 50
		width: 100%
		height: 48px
		.content
			display: flex
			background-color: #141d27
			color: rgba(255, 255, 255, 0.4)
			.content-left
				flex: 1
				font-size: 0
				.logo-wrapper
					display: inline-block
					position: relative
					vertical-align: top
					top: -10px
					margin: 0 12px
					padding: 6px
					width: 56px
					height: 56px
					box-sizing: border-box
					border-radius: 50%
					background-color: #141d27
					.logo
						width: 100%
						height: 100%
						border-radius: 50%
						text-align: center
						background-color: #2b343c
						&.highlight
							background-color: rgb(0, 160, 220)
						.icon-shopping_cart
							line-height: 44px
							font-size: 24px
							color: #80858a
							&.highlight
								color: #fff
					.num
						position: absolute
						top: 0
						right: 0
						width: 24px
						height: 16px
						line-height: 16px
						text-align: center
						border-radius: 16px
						font-size: 9px
						font-weight: 700
						color: #fff
						background-color: rgb(240, 20, 20)
						box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
				.price
					display: inline-block
					vertical-align: top
					margin-top: 12px
					line-height: 24px
					padding-right: 12px
					box-sizing: border-box
					border-right: 1px solid rgba(255, 255, 255, 0.1)
					font-size: 16px
					font-weight: 700
					&.highlight
						color: #fff
				.desc
					display: inline-block
					vertical-align: top
					margin: 12px 0 0 12px
					line-height: 24px
					font-size: 10px
			.content-right
				flex: 0 0 105px;
				width: 105px
				.pay
					height: 48px
					line-height: 48px
					text-align: center
					font-size: 12px
					font-weight: 700
					&.not-enough
						background-color: #2b333b
					&.enough
						background-color: #00b43c
						color: #fff
		.ball-container
			.ball
				position: fixed
				left: 32px
				bottom: 22px
				z-index: 200
				&.drop-enter-active
					transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
					.inner
						transition: all 0.4s linear
				.inner
					width: 16px
					height: 16px
					border-radius: 50%
					background-color: rgb(0, 160, 220)
		.shopcart-list
			position: absolute
			left: 0
			top: 0
			z-index: -1
			width: 100%
			transform: translate3d(0, -100%, 0)
			&.fold-enter-active, &.fold-leave-active
				transition: all 0.5s
				transform: translate3d(0, -100%, 0)
			&.fold-enter, &.fold-leave-to
				transform: translate3d(0, 0, 0)
			&.fold-enter-to, &.fold-leave
				transform: translate3d(0, -100%, 0)
			.list-header
				height: 40px
				line-height: 40px
				padding: 0 18px
				background-color: #f3f5f7;
				border-bottom: 1px solid rgba(7, 17, 27, 0.1)
				.title
					float: left
					font-size: 14px
					color: rgb(7, 17, 27)
				.empty
					float: right
					font-size: 12px
					color: rgb(0, 160, 220)
			.list-content
				padding: 0 18px
				max-height: 217px
				overflow: hidden
				background-color: #fff
				.food
					position: relative
					padding: 12px 0
					box-sizing: border-box
					border-1px(rgba(7, 17, 27, 0.1))
					.name
						line-height: 24px
						font-size: 14px
						color: rgb(7, 17, 27)
					.price
						position: absolute
						right: 90px
						bottom: 12px
						line-height: 24px
						font-size: 14px
						font-weight: 700
						color: rgb(240, 20, 20)
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 6px

	.list-mask
		position: fixed
		top: 0
		left: 0
		width: 100%
		height: 100%
		z-index: 40
		backdrop-filter: blur(10px)
		background-color: rgba(7, 17, 27, 0.6)
		&.fade-enter-active, &.fade-leave-active
			transition: all 0.5s
			opacity: 1
			background-color: rgba(7, 17, 27, 0.6)
		&.fade-enter, &.fade-leave-to
			opacity: 0
			background-color: rgba(7, 17, 27, 0)
		&.fade-enter-to, &.fade-leave
			opacity: 1
			background-color: rgba(7, 17, 27, 0.6)
</style>