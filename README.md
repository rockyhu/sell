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
#### trasition动画
``` css

```

#### 父组件与子组件中数据交互
``` javascript

```

#### 获取原生DOM

在Vue2.x中中获取DOM的方式，给DOM节点定义ref属性，并且属性命令必须符合驼峰式命名规则，即ref="picWrapper"，这与Vue1.x中是有区别的。然后在JS中采用this.$refs.picWrapper进行获取DOM即可


### better-scroll插件应用
``` javascript

```
