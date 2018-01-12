<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'heightlight':totalCount>0}">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="number" v-show='totalCount>0'>{{totalCount}}</div>
        </div>
        <div class="price" :class="{'heightlight':totalPrice>0}">
          ￥{{totalPrice}}元
        </div>
        <div class="desc">
          另需配送费￥{{deliveryPrice}}元
        </div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="{'active':totalPrice >= minPrice}">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
      <!--<transition-group v-for='(ball,index) in balls' :key="index" name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
        <div v-show='ball.show' class="ball" :key="index">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>-->
      <transition name="drop" v-for='ball in balls' :key="ball" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
        <div class="ball" v-show="ball.show">
          <div class="inner inner-hook"></div>
        </div>
      </transition>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show='listShow'>
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for='food in selectFoods' :key="food">
              <span class="name" v-text="food.name"></span>
              <div class="price">
                <span>￥{{food.price * food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food='food'></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name='fade'>
      <div class="list-mask" v-if='listShow' @click="hideList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
    import cartcontrol from '../cartcontrol/cartcontrol';
    import BScroll from 'better-scroll';
    export default {
        props: {
            selectFoods: {
              type: Array,
              default() {
                return [];
              }
            },
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            }
        },
        data() {
          return {
            balls: [
              {
                show: false
              }, {
                show: false
              }, {
                show: false
              }, {
                show: false
              }, {
                show: false
              }
            ],
            dropBalls: [],
            fold: true // 选取列表折叠状态
          };
        },
        methods: {
          toggleList() {
            if (!this.totalCount) {
              return;
            }
            this.fold = !this.fold;
          },
          hideList() {
            this.fold = !this.fold;
          },
          empty() {
            this.selectFoods.forEach((food) => {
              food.count = 0;
            });
          },
          pay() {
            if (this.totalPrice < this.minPrice) {
              return;
            }
            let payPrice = this.totalPrice + this.deliveryPrice;
            alert(`需要支付${payPrice}元钱`);
          },
          drop(el) {
            for (let i = 0; i < this.balls.length; i++) {
              let ball = this.balls[i];
              if (!ball.show) {
                ball.show = true;
                ball.el = el;
                this.dropBalls.push(ball);
                return;
              }
            }
          },
          beforeEnter(el) {
            let count = this.balls.length;
            while (count--) {
              let ball = this.balls[count];
              if (ball.show) {
                let rect = ball.el.getBoundingClientRect();
                let x = rect.left - 32;
                let y = -(window.innerHeight - rect.top - 22);
                el.style.display = '';
                el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                el.style.transform = `translate3d(0,${y}px,0)`;
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                inner.style.transform = `translate3d(${x}px,0,0)`;
              }
            }
          },
          enter(el, done) {
            /* eslint-disable no-unused-vars */
            let rf = el.offsetHeight;// 触发重绘html
            this.$nextTick(() => {
              el.style.webkitTransform = 'translate3d(0,0,0)';
              el.style.transform = 'translate3d(0,0,0)';
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = 'translate3d(0,0,0)';
              inner.style.transform = 'translate3d(0,0,0)';
               // Vue为了知道过渡的完成，必须设置相应的事件监听器。
              el.addEventListener('transitionend', done);
            });
          },
          afterEnter(el) {
            let ball = this.dropBalls.shift(); // 完成一次动画就删除一个dropBalls的小球
            if (ball) {
              ball.show = false;
              el.style.display = 'none';
            }
          }
        },
        computed: {
          listShow() {
            if (!this.totalCount) {
              this.fold = true;
              return false;
            }
            let show = !this.fold;
            if (show) {
              this.$nextTick(() => {
                if (this.scroll) {
                  this.scroll.refresh();
                } else {
                  this.scroll = new BScroll(this.$refs.listContent, {
                    click: true
                  });
                }
              });
            }
            return show;
          },
          totalPrice() {
            let total = 0;
            this.selectFoods.forEach((food) => {
              total += food.price * food.count;
            });
            return total;
          },
          totalCount() {
            let count = 0;
            this.selectFoods.forEach((food) => {
              count += food.count;
            });
            return count;
          },
          payDesc() {
            if (this.totalPrice === 0) {
              return `￥${this.minPrice}元起送`;
            } else if (this.totalPrice < this.minPrice) {
              let money = this.minPrice - this.totalPrice;
              return `还差￥${money}元起送`;
            } else {
              return '去结算';
            }
          }
        },
        components: {
          cartcontrol
        }
    };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
    @import "../../common/stylus/mixin"
    .shopcart
      position:fixed
      left:0
      bottom:0
      z-index:50
      width:100%
      height:48px
      .content
        display:flex
        background:#141d27
        font-size:0
        .content-left
          flex:1
          .logo-wrapper
            display:inline-block
            vertical-align :top
            position:relative
            top:-10px
            margin:0 12px
            padding:6px
            width:56px
            height:56px
            box-sizing:border-box
            border-radius :50%
            background :#141d27
            .logo
              width:100%
              height :100%
              border-radius :50%
              text-align :center
              background:#2b343c
              &.heightlight
                background :rgb(0,160,220)
                .icon-shopping_cart
                  color:#fff
              .icon-shopping_cart
                font-size :24px
                line-height :44px
                color :#80858a
            .number
              position :absolute
              top:0
              right:0
              width:24px
              height:16px
              line-height :16px
              text-align :center
              border-radius:16px
              font-size:9px
              font-weight :700
              color:#fff
              background:rgb(240,20,20)
              box-shadow :0 4px 8px 0 rgba(0,0,0,.4)
          .price
            display:inline-block
            vertical-align :top
            line-height :24px
            margin-top :12px
            box-sizing :border-box
            padding-right :12px
            border-right :1px solid rgba(255,255,255,.1)
            font-size :16px
            font-weight :700
            color :rgba(255,255,255,.4)
            &.heightlight
              color:#fff
          .desc
            display:inline-block
            vertical-align :top
            line-height :24px
            margin :12px 0 0 12px
            color :rgba(255,255,255,.4)
            font-size :10px
        .content-right
          flex:0 0 105px
          width:105px
          .pay
            font-size :12px
            height :48px
            line-height :48px
            text-align :center
            color:rgba(255,255,255,.4)
            background :#2b333b
            &.active
              background:#00b43c
              color:#fff
      .ball-container
        .ball
          position :fixed
          left :32px
          bottom :22px
          z-index :200
          transition :all .4s cubic-bezier(.49,-0.29,0.75,0.41)
          .inner
            width :16px
            height :16px
            border-radius: 16px
            background :rgb(0,160,220)
            transition :all .4s linear
      .shopcart-list
        position :absolute
        bottom :48px
        left :0
        z-index :-1
        width :100%
        transition :all .5s
        &.fold-enter-active, &.fold-leave
          transform :translate3d(0,0,0)
        &.fold-enter, &.fold-leave-active {
          transform:translate3d(0,100%,0)
        }
        .list-header
          height :40px
          line-height :40px
          padding :0 18px
          background :#f3f5f7
          border-bottom :2px solid rgba(7,17,27,.1)
          .title
            float :left
            font-size :14px
            color :rgb(7,17,27)
          .empty
            float :right
            font-size :12px
            color :rgb(0,160,220)
        .list-content
          padding :0 18px
          max-height :217px
          background :#fff
          overflow :hidden
          .food
            position :relative
            list-style :none
            padding :12px 0
            box-sizing :border-box
            border-1px(rgba(7,17,27,.1))
            .name
              line-height :24px
              font-size :14px
              color :rgb(7,17,27)
            .price
              position :absolute
              right :90px
              bottom :12px
              line-height :24px
              font-size :14px
              font-weight :700
              color :rgb(240,20,20)
            .cartcontrol-wrapper
              position :absolute
              bottom :6px
              right :0
      .list-mask
        position :fixed
        top: 0
        left :0
        width :100%
        height :100%
        z-index :-2
        filter: blur(10px)
        transition: all .5s
        background :rgba(7,17,27,.6)
        &.fade-enter-active, &.fade-leave
            opacity: 1
        &.fade-enter, &.fade-leave-active {
            opacity: 0
        }
</style>