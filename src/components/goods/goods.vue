<template>
	<div class="goods">
		<!-- 左侧菜单栏目 -->
		<!-- 2.x中v-el="menu-wrapper"已经用ref="menuWrapper"进行替代 -->
		<!-- ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素; 如果用在子组件上，引用就指向组件实例 -->
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex === index}"
					@click="selectMenu(index, $event)">
					<span class="text border-1px">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<!-- 右侧菜单栏目 -->
		<div class="foods-wrapper" ref="foodsWrapper">
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="food in item.foods" class="food-item border-1px">
							<div class="icon">
								<img width="57" height="57" :src="food.icon" alt="">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span><span class="old"
																				  v-show="food.oldPrice">￥{{food.oldPrice}}</span>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll';

	// 错误代码常量定义
	const ERR_NO = 0;

	export default {
		// 接收父组件传送过来的参数数据
		props: {
			seller: {
				type: Object
			}
		},
		// 数据
		data() {
			return {
				// 保存商品数据
				goods: [],
				// 保存区间位置数组
				listHeight: [],
				// 实时保存滚动的位置
				scrollY: 0
			};
		},
		// 计算属性
		computed: {
			// 当前所在的滚动位置索引
			currentIndex() {
				for (let i = 0; i < this.listHeight.length; i++) {
					// 区间起点
					let height1 = this.listHeight[i];
					// 区间结束点
					let height2 = this.listHeight[i + 1];
					// 当前实时滚动位置在区间范围内
					if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						return i;
					}
				}
				return 0;
			}
		},
		// 钩子 - created,实例已经创建完成之后被调用
		created() {
			// 创建classMap数据
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

			// 通过vue-resource组件获取数据
			this.$http.get('/api/goods').then((response) => {
				// 请求成功的回调函数
				let goodsRes = response.body;
				// 状态进行判断
				if (goodsRes.errno === ERR_NO) {
					this.goods = goodsRes.data;
					// 将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
					this.$nextTick(function () {
						this._initScroll();
						this._calculateHeight();
					});
				}
			}, (response) => {
				// 请求失败的回调函数
			});
		},
		// 方法属性
		methods: {
			// 初始化Better-scroll滚动组件
			_initScroll() {
				// 通过在DOM元素或组件上定义ref="menuWrapper"来获取DOM原生元素，然后获取原生DOM的方法为this.$refs.menuWrapper
				this.menuScroll = new BScroll(this.$refs.menuWrapper, {
					// 是否派发click事件
					click: true
				});
				this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
					// 1 会截流,只有在滚动结束的时候派发一个 scroll 事件。
					// 2 在手指 move 的时候也会实时派发 scroll 事件，不会截流。
					// 3 除了手指 move 的时候派发scroll事件，在 swipe（手指迅速滑动一小段距离）的情况下，列表会有一个长距离的滚动动画，这个滚动的动画过程中也会实时派发滚动事件
					// 希望能够返回实时滚动的位置
					probeType: 3
				});

				// 监听滚动事件，能够实时获取到滚动的位置
				this.foodsScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y));
				});
			},
			// 计算右侧区间的高度
			_calculateHeight() {
				// 右侧滚动元素列表
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let height = 0;
				this.listHeight.push(height);
				for (let i = 0; i < foodList.length; i++) {
					let item = foodList[i];
					height += item.clientHeight;
					this.listHeight.push(height);
				}
			},
			// 点击左侧栏目右侧联动滚动到相关位置
			selectMenu(index, event) {
				// 解决在PC端点击执行两次点击事件：原生点击事件和better-scroll派发的点击事件
				// better-scroll组件派发的event事件存在_constructed属性,原生浏览器的不存在
				if (!event._constructed) {
					// 阻止掉原生的点击事件
					return;
				}
				// 右侧滚动元素列表
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				// 当前指定左侧栏目对应的右侧区间元素
				let el = foodList[index];
				// 应用better-scroll组件的scrollToElement方法，滚动到某个元素
				this.foodsScroll.scrollToElement(el, 300);
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"

	.goods
		display: flex
		position: absolute
		top: 174px
		bottom: 46px
		width: 100%
		overflow: hidden
		.menu-wrapper
		// 左侧宽度固定80px
			flex: 0 0 80px
			width: 80px
			background-color: #f3f5f7
			.menu-item
				display: table
				width: 56px
				height: 54px
				padding: 0 12px
				line-height: 14px
				&.current
					position: relative
					z-index: 10
					margin-top: -1px
					background-color: #fff
					font-weight: 700
					.text
						border-none()
				.icon
					display: inline-block
					vertical-align: top
					width: 12px
					height: 12px
					margin-right: 2px
					background-size: 12px 12px
					background-repeat: no-repeat
					&.decrease
						bg-image('imgs/decrease_3')
					&.discount
						bg-image('imgs/discount_3')
					&.guarantee
						bg-image('imgs/guarantee_3')
					&.invoice
						bg-image('imgs/invoice_3')
					&.special
						bg-image('imgs/special_3')
				.text
					display: table-cell
					width: 56px
					vertical-align: middle
					font-size: 12px
					border-1px(rgba(7, 17, 27, 0.1))
		.foods-wrapper
		// 右侧的宽度自适应
			flex: 1
			.title
				padding-left: 14px
				height: 26px
				line-height: 26px
				border-left: 2px solid #d9dde1
				font-size: 12px
				color: rgb(147, 153, 159)
				background-color: #f3f5f7
			.food-item
				display: flex
				margin: 18px
				padding-bottom: 18px
				border-1px(rgba(7, 17, 27, 0.1))
				&:last-child
					border-none()
					margin-bottom: 0
				.icon
					flex: 0 0 57px
					width: 57px
					margin-right: 10px
				.content
					flex: 1
					.name
						margin: 2px 0 8px 0
						height: 14px
						line-height: 14px
						font-size: 14px
						color: rgb(7, 17, 27)
					.desc, .extra
						line-height: 10px
						font-size: 10px
						color: rgb(147, 153, 159)
					.desc
						margin-bottom: 8px
						line-height: 12px
					.extra
						.count
							margin-right: 12px
					.price
						font-weight: 700
						line-height: 24px
						.now
							margin-right: 8px
							font-size: 14px
							color: rgb(240, 20, 20)
						.old
							text-decoration: line-through
							font-size: 10px
							color: rgb(147, 153, 159)

</style>