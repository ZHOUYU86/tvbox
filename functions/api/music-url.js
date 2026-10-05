// 取真实播放地址（QQ、酷狗需要二次请求；网易云在 music-search 已给外链）
export async function onRequest(context) {
    const url = new URL(context.request.url);
    const server = url.searchParams.get('server') || '';

    try {
        if (server === 'tencent') {
            const songmid = url.searchParams.get('songmid') || '';
            if (!songmid) return new Response('missing songmid', { status: 400 });
            
            // 方式1：直接用QQ音乐外链接口
            const directUrl = 'https://qqmusic.qq.com/fcgi-bin/u?__=' + songmid;
            
            // 方式2：用musicu接口获取vkey
            const guid = '10000';
            const data = {
                req_0: {
                    module: 'vkey.GetVkeyServer',
                    method: 'CgiGetVkey',
                    param: {
                        guid: guid,
                        songmid: [songmid],
                        songtype: [0],
                        uin: '0',
                        loginflag: 1,
                        platform: '20',
                        format: 'json'
                    }
                }
            };
            const api = 'https://u.y.qq.com/cgi-bin/musicu.fcg?data=' + encodeURIComponent(JSON.stringify(data));
            const r = await fetch(api, { 
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 
                    Referer: 'https://y.qq.com/' 
                } 
            });
            const j = await r.json();
            const info = j && j.req_0 && j.req_0.data && j.req_0.data.midurlinfo && j.req_0.data.midurlinfo[0];
            const sip = j && j.req_0 && j.req_0.data && j.req_0.data.sip;
            let purl = info && info.purl;
            
            // 如果有purl，用拼接后的地址
            if (purl && sip && sip[0]) {
                return Response.redirect(sip[0] + purl, 302);
            }
            
            // 如果没有purl，试试用直接外链
            return Response.redirect(directUrl, 302);
        }

        if (server === 'kugou') {
            const hash = url.searchParams.get('hash') || '';
            if (!hash) return new Response('missing hash', { status: 400 });
            const dfid = '3JfNt47e0e0f2e8e0';
            const mid = '8F1D8D2E3E4F5A6B7C8D9E0F1A2B3C4D';
            const api = 'https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash=' + hash +
                '&mid=' + mid + '&platid=4&dfid=' + dfid + '&appid=1014';
            const r = await fetch(api, { headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.kugou.com/' } });
            const j = await r.json();
            const playUrl = j && j.data && j.data.play_url;
            if (!playUrl) {
                return new Response('该歌曲在酷狗为VIP专享，无法直接播放', { status: 403 });
            }
            return Response.redirect(playUrl, 302);
        }

        if (server === 'kuwo') {
            const rid = url.searchParams.get('rid') || '';
            if (!rid) return new Response('missing rid', { status: 400 });
            const api = 'https://www.kuwo.cn/api/www/url/getMusicUrl?mid=' + rid + '&type=music&br=128kmp3';
            const r = await fetch(api, { headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.kuwo.cn/' } });
            const j = await r.json();
            const playUrl = j && j.data && j.data.url;
            if (!playUrl) {
                return new Response('该歌曲在酷我为VIP专享，无法直接播放', { status: 403 });
            }
            return Response.redirect(playUrl, 302);
        }

        return new Response('unknown server', { status: 400 });
    } catch (e) {
        return new Response('err: ' + e.message, { status: 500 });
    }
}
