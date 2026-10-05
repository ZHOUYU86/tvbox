// 取真实播放地址（直连平台官方接口，更稳定）
export async function onRequest(context) {
    const url = new URL(context.request.url);
    const server = url.searchParams.get('server') || '';

    try {
        let playUrl = '';

        if (server === 'tencent') {
            // QQ音乐
            const songmid = url.searchParams.get('songmid') || '';
            if (!songmid) return new Response('missing songmid', { status: 400 });
            
            // 获取vkey
            const vkeyRes = await fetch('https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=5381&jsonpCallback=MusicJsonCallback&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&cid=205361747&uin=0&songmid=' + songmid + '&filename=C400' + songmid + '.m4a&guid=00000000000000000000000000000000', {
                headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://y.qq.com/' }
            });
            const vkeyData = await vkeyRes.json();
            const vkey = (vkeyData.data && vkeyData.data.items && vkeyData.data.items[0] && vkeyData.data.items[0].vkey) || '';
            
            if (vkey) {
                playUrl = 'https://dl.stream.qqmusic.qq.com/C400' + songmid + '.m4a?vkey=' + vkey + '&uin=0&fromtag=66';
            }
        } else if (server === 'kugou') {
            // 酷狗
            const hash = url.searchParams.get('hash') || '';
            if (!hash) return new Response('missing hash', { status: 400 });
            
            // 用酷狗的另一个接口获取播放地址
            const res = await fetch('https://m.kugou.com/app/i/getSongInfo.php?cmd=playInfo&hash=' + hash, {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
                    Referer: 'https://m.kugou.com/'
                }
            });
            const data = await res.json();
            playUrl = data.url || (data.info && data.info.url) || '';
        } else if (server === 'kuwo') {
            // 酷我
            const rid = url.searchParams.get('rid') || '';
            if (!rid) return new Response('missing rid', { status: 400 });
            
            const res = await fetch('https://www.kuwo.cn/api/www/url/getMusicUrl?mid=' + rid + '&type=music&httpsStatus=1', {
                headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.kuwo.cn/' }
            });
            const data = await res.json();
            playUrl = (data.data && data.data.url) || '';
        } else if (server === 'netease') {
            // 网易云
            const id = url.searchParams.get('id') || '';
            if (!id) return new Response('missing id', { status: 400 });
            playUrl = 'https://music.163.com/song/media/outer/url?id=' + id + '.mp3';
        }

        if (playUrl && playUrl.startsWith('http')) {
            return Response.redirect(playUrl, 302);
        }

        return new Response('该歌曲暂无法播放', { status: 403 });
    } catch (e) {
        return new Response('err: ' + e.message, { status: 500 });
    }
}
