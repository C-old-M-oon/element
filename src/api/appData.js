/*
* @Author: leeZ
* @Date:   2018-01-10 16:04:00
* @Last Modified by:   leeZ
* @Last Modified time: 2018-01-11 12:23:49
*/

import jsonp from '../common/js/jsonp';
import {commonParams, options} from './config';

export function getAppData() {
  const url = 'http://1.eleme.applinzi.com/data.json';

  const data = Object.assign({}, commonParams, {
    channel: 'appData'
  });

  return jsonp(url, data, options);
};

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp',
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    jsonpCallback: '',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  });

  return jsonp(url, data, options);
}