// 取真实播放地址（Meting API为主，官方接口备用）
export async function onRequest(context) {
    const url = new URL(context.request.url);
    const server = url.searchParams.get('server') || '';

    try {
        let playUrl = '';
        let metingServer = '';
        let metingId = '';

        // 映射到Meting API的server
        if (server === 'tencent') {
            metingServer = 'tencent';
            metingId = url.searchParams.get('songmid') || '';
        } else if (server === 'kugou') {
            metingServer = 'kugou';
            metingId = url.searchParams.get('hash') || '';
        } else if (server === 'kuwo') {
            metingServer = 'kuwo';
            metingId = url.searchParams.get('rid') || '';
        } else if (server === 'netease') {
            metingServer = 'netease';
            metingId = url.searchParams.get('id') || '';
        } else if (server === 'qishui') {
            metingServer = 'netease';
            metingId = url.searchParams.get('id') || '';
        }

        // 先用Meting API
        if (metingServer && metingId) {
            const metingRes = await fetch('https://api.injahow.cn/meting/?type=url&id=' + metingId + '&server=' + metingServer);
            const metingUrl = await metingRes.text();
            if (metingUrl && metingUrl.startsWith('http')) {
                playUrl = metingUrl;
            }
        }

        // 如果Meting API失败，用官方接口
        if (!playUrl || !playUrl.startsWith('http')) {
            if (server === 'tencent') {
                const songmid = url.searchParams.get('songmid') || '';
                if (songmid) {
                    const vkeyRes = await fetch('https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=5381&jsonpCallback=MusicJsonCallback&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&cid=205361747&uin=0&songmid=' + songmid + '&filename=C400' + songmid + '.m4a&guid=00000000000000000000000000000000', {
                        headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://y.qq.com/' }
                    });
                    const vkeyData = await vkeyRes.json();
                    const vkey = (vkeyData.data && vkeyData.data.items && vkeyData.data.items[0] && vkeyData.data.items[0].vkey) || '';
                    if (vkey) {
                        playUrl = 'https://dl.stream.qqmusic.qq.com/C400' + songmid + '.m4a?vkey=' + vkey + '&uin=0&fromtag=66';
                    }
                }
            } else if (server === 'kugou') {
                const hash = url.searchParams.get('hash') || '';
                if (hash) {
                    const res = await fetch('https://m.kugou.com/app/i/getSongInfo.php?cmd=playInfo&hash=' + hash, {
                        headers: { 
                            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15',
                            Referer: 'https://m.kugou.com/'
                        }
                    });
                    const data = await res.json();
                    playUrl = data.url || (data.info && data.info.url) || '';
                }
            } else if (server === 'kuwo') {
                const rid = url.searchParams.get('rid') || '';
                if (rid) {
                    const res = await fetch('https://www.kuwo.cn/api/www/url/getMusicUrl?mid=' + rid + '&type=music&httpsStatus=1', {
                        headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.kuwo.cn/' }
                    });
                    const data = await res.json();
                    playUrl = (data.data && data.data.url) || '';
                }
            } else if (server === 'netease') {
                const id = url.searchParams.get('id') || '';
                if (id) {
                    playUrl = 'https://music.163.com/song/media/outer/url?id=' + id + '.mp3';
                }
            }
        }

        if (playUrl && playUrl.startsWith('http')) {
            return Response.redirect(playUrl, 302);
        }

        return new Response('该歌曲暂无法播放', { status: 403 });
    } catch (e) {
        return new Response('err: ' + e.message, { status: 500 });
    }
}
