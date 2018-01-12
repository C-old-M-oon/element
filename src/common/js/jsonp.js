/*
* @Author: leeZ
* @Date:   2018-01-10 16:01:08
* @Last Modified by:   leeZ
* @Last Modified time: 2018-01-11 14:53:21
*/

import originJSONP from 'jsonp';

export default function jsonp(url, data, option) {
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);

    return new Promise((resolve, reject) => {
        // resolve成功回调
        originJSONP(url, option, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
        // reject失败回调
    });
}

function param(data) {
    let url = '';
    for (var k in data) {
        let value = data[k] !== undefined ? data[k] : '';
        url += `&${k}=${encodeURIComponent(value)}`;
    }
    return url ? url.substring(1) : '';
}