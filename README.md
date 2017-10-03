# sell

> Sell WebAPP 高仿饿了么外卖APP

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Vue2.x中需要注意的细节
#### transition动画
在Vue2.x中，动态的实现是采用transition标签进行设置，将transition标签嵌套在想要添加动态的标签外层，设置name属性，用于自动生成 CSS 过渡类名。然后在css中对动画的状态进行设置即可。
![transition](https://cn.vuejs.org/images/transition.png)
``` css
//name="fade"的过渡类名如下：

//进入动画类名
.fade-enter-active {}
.fade-enter{}
.fade-enter-to{}

//退出动画类名
.fade-leave-active{}
.fade-leave{}
.fade-leave-to{}

.fade-enter-active,.fade-leave-active {
  //定义过渡的动画
  transition:all 0.5s linear
}
.fade-enter,.fade-leave-to {
  //定义进入动画的初始状态和退出动画的结束状态，这两个状态是一致的
  opacity:0
}
.fade-enter-to,.fade-leave {
  //定义进入动画的结束状态和退出动画的开始状态，这两个状态是一致的
  opacity:1
}

```

#### 父组件与子组件中数据交互
在Vue2.x中，父组件与子组件之间的通信会很常见。
1、父组件通过在调用子组件时，绑定需要传递的参数子组件传递参数，然后在子组件内部通过props来接收从父组件传送过来的数据，在接收数据时需要定义数据的类型type和默认值,特别需要注意Object和Array数据的默认值设置方法。
```html
<!--父组件-->
<ratingselect :ratings="food.ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc"></ratingselect>
```
``` javascript
//子组件
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
    default: 0
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
},
```
2、子组件通过this.$emit('methodname',params)来触发事件，然后在父组件调用该子组件上添加绑定事件即@methodname="parentMethodName"，然后在父组件的methods属性中去实现parentMethodName方法即可，其中params参数根据实际情况来设置，可以不填。
```javascript
//子组件
methods: {
  // 选择评论类型进行筛选
  select(type, event) {
    if (!event._constructed) {
      return;
    }
    // 子组件定义的基础类型的改变不会影响到父组件
    // 子组件的参数发生改变后，要通知父组件参数改变：
    // 需要通过触发一个事件，然后父组件绑定事件方法，并实现
    this.$emit('ratingTypeSelect', type);
  },
  // 来回切换有内容的评价
  toggleContent(event) {
    if (!event._constructed) {
      return;
    }
    // 子组件定义的基础类型的改变不会影响到父组件
    // 子组件的参数发生改变后，要通知父组件参数改变：
    // 需要通过触发一个事件，然后父组件绑定事件方法，并实现
    this.$emit('contentToggle');
  }
},
```
```html
<!--父组件-->
<ratingselect @ratingTypeSelect="ratingTypeSelect" @contentToggle="contentToggle"></ratingselect>
```

```javascript
//父组件
methods: {
  // 监听子组件的评论类型筛选时间
  ratingTypeSelect(type) {
    this.selectType = type;
    this.$nextTick(() => {
      // 解决评论列表的内容隐藏在footer下面
      this.scroll.refresh();
    });
  },
  // 监听子组件的只看有内容的评价的切换
  contentToggle() {
    this.onlyContent = !this.onlyContent;
    this.$nextTick(() => {
      // 解决评论列表的内容隐藏在footer下面
      this.scroll.refresh();
    });
  }
},
```

#### 获取原生DOM

在Vue2.x中中获取DOM的方式，给DOM节点定义ref属性，并且属性命令必须符合驼峰式命名规则，即ref="picWrapper"，这与Vue1.x中是有区别的。然后在JS中采用this.$refs.picWrapper进行获取DOM即可


### better-scroll插件应用
https://github.com/ustbhuangyi/better-scroll
