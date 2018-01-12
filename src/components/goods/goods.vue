<template>
  <div class="goods">
    <div class="menu-wrapper" ref='menuWrapper'>
      <ul>
        <li v-for='(item,index) in goods' class='menu-item' :key='item' :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span v-show='item.type>0' class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref='foodsWrapper'>
      <ul>
        <li v-for='item in goods' class='foods-list food-list-hook' :key='item'>
          <h1 class="title" v-text='item.name'></h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for='food in item.foods' :key='food' class='food-item border-1px'>
              <div class="icon">
                <img :src='food.icon' width='57px'>
              </div>
              <div class="content">
                <h2 class="name" v-text='food.name'></h2>
                <p class="desc" v-text='food.description'></p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show='food.oldPrice'>￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food='food'></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref='shopcart' :selectFoods="selectFoods" :deliveryPrice='seller.deliveryPrice' :minPrice='seller.minPrice'></shopcart>
    <food :selectFood='selectedFood' ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from '../shopcart/shopcart';
  import cartcontrol from '../cartcontrol/cartcontrol';
  import food from '../food/food';
  import {getAppData} from 'api/appData';
  import {baseUrl} from '../../api/config.js';
  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        // 各个分类区域高度高度数组
        listHeight: [],
        // 记录商品列表区域滚动距离
        scrollY: 0,
        // 查看商品详情时选中的商品对象
        selectedFood: {}
      };
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created() {
      let _that = this;
      // 接收子组件派发的事件，并定义该事件（2.0）
      this.$root.eventHub.$on('cart.add', (target) => {
        this._drop(target);
      });
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
      // this.$axios.get(baseUrl).then(function(response) {
      //   _that.goods = response.data.goods;
      //   _that.$nextTick(() => {
      //     // 初始化商品页滚动
      //     _that._initScroll();
      //     // 初始化计算各个商品分类高度
      //     _that._calculateHeight();
      //   });
      // })
      // .catch(function(err) {
      //   console.log(err);
      // });
      // getAppData().then((res) => {
      //   console.log(res);
      //   this.goods = res.data.goods;
      //   this.$nextTick(() => {
      //     // 初始化商品页滚动
      //     this._initScroll();
      //     // 初始化计算各个商品分类高度
      //     this._calculateHeight();
      //   });
      // });
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => {
            // 初始化商品页滚动
            this._initScroll();
            // 初始化计算各个商品分类高度
            this._calculateHeight();
          });
        }
      });
    },
    methods: {
      _drop(target) {
        // 异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      },
      selectMenu(index, event) {
        // BS插件对自定义的事件派发有以下一个属性
        if (!event._constructed) {
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
        this.currentIndex = index;
      },
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          // 通过设置probeType，告诉浏览器当前实时位置
          probeType: 3,
          click: true
        });
        // 监听商品区域滚动事件，实时改变当前Y轴滚动距离
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0;i < foodList.length; i++) {
          let item = foodList[i];
            // 获取各个类型占据的高度
            height += item.clientHeight;
            this.listHeight.push(height);
          }
        },
      // 选中商品，查看详情
      selectFood(food, event) {
        // BS插件对自定义的事件派发有以下一个属性
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      }
    },
    components: {
      shopcart, cartcontrol, food
    }
    // 接收子组件派发的事件，并定义该事件（1.0）
    // events: {
    //     'cart.add'(target) {
    //         this._drop(target);
    //     }
    // }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
    @import "../../common/stylus/mixin";
    .goods
        position: absolute
        top: 174px
        width: 100%
        bottom: 46px
        display: flex
        overflow: hidden
        .menu-wrapper
            flex: 0 0 80px
            width: 80px
            background: #f3f5f7
            .menu-item
                display: table
                height: 54px
                width: 56px
                line-height: 14px
                padding: 0 12px
                &.current
                    background: #fff
                    margin-top: -1px
                    z-index: 10
                    font-weight: 700
                    .text
                        border-none()
                .icon
                    display: inline-block
                    vertical-align: middle
                    width: 12px
                    height: 12px
                    margin-right: 2px
                    background-size: 12px 12px
                    background-repeat: no-repeat
                    &.decrease
                        bg-img('decrease_3')
                    &.discount
                        bg-img('discount_3')
                    &.guarantee
                        bg-img('guarantee_3')
                    &.invoice
                        bg-img('invoice_3')
                    &.special
                        bg-img('special_3')
                .text
                    font-size: 12px
                    display: table-cell
                    width: 56px
                    vertical-align: middle
                    border-1px(rgba(7,17,27,.1))
        .foods-wrapper
            .foods-list
                list-style: none
            flex: 1
            .title
                padding-left: 14px
                height: 26px
                line-height: 26px
                border-left: 2px solid #d9dde1
                font-size: 12px
                color: rgb(147,153,159)
                background: #f3f5f7
            .food-item
                display: flex
                margin: 18px
                padding-bottom: 18px
                border-1px(rgba(7,17,27,.1))
                &:last-child
                    border-none()
                    margin-bottom: 0px
                .icon
                    flex: 0 0 57px
                    margin-right: 10px
                .content
                    flex: 1
                    .name
                        margin: 2px 0 8px 0
                        line-height: 14px
                        font-size: 14px
                        color: rgb(7,17,27)
                    .desc,.extra
                        font-size: 10px
                        line-height: 10px
                        color: rgb(147,153,159)
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
                            color: rgb(240,20,20)
                        .old
                            text-decoration: line-through
                            font-size: 10px
                            color: rgb(147,153,159)
                    .cartcontrol-wrapper
                        position :absolute
                        right :0
                        bottom : 12px

</style>
