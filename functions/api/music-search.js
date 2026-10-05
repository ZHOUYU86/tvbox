// 音乐搜索代理：直连平台官方接口，归一化输出
// 输出格式：[{name, artist, url, lrc, pic}]
export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const keyword = (url.searchParams.get('keyword') || '').trim();
    const server = url.searchParams.get('server') || 'netease';

    const json = (data, status = 200) => new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
    });

    if (!keyword) return json({ error: '缺少关键词' }, 400);

    try {
        let result = [];
        if (server === 'netease') result = await searchNetease(keyword);
        else if (server === 'tencent') result = await searchQQ(keyword);
        else if (server === 'kugou') result = await searchKugou(keyword);
        else if (server === 'kuwo') result = await searchKuwo(keyword);
        else if (server === 'qishui') result = await searchQishui(keyword);
        else return json({ error: '不支持的平台' }, 400);
        return json(result);
    } catch (e) {
        return json({ error: e.message || '搜索失败' }, 500);
    }
}

async function fetchJson(u, headers = {}) {
    const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0', ...headers } });
    const t = await r.text();
    try { return JSON.parse(t); } catch { return {}; }
}

// ---------- 网易云 ----------
async function searchNetease(kw) {
    const data = await fetchJson(
        'https://music.163.com/api/cloudsearch/pc?s=' + encodeURIComponent(kw) + '&type=1&offset=0&limit=20',
        { Referer: 'https://music.163.com/', 'Content-Type': 'application/x-www-form-urlencoded' }
    );
    const songs = (data.result && data.result.songs) || [];
    const out = [];
    for (const s of songs.slice(0, 15)) {
        const id = s.id;
        out.push({
            name: s.name,
            artist: (s.artists && s.artists[0] && s.artists[0].name) || '未知',
            pic: s.album && s.album.picUrl ? s.album.picUrl + '?param=200y200' : '',
            url: 'https://music.163.com/song/media/outer/url?id=' + id + '.mp3',
            lrc: '/api/music-lyric?server=netease&id=' + id
        });
    }
    return out;
}

// ---------- QQ音乐 ----------
async function searchQQ(kw) {
    const data = await fetchJson(
        'https://c.y.qq.com/soso/fcgi-bin/client_search_cp?w=' + encodeURIComponent(kw) + '&format=json&p=1&n=20',
        { Referer: 'https://y.qq.com/' }
    );
    const list = (data.data && data.data.song && data.data.song.list) || [];
    const out = [];
    for (const s of list.slice(0, 15)) {
        const songmid = s.songmid;
        out.push({
            name: s.songname,
            artist: (s.singer && s.singer[0] && s.singer[0].name) || '未知',
            pic: 'https://y.qq.com/music/photo_new/T002R300x300M000' + s.albummid + '.jpg',
            // 播放地址由 /api/music-lyric?server=tencent&songmid=XXX 一并返回
            url: '/api/music-url?server=tencent&songmid=' + songmid,
            lrc: '/api/music-lyric?server=tencent&songmid=' + songmid
        });
    }
    return out;
}

// ---------- 酷狗 ----------
async function searchKugou(kw) {
    const data = await fetchJson(
        'https://songsearch.kugou.com/song_search_v2?keyword=' + encodeURIComponent(kw) + '&page=1&pagesize=30',
        { Referer: 'https://www.kugou.com/' }
    );
    const lists = (data.data && data.data.lists) || [];
    const out = [];
    for (const s of lists.slice(0, 15)) {
        const hash = s.FileHash || s.HQFileHash;
        if (!hash || hash === 'undefined') continue;
        out.push({
            name: s.SongName || s.OriSongName || (s.FileName || '').split(' - ').pop() || '未知',
            artist: s.SingerName || '未知',
            pic: s.Image ? s.Image.replace('{size}', '200') : '',
            url: '/api/music-url?server=kugou&hash=' + hash,
            lrc: '/api/music-lyric?server=kugou&hash=' + hash
        });
    }
    return out;
}

// ---------- 酷我 ----------
async function searchKuwo(kw) {
    const data = await fetchJson(
        'https://search.kuwo.cn/r.s?all=' + encodeURIComponent(kw) + '&ft=music&itemset=web_2013&client=kt&pn=0&rn=20&rformat=json&encoding=utf8',
        { Referer: 'https://www.kuwo.cn/' }
    );
    const list = (data.abslist || []).filter(s => s.MUSICRID);
    const out = [];
    for (const s of list.slice(0, 15)) {
        const rid = s.MUSICRID.replace('MUSIC_', '');
        out.push({
            name: s.NAME || '未知歌曲',
            artist: s.ARTIST || '未知',
            pic: s.ALBUM_PIC ? s.ALBUM_PIC.replace('{size}', '200') : '',
            url: '/api/music-url?server=kuwo&rid=' + rid,
            lrc: '/api/music-lyric?server=kuwo&rid=' + rid
        });
    }
    return out;
}

// ---------- 汽水音乐 ----------
async function searchQishui(kw) {
    // 汽水音乐API（字节跳动旗下）
    const data = await fetchJson(
        'https://api5-normal-lf.fqnovel.com/playing/music/v1/search/?keyword=' + encodeURIComponent(kw) + '&page=1&size=20',
        { Referer: 'https://www.qishui.com/' }
    );
    const list = (data.data && data.data.music_list) || [];
    const out = [];
    for (const s of list.slice(0, 15)) {
        out.push({
            name: s.music_name || '未知歌曲',
            artist: s.author || '未知',
            pic: s.cover || '',
            url: s.music_url || '',
            lrc: s.lyric_url || ''
        });
    }
    return out;
}
