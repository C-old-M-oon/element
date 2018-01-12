<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectType === 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive":class="{'active':selectType === 0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative":class="{'active':selectType === 1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div @click="toggleContent($event)" class="switch" :class="{'on':onlyContent}">
      <i class="icon-check_circle"></i>
      <span class="text">只看有评价内容</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 定义满意与不满意、全部分组常量
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const All = 2;
  export default {
    props: {
      // 所有评价列表数组
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      // 选择查看的评价类型，默认查看全部
      selectType: {
        type: Number,
        default: All
      },
      // 是否勾选只查看有内容评价
      onlyContent: {
        type: Boolean,
        default: false
      },
      // 评价类型
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
    computed: {
      // 通过计算属性，对评价进行筛选，计算出满意的总评价数
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    },
    methods: {
      select(type, event) {
          if (!event._constructed) {
            return;
          }
          this.selectType = type;
          // 子组件的值改变，生成一个新的事件通知父组件该值发生改变，传递数值
          this.$root.eventHub.$emit('ratingType.select', type);
      },
      toggleContent(event) {
          if (!event._constructed) {
            return;
          }
          this.onlyContent = !this.onlyContent;
          this.$root.eventHub.$emit('content.toggle', this.onlyContent);
      }
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import '../../common/stylus/mixin'
  .ratingselect
    .rating-type
      font-size :0
      padding :18px 0
      margin :0 18px
      border-1px(rgba(7,17,27,.1))
      .block
        display :inline-block
        font-size :12px
        padding :8px 12px
        border-radius :2px
        margin-right :8px
        color :rgb(77,85,93)
        &.active
          color :#fff
        .count
          margin-left :2px
          font-size :8px
        &.positive
          background :rgba(0,160,220,.2)
          &.active
            background :rgb(0,160,220)
        &.negative
          background :rgba(77,85,93,.2)
          &.active
            background :rgb(77,85,93)
    .switch
      padding :12px 18px
      line-height :24px
      border-bottom :1px solid rgba(7,17,27,.1)
      color :rgb(147,153,159)
      font-size :0
      .icon-check_circle
        display :inline-block
        vertical-align :top
        font-size :24px
        margin-right :4px
      .text
        display :inline-block
        vertical-align :top
        font-size :12px
      &.on
        .icon-check_circle
          color :#00c850
</style>