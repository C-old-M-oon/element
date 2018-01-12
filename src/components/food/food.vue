<template>
  <transition name="move">
    <div v-show='showFlag' class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="selectFood.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{selectFood.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{selectFood.sellCount}}份</span>
            <span class="rating">好评率{{selectFood.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{selectFood.price}}</span>
            <span class="old" v-show='selectFood.oldPrice'>￥{{selectFood.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper" v-show="selectFood.count>0">
            <cartcontrol :food='selectFood'></cartcontrol>
          </div>
          <div class="buy" @click.stop.prevent="addFirst" v-show="!selectFood.count || selectFood.count === 0">
            加入购物车
          </div>
        </div>
        <split v-show="selectFood.info"></split>
        <div class="info" v-show='selectFood.info'>
          <div class="title">商品信息</div>
          <p class="text">{{selectFood.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :selectType='selectType' :onlyContent='onlyContent' :desc='desc' :ratings='selectFood.ratings'></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="selectFood.ratings && selectFood.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" class="rating-item border-1px" v-for='rating in selectFood.ratings' :key="rating">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avater">
                </div>
                <div class="time">
                  {{rating.rateTime | formatDate}}
                </div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1,}">
                    
                  </span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!selectFood.ratings || selectFood.ratings.length<1">
              暂无评价  
            <div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
    // 定义满意与不满意、全部分组常量
    const POSITIVE = 0;
    const NEGATIVE = 1;
    const All = 2;
    import Vue from 'vue';
    import {formatDate} from '../../common/js/date';
    import BScroll from 'better-scroll';
    import cartcontrol from '../cartcontrol/cartcontrol';
    import split from '../split/split';
    import ratingselect from '../ratingselect/ratingselect';
    export default {
      props: {
        selectFood: {
          type: Object
        }
      },
      data() {
        return {
          showFlag: false,
          selectType: All,
          onlyContent: false,
          desc: {
            all: '全部',
            positive: '推荐',
            negative: '吐槽'
          }
        };
      },
      // 子组件改变值，通过方法将改变的数据传递给父组件
      created() {
        // 接收子组件派发的事件，并定义该事件（2.0）
        this.$root.eventHub.$on('ratingType.select', (type) => {
           this.selectType = type;
           this.$nextTick(() => {
              this.scroll.refresh();
           });
        });
        this.$root.eventHub.$on('content.toggle', (onlyContent) => {
           this.onlyContent = onlyContent;
           this.$nextTick(() => {
              this.scroll.refresh();
           });
        });
      },
      methods: {
        show() {
          this.showFlag = true;
          this.selectType = All;
          this.onlyContent = false;
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.food, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        },
        hide() {
          this.showFlag = false;
        },
        addFirst(event) {
          if (!event._constructed) {
            return;
          }
          this.$root.eventHub.$emit('cart.add', event.target);
          Vue.set(this.selectFood, 'count', 1);
        },
        // 通过判断该条评价的类型和是否有评价内容来确认该条评价是否显示
        needShow(type, text) {
          if (this.onlyContent && !text) {
            return false;
          }
          if (this.selectType === All) {
            return true;
          } else {
            return type === this.selectType;
          }
        }
      },
      //  时间转换
      filters: {
        formatDate(time) {
          let data = new Date(time);
          return formatDate(data, 'yyyy-MM-dd HH:mm');
        }
      },
      components: {
        cartcontrol, split, ratingselect
      }
    };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
    @import '../../common/stylus/mixin'
    .food
      position :fixed
      left :0
      top :0
      bottom :48px
      z-index :30
      width :100%
      background :#fff
      transition :all .4s
      &.move-enter-active,&.move-leave
        transform :translate3d(0,0,0)
      &.move-enter,&.move-leave-active
        transform :translate3d(100%,0,0)
      .image-header
        position :relative
        width :100%
        height :0
        // 当设置padding值为100%时,padding值与width保持一致
        padding-top :100%
        img
          position :absolute
          top :0
          left :0
          width:100%
          height :100%
        .back
          position :absolute
          top :10px
          left :0
          .icon-arrow_lift
            display :block
            padding :10px
            font-size :20px
            color :#fff
      .content
        position :relative
        padding :18px
        .title
          font-weight :700
          line-height :14px
          margin-bottom :8px
          font-size :14px
          color :rgb(7,17,27)
        .detail
          margin-bottom :18px
          height :10px
          line-height :10px
          font-size :0
          .sell-count,.rating
            font-size :10px
            color :rgb(147,153,159)
          .sell-count
            margin-right :12px
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
          right :12px
          bottom :12px
        .buy
          position :absolute
          right :18px
          bottom :18px
          height :24px
          line-height :24px
          padding :0 12px
          box-sizing :border-box
          font-size :10px
          border-radius :12px
          color :#fff
          background :rgb(0,160,220)
      .info
        padding :18px
        .title
          line-height :14px
          font-size :14px
          margin-bottom :6px
          color :rgb(7,17,27)
        .text
          padding :0 8px
          line-height :24px
          font-size :12px
          color:rgb(77,85,93)
      .rating
        padding-top:18px
        margin-left :18px
        font-size :14px
        color :rgb(7,17,27)
        .rating-wrapper
          padding :0 18px
          .rating-item
            position :relative
            padding :16px 0
            list-style :none
            border-1px(rgba(7,17,27,.1))
            .user
              position :absolute
              right :0
              top :16px
              font-size :0
              line-height :12px
              .name
                display :inline-block
                vertical-align :top
                margin-right :6px
                font-size :10px
                color :rgb(147,153,159)
              .avatar
                border-radius :50%
            .time
              margin-bottom :6px
              font-size :10px
              line-height :12px
              color :rgb(147,153,159)
            .text
              line-height :16px
              font-size :12px
              color :rgb(7,17,27)
              font-weight :700
              .icon-thumb_up,.icon-thumb_down
                line-height :16px
                margin-right :4px
                font-size :12px
              .icon-thumb_up
                color :rgb(0,160,220)
              .icon-thumb_down
                color :rgb(147,153,159)
          .no-rating
            padding :16px 0
            font-size :12px
            text-align :center
            color :rgb(147,153,159)
</style>