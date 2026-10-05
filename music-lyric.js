// 取歌词，统一返回 LRC 纯文本
export async function onRequest(context) {
    const url = new URL(context.request.url);
    const server = url.searchParams.get('server') || '';

    const text = (body, status = 200) => new Response(body, {
        status,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
    });

    try {
        let lrcText = '';

        if (server === 'netease') {
            const id = url.searchParams.get('id') || '';
            const r = await fetch('https://music.163.com/api/song/lyric?id=' + id + '&lv=1&kv=1&tv=-1', {
                headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://music.163.com/' }
            });
            const d = await r.json();
            lrcText = (d && d.lrc && d.lrc.lyric) || '';
        } else if (server === 'tencent') {
            const songmid = url.searchParams.get('songmid') || '';
            const r = await fetch('https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid=' + songmid + '&format=json&nobase64=1', {
                headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://y.qq.com/' }
            });
            const d = await r.json();
            lrcText = (d && d.lyric) || '';
        } else if (server === 'kugou') {
            const hash = url.searchParams.get('hash') || '';
            const api = 'https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash=' + hash +
                '&mid=00000000000000000000000000000000&platid=4&dfid=0&appid=1014';
            const r = await fetch(api, { headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.kugou.com/' } });
            const d = await r.json();
            lrcText = (d && d.data && d.data.lyrics) || '';
        } else if (server === 'kuwo') {
            const rid = url.searchParams.get('rid') || '';
            const r = await fetch('https://www.kuwo.cn/api/www/lyric/getLyric?musicId=' + rid, {
                headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.kuwo.cn/' }
            });
            const d = await r.json();
            lrcText = (d && d.data && d.data.lrclist) || (d && d.data && d.data.lrc) || '';
        } else {
            return text('unknown server', 400);
        }

        return text(lrcText || '[00:00.00] 暂无歌词');
    } catch (e) {
        return text('[00:00.00] 歌词加载失败', 500);
    }
}
