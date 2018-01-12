<template>
  <div>
    <Vheader :seller = 'seller'></Vheader>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to='/goods'>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/ratings'>评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/seller'>商家</router-link>
      </div>
    </div>
    <!--保留路由状态-->
    <keep-alive>
      <router-view :seller='seller' keep-alive></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {urlParse} from './common/js/util.js';
  import header from './components/header/header.vue';
  import {getAppData} from 'api/appData';
  import {baseUrl} from 'api/config.js';

  const err_ok = 0;
  export default {
    data() {
      return {
        // 通过链接ID去获取商家信息
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    created() {
      // let _that = this;
      // this.$axios.get(baseUrl).then(function(response) {
      //   _that.seller = response.data.seller;
      // })
      // .catch(function(err) {
      //   console.log(err);
      // });
      // getAppData().then((res) => {
      //   console.log(res);
      //   // this.seller = res.data.seller;
      // });
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        response = response.body;
        if (response.errno === err_ok) {
          Vue.set(response.data, 'id', this.seller.id);
          this.seller = response.data;
        }
      });
    },
    components: {
      Vheader: header
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "common/stylus/mixin.styl"

  .tab
    display:flex
    width:100%
    height:40px
    line-height:40px
    /*border-bottom: 1px solid rgba(7, 17, 27, .1)*/
    border-1px(rgba(7, 17, 27, .1))
    .tab-item
      flex: 1
      text-align:center
      & > a
          display: block
          font-size:14px
          color: rgb(77, 85, 93)
          &.active{
            color: rgb(240,20,20)
          }
</style>
