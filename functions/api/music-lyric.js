// 取歌词，统一返回 LRC 纯文本（落雪音乐API，所有平台都用网易云）
export async function onRequest(context) {
    const url = new URL(context.request.url);
    const server = url.searchParams.get('server') || '';
    const songId = url.searchParams.get('id') || '';

    const text = (body, status = 200) => new Response(body, {
        status,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
    });

    try {
        let lrcText = '';
        
        // 所有平台都用落雪音乐API（网易云）
        if (songId) {
            const lxUrl = `https://music-api.gdstudio.xyz/api.php?types=lyric&source=netease&id=${songId}`;
            const lxRes = await fetch(lxUrl);
            const lxData = await lxRes.json();
            if (lxData && lxData.lyric) {
                lrcText = lxData.lyric;
            }
        }

        return text(lrcText || '[00:00.00] 暂无歌词');
    } catch (e) {
        return text('[00:00.00] 歌词加载失败', 500);
    }
}
