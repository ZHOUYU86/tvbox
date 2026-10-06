// 取真实播放地址（落雪音乐API）
export async function onRequest(context) {
    const url = new URL(context.request.url);
    const songId = url.searchParams.get('id') || '';

    try {
        let playUrl = '';
        
        // 用落雪音乐API获取真实播放地址
        if (songId) {
            const apiUrl = `https://music-api.gdstudio.xyz/api.php?types=url&source=netease&id=${songId}&br=320`;
            const r = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const data = await r.json();
            
            if (data && data.url) {
                playUrl = data.url;
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
