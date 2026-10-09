// 音乐播放地址代理 - 多级备用方案
export async function onRequest(context) {
    const url = new URL(context.request.url);
    const songId = url.searchParams.get('id') || '';
    const source = url.searchParams.get('source') || 'netease';

    if (!songId) {
        return new Response(JSON.stringify({ error: 'missing id' }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }

    // 尝试多个取歌API，直到成功
    const apis = [
        // 1. Meting API（与搜索同源，Cloudflare可访问）
        { name: 'meting', url: `https://api.i-meto.com/meting/api?server=${source}&type=url&id=${songId}` },
        // 2. 洛雪音乐API
        { name: 'gdstudio', url: `https://music-api.gdstudio.xyz/api.php?types=url&source=${source}&id=${songId}&br=320` }
    ];

    for (const api of apis) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 12000);
            const r = await fetch(api.url, {
                headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://music.163.com/' },
                signal: controller.signal
            });
            clearTimeout(timer);
            const text = await r.text();
            let data = null;
            try { data = JSON.parse(text); } catch (e) { continue; }

            let playUrl = '';
            if (data && data.url) playUrl = data.url;
            else if (data && data.data && data.data.url) playUrl = data.data.url;

            if (playUrl && playUrl.startsWith('http')) {
                return Response.redirect(playUrl, 302);
            }
        } catch (e) {
            // 继续下一个API
        }
    }

    return new Response('song unavailable', { status: 403 });
}
