// 取歌词，统一返回 LRC 纯文本（落雪音乐API）
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
        
        // 落雪音乐API的平台映射
        let lxSource = '';
        if (server === 'netease') lxSource = 'wy';
        else if (server === 'tencent') lxSource = 'tx';
        else if (server === 'kugou') lxSource = 'kg';
        else if (server === 'kuwo') lxSource = 'kw';
        else if (server === 'qishui') lxSource = 'mg';
        
        // 使用落雪音乐API获取歌词
        if (lxSource && songId) {
            const lxUrl = `https://music-api.gdstudio.xyz/api.php?types=lyric&source=${lxSource}&id=${songId}`;
            const lxRes = await fetch(lxUrl);
            const lxData = await lxRes.json();
            if (lxData && lxData.body && lxData.body.lrc) {
                lrcText = lxData.body.lrc;
            }
        }

        return text(lrcText || '[00:00.00] 暂无歌词');
    } catch (e) {
        return text('[00:00.00] 歌词加载失败', 500);
    }
}
