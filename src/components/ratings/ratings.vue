<template>
	<div class="ratings" ref="ratings">
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<div class="title">综合评分</div>
					<div class="rank">高于周边商家{{seller.rankRate}}%</div>
				</div>
				<div class="overview-right">
					<div class="scroe-wrapper">
						<span class="title">服务态度</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<div class="scroe-wrapper">
						<span class="title">商品评分</span>
						<star :size="36" :score="seller.foodScore"></star>
						<span class="score">{{seller.foodScore}}</span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<split></split>
			<ratingselect @ratingTypeSelect="ratingTypeSelect" @contentToggle="contentToggle" :ratings="ratings"
						  :select-type="selectType" :only-content="onlyContent" :desc="desc"></ratingselect>
			<div class="rating-wrapper">
				<ul>
					<li v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings" class="rating-item">
						<div class="avatar"><img width="28" height="28" :src="rating.avatar" alt=""></div>
						<div class="content">
							<div class="username">{{rating.username}}</div>
							<div class="star-wrapper">
								<star :size="24" :score="rating.score"></star>
								<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
							</div>
							<p class="text">{{rating.text}}</p>
							<div class="recommend" v-show="rating.recommend && rating.recommend.length">
								<span class="icon-thumb_up"></span>
								<span class="item" v-for="item in rating.recommend">{{item}}</span>
							</div>
							<div class="time">{{rating.rateTime | formateDate}}</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import star from '@/components/star/star';
	import split from '@/components/split/split';
	import ratingselect from '@/components/ratingselect/ratingselect';
	// 采用export方式导出的需要{}，采用export default方式导出的不需要{}
	import {formateDate} from '@/common/js/date';
	import BScroll from 'better-scroll';

	// 评价的类型状态定义
	// const POSITIVE = 0;
	// const NEGATIVE = 1;
	const ALL = 2;

	// 错误代码常量定义
	const ERR_NO = 0;

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
				ratings: [],
				selectType: ALL,
				onlyContent: true,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			};
		},
		// 钩子 - created,实例已经创建完成之后被调用
		created() {
			// 通过vue-resource组件获取数据
			this.$http.get('/api/ratings').then((response) => {
				// 请求成功的回调函数
				let ratingsRes = response.body;
				// 状态进行判断
				if (ratingsRes.errno === ERR_NO) {
					// 赋值到ratings属性上
					this.ratings = ratingsRes.data;
					// 初始化better-scroll
					this.$nextTick(() => {
						this.scroll = new BScroll(this.$refs.ratings, {
							click: true
						});
					});
				}
			}, (response) => {
				// 请求失败的回调函数
			});
		},
		// 方法属性
		methods: {
			// 点击筛选数据 && 只看有内容的评价
			needShow(type, text) {
				if (this.onlyContent && !text) {
					return false;
				}
				if (this.selectType === ALL) {
					return true;
				} else {
					return type === this.selectType;
				}
			},
			// 监听子组件的评论类型筛选时间
			ratingTypeSelect(type) {
				this.selectType = type;
				this.$nextTick(() => {
					// 解决评论列表的内容隐藏在footer下面
					this.scroll.refresh();
				});
			},
			// 监听子组件的只看有内容的评价的切换
			contentToggle(onlyContent) {
				this.onlyContent = !onlyContent;
				this.$nextTick(() => {
					// 解决评论列表的内容隐藏在footer下面
					this.scroll.refresh();
				});
			}
		},
		// 注册组件
		components: {
			star,
			split,
			ratingselect
		},
		// 过滤属性
		filters: {
			// 格式化日期
			formateDate(time) {
				let date = new Date(time);
				return formateDate(date, 'yyyy-MM-dd hh:mm');
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"

	.ratings
		position: absolute
		top: 174px
		bottom: 0
		left: 0
		width: 100%
		overflow: hidden
		.overview
			display: flex
			padding: 18px 0
			.overview-left
				flex: 0 0 137px
				padding: 6px 0
				width: 137px
				border-right: 1px solid rgba(7, 17, 27, 0.1)
				text-align: center
				@media only screen and (max-width: 320px)
					flex: 0 0 120px
					width: 120px
				.score
					margin-bottom: 6px
					line-height: 28px
					font-size: 24px
					color: rgb(255, 153, 0)
				.title
					margin-bottom: 8px
					line-height: 12px
					font-size: 12px
					color: rgb(7, 17, 27)
				.rank
					line-height: 10px
					font-size: 10px
					color: rgb(147, 153, 159)
			.overview-right
				flex: 1
				padding: 6px 0 6px 24px
				@media only screen and (max-width: 320px)
					padding-left: 6px
				.scroe-wrapper
					margin-bottom: 8px
					font-size: 0
					.title
						display: inline-block
						line-height: 18px
						vertical-align: top
						font-size: 12px
						color: rgb(7, 17, 27)
					.star
						display: inline-block
						margin: 0 12px
						vertical-align: top
					.score
						display: inline-block
						line-height: 18px
						vertical-align: top
						font-size: 12px
						color: rgb(255, 153, 0)

				.delivery-wrapper
					font-size: 0
					.title
						line-height: 18px
						font-size: 12px
						color: rgb(7, 17, 27)
					.delivery
						margin-left: 12px
						font-size: 12px
						color: rgb(147, 153, 159)
		.rating-wrapper
			padding: 0 18px
			.rating-item
				display: flex
				padding: 18px 0
				border-1px(rgba(7, 17, 27, 0.1))
				.avatar
					flex: 0 0 28px
					width: 28px
					margin-right: 12px
					img
						border-radius: 50%
				.content
					position: relative
					flex: 1
					.username
						margin-bottom: 4px
						line-height: 12px
						font-size: 10px
						color: rgb(7, 17, 27)
					.star-wrapper
						margin-bottom: 6px
						font-size: 0
						.star
							display: inline-block
							margin-right: 6px
							vertical-align: top
						.delivery
							display: inline-block
							vertical-align: top
							line-height: 12px
							font-size: 10px
							font-weight: 200
							color: rgb(147, 153, 159)
					.text
						margin-bottom: 8px
						line-height: 18px
						color: rgb(7, 17, 27)
						font-size: 12px
					.recommend
						line-height: 16px
						font-size: 0
						.icon-thumb_up, .item
							display: inline-block
							margin: 0 8px 4px 0
							font-size: 9px
						.icon-thumb_up
							color: rgb(0, 160, 220)
						.item
							padding: 0 6px
							border: 1px solid rgba(7, 17, 27, 0.1)
							border-radius: 1px
							color: rgb(147, 153, 159)
							background-color: #fff
					.time
						position: absolute
						top: 0
						right: 0
						line-height: 12px
						font-size: 10px
						color: rgb(147, 153, 159)
</style>