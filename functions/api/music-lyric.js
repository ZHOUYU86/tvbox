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
        if (server === 'netease') lxSource = 'netease';
        else if (server === 'tencent') lxSource = 'tencent';
        else if (server === 'kugou') lxSource = 'kugou';
        else if (server === 'kuwo') lxSource = 'kuwo';
        else if (server === 'qishui') lxSource = 'migu';
        
        // 使用落雪音乐API获取歌词
        if (lxSource && songId) {
            const lxUrl = `https://music-api.gdstudio.xyz/api.php?types=lyric&source=${lxSource}&id=${songId}`;
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
