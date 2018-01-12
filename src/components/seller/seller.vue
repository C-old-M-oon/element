<template>
    <div class="seller" ref="seller">
        <div class="seller-wraper">
            <!--头部信息-->
            <div class="head-wrapper">
                <div class="title">
                    <h1 class="shop-name">{{seller.name}}</h1>
                    <star :size='36' :score='seller.score'></star>
                    <span class="ratingCount">({{seller.ratingCount}})</span>
                    <span class="sellCount">月售{{seller.sellCount}}单</span>
                    <div class="storage" @click="toggleFavorite">
                        <i class="icon icon-favorite" :class="{'favorite':favorite}"></i>
                        <span class="tip">{{fevorateText}}</span>
                    </div>
                </div>
                <ul class="delivery">
                    <li class="delivery-item">
                        <p class="title">起送价</p>
                        <p class="detail">
                            <span class="number">{{seller.minPrice}}</span>
                            元
                        </p>
                    </li>
                    <li class="delivery-item">
                        <p class="title">商家配送</p>
                        <p class="detail">
                            <span class="number">{{seller.deliveryPrice}}</span>
                            元
                        </p>
                    </li>
                    <li class="delivery-item">
                        <p class="title">平均配送</p>
                        <p class="detail">
                            <span class="number">{{seller.deliveryTime}}</span>
                            分钟
                        </p>
                    </li>
                </ul>
            </div>
            <split></split>
            <!--公告与活动-->
            <div class="activity-wrapper">
                <div class="notice-wrapper">
                    <h1 class="title">公告与活动</h1>
                    <div class="notice">{{seller.bulletin}}</div>
                </div>
                <ul class="activity">
                    <li class="activity-item" v-for="item in seller.supports" :key="item">
                        <span class='icon' :class='classMap[item.type]'></span>
                        <span class="text">{{item.description}}</span>
                    </li>
                </ul>
            </div>
            <split></split>
            <!--商家实景-->
            <div class="shopPic-wrapper">
                <h1 class="title">商家实景</h1>
                <div class="pic-wrapper" ref="picWrapper">
                    <ul class="pic-list" ref="picList">
                        <li class="pic-item" v-for="item in seller.pics" :key="item">
                            <img class="pic" :src="item" width="120" height="90">
                        </li>
                    </ul>
                </div>
            </div>
            <split></split>
            <div class="shopInfo-wrapper">
                <h1 class="title">商家信息</h1>
                <ul class="info-list">
                    <li v-for="item in seller.infos" :key="item" class="info-item">
                        {{item}}
                    </li>
                </ul>
            </div>
        </div>
        <!--<shopcart ref='shopcart' :selectFoods="selectFoods" :deliveryPrice='seller.deliveryPrice' :minPrice='seller.minPrice'></shopcart>-->
    </div>
</template>

<script type="text/ecmascript-6">
    const ERR_OK = 0;
    import split from '../split/split';
    import BScroll from 'better-scroll';
    import star from '../star/star';
    import shopcart from '../shopcart/shopcart';
    import {baseUrl} from '../../api/config.js';
    import {getAppData} from 'api/appData';
    export default {
        props: {
            seller: {
                type: Object
            }
        },
        data() {
            return {
                goods: [],
                favorite: false
            };
        },
        computed: {
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
            },
            fevorateText() {
                return this.favorite ? '已收藏' : '收藏';
            }
        },
        // 这是dom渲染完成后的操作
        created() {
            this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
            // let _that = this;
            // this.$axios.get(baseUrl).then(function(response) {
            //     _that.goods = response.data.goods;
            //   })
            //   .catch(function(err) {
            //     console.log(err);
            // });
            // getAppData().then((res) => {
            //     console.log(res);
            //     this.goods = res.data.goods;
            // });
            this.$http.get('/api/goods').then((response) => {
                response = response.body;
                if (response.errno === ERR_OK) {
                    this.goods = response.data;
                }
            });
        },
        // 这是数据加载完成之后的操作
        mounted() {
            this._initScroll();
            this._initPics();
        },
        watch: {
            'seller'() {
                this._initScroll();
                this._initPics();
            }
        },
        methods: {
            toggleFavorite() {
                if (!event._constructed) {
                    return;
                }
                this.favorite = !this.favorite;
            },
            _initScroll() {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.seller, {
                        click: true
                    });
                } else {
                    this.scroll.refresh();
                }
            },
            _initPics() {
                if (!this.picScroll) {
                    if (this.seller.pics) {
                        let picWidth = 120;
                        let margin = 6;
                        let width = (picWidth + margin) * this.seller.pics.length - margin;
                        this.$refs.picList.style.width = width + 'px';
                        this.picScroll = new BScroll(this.$refs.picWrapper, {
                            scrollX: true,
                            eventPassthrough: 'vertical'// 水平滚动时防止垂直滚动
                        });
                    }
                } else {
                    this.picScroll.refresh();
                }
            }
        },
        components: {
            split, star, shopcart
        }
    };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
    @import "../../common/stylus/mixin"
    .seller
        position :absolute;
        top :174px
        bottom :0
        left :0
        width :100%
        overflow :hidden
        .seller-wraper
            background :#fff
            .head-wrapper
                padding :18px
                .title
                    position :relative
                    padding-bottom :18px
                    border-bottom :1px solid rgba(7,17,27,.1)
                    .shop-name
                        margin-bottom :8px
                        font-size :14px
                        line-height :14px
                        color :rgb(7,17,27)
                    .star
                        display :inline
                        margin-right :8px
                    .ratingCount,.sellCount
                        font-size :10px
                        color :rgb(77,85,93)
                        line-height :18px
                    .ratingCount
                        margin :0 12px 0 8px
                    .storage
                        position :absolute
                        top :0
                        width :50px
                        right :10px
                        text-align :center
                        .icon
                            font-size :24px
                            line-height :24px
                            color: #d4d6d9
                            &.favorite
                                color :rgb(240,20,20)
                        .tip
                            display :block
                            margin-top :8px
                            font-size :10px
                            line-height :10px
                            color :rgb(77,85,93)
                .delivery
                    width :100%
                    list-style :none
                    margin :18px 0 0
                    display :flex
                    .delivery-item
                        flex :1
                        border-right :1px solid rgba(7,17,27,.1)
                        text-align :center
                        &:last-child
                            border-right :none
                        .title
                            font-size :10px
                            line-height :10px
                            color :rgb(147,153,159)
                            margin-bottom :8px
                            border-bottom :none
                            padding-bottom :0
                        .detail
                            font-size :10px
                            .number
                                font-size :24px
                                line-height :24px
                                font-weight :200
                                color :rgb(7,17,27)
            .activity-wrapper
                width :100%
                padding :18px 12px 0 12px
                box-sizing :border-box
                .notice-wrapper
                    width :100%
                    padding-bottom :16px
                    border-bottom :1px solid rgba(7,17,27,.1)
                    .title
                        font-size :18px
                        line-height :18px
                        color :rgb(7,17,27)
                        margin-bottom :8px
                        font-weight :500
                    .notice
                        width :100%
                        box-sizing: border-box;
                        padding-left: 12px;
                        font-size :12px
                        line-height :24px
                        font-weight :200
                        color :rgb(240,20,20)
                .activity
                    width :100%
                    list-style :none
                    .activity-item
                        width:100%
                        padding :16px 0
                        padding-left :12px
                        box-sizing :border-box
                        border-bottom :1px solid rgba(7,17,27,.1)
                        .icon
                            display: inline-block
                            width: 16px
                            height: 16px
                            vertical-align: top
                            margin-right: 6px
                            background-size: 16px 16px
                            background-repeat: no-repeat
                            &.decrease
                                bg-img('decrease_4')
                            &.discount
                                bg-img('discount_4')
                            &.guarantee
                                bg-img('guarantee_4')
                            &.invoice
                                bg-img('invoice_4')
                            &.special
                                bg-img('special_4')
                        .text
                            font-size :12px
                            line-height :16px
                            font-weight :200
                            color :rgb(7,17,27)
            .shopPic-wrapper
                width:100%
                padding :18px 0 18px 18px
                box-sizing :border-box
                .title
                    font-size :18px
                    line-height :18px
                    color :rgb(7,17,27)
                    font-weight :500
                    margin-bottom :12px
                .pic-wrapper
                    width :100%
                    overflow :hidden
                    white-space :nowrap
                    .pic-list
                        font-size :0
                        .pic-item
                            display :inline-block
                            margin-right :6px
                            width :120px
                            height :90px
                            &:last-child
                                margin-right :0
            .shopInfo-wrapper
                width:100%
                padding :18px 12px 42px 18px
                box-sizing :border-box
                .title
                    font-size :18px
                    line-height :18px
                    color :rgb(7,17,27)
                    font-weight :500
                    margin-bottom :12px
                .info-list
                    width :100%
                    box-sizing :border-box
                    padding-left :12px
                    list-style :none
                    .info-item
                        padding :16px 0
                        border-top :1px solid rgba(7,17,27,.1)
                        font-size :12px
                        line-height :16px
                        font-weight :200
                        color :rgb(7,17,27)
</style>
