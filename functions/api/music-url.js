// 取真实播放地址（使用公开API代理）
export async function onRequest(context) {
    const url = new URL(context.request.url);
    const server = url.searchParams.get('server') || '';

    try {
        let id = '';
        let apiUrl = '';

        if (server === 'tencent') {
            id = url.searchParams.get('songmid') || '';
            if (!id) return new Response('missing songmid', { status: 400 });
            apiUrl = 'https://api.injahow.cn/meting/?type=url&id=' + id + '&server=tencent';
        } else if (server === 'kugou') {
            id = url.searchParams.get('hash') || '';
            if (!id) return new Response('missing hash', { status: 400 });
            apiUrl = 'https://api.injahow.cn/meting/?type=url&id=' + id + '&server=kugou';
        } else if (server === 'kuwo') {
            id = url.searchParams.get('rid') || '';
            if (!id) return new Response('missing rid', { status: 400 });
            apiUrl = 'https://api.injahow.cn/meting/?type=url&id=' + id + '&server=kuwo';
        } else {
            return new Response('unknown server', { status: 400 });
        }

        const r = await fetch(apiUrl);
        const playUrl = await r.text();
        
        if (playUrl && playUrl.startsWith('http')) {
            return Response.redirect(playUrl, 302);
        }
        
        return new Response('该歌曲暂无法播放', { status: 403 });
    } catch (e) {
        return new Response('err: ' + e.message, { status: 500 });
    }
}
