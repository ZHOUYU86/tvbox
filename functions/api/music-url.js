// 取真实播放地址（落雪音乐API为主，所有平台都用网易云）
export async function onRequest(context) {
    const url = new URL(context.request.url);
    const server = url.searchParams.get('server') || '';
    const songId = url.searchParams.get('id') || '';

    try {
        let playUrl = '';
        
        // 所有平台都用落雪音乐API（网易云）
        if (songId) {
            const lxUrl = `https://music-api.gdstudio.xyz/api.php?types=url&source=netease&id=${songId}&br=320`;
            const lxRes = await fetch(lxUrl);
            const lxData = await lxRes.json();
            if (lxData && lxData.url) {
                playUrl = lxData.url;
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
