// 音乐搜索代理：官方接口 + Meting API备用
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
        
        // 先试官方接口
        if (server === 'netease') result = await searchNetease(keyword);
        else if (server === 'tencent') result = await searchQQ(keyword);
        else if (server === 'kugou') result = await searchKugou(keyword);
        else if (server === 'kuwo') result = await searchKuwo(keyword);
        else if (server === 'qishui') result = await searchQishui(keyword);
        
        // 如果官方接口失败，用Meting API备用
        if (!result || result.length === 0) {
            let metingServer = '';
            if (server === 'netease') metingServer = 'netease';
            else if (server === 'tencent') metingServer = 'tencent';
            else if (server === 'kugou') metingServer = 'kugou';
            else if (server === 'kuwo') metingServer = 'kuwo';
            
            if (metingServer) {
                result = await searchMeting(keyword, metingServer);
            }
        }
        
        return json(result);
    } catch (e) {
        return json({ error: e.message || '搜索失败' }, 500);
    }
}

async function fetchJson(u, headers = {}) {
    const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', ...headers } });
    const t = await r.text();
    try { return JSON.parse(t); } catch { return {}; }
}

// Meting API备用搜索
async function searchMeting(kw, server) {
    const data = await fetchJson(
        'https://api.injahow.cn/meting/?type=search&server=' + server + '&name=' + encodeURIComponent(kw)
    );
    const list = (data && data.songs) || (data && data.list) || [];
    const out = [];
    for (const s of list.slice(0, 15)) {
        out.push({
            name: s.name || s.title || '未知歌曲',
            artist: s.artist || s.author || '未知',
            pic: s.pic || s.cover || '',
            url: s.url || '',
            lrc: s.lrc || ''
        });
    }
    return out;
}

// ---------- 网易云 ----------
async function searchNetease(kw) {
    const data = await fetchJson(
        'https://music.163.com/api/cloudsearch/pc?s=' + encodeURIComponent(kw) + '&type=1&offset=0&total=true&limit=20',
        { 
            Referer: 'https://music.163.com/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    );
    const songs = (data.result && data.result.songs) || [];
    const out = [];
    for (const s of songs.slice(0, 15)) {
        const id = s.id;
        out.push({
            name: s.name,
            artist: (s.artists && s.artists[0] && s.artists[0].name) || '未知',
            pic: s.album && s.album.picUrl ? s.album.picUrl + '?param=200y200' : 'https://p1.music.126.net/6y-UleORITEDbvr0Im1-5w==/109951165804443793.jpg',
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
            pic: 'https://y.qq.com/music/photo_new/T002R300x300M000' + s.albummid + '_1.jpg',
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
            pic: s.Image ? s.Image.replace('{size}', '200') : 'https://static.kugou.com/v5/web/search/img/default_cover.png',
            url: '/api/music-url?server=kugou&hash=' + hash,
            lrc: '/api/music-lyric?server=kugou&hash=' + hash
        });
    }
    return out;
}

// ---------- 酷我 ----------
async function searchKuwo(kw) {
    const data = await fetchJson(
        'https://www.kuwo.cn/api/www/search/searchMusicBykeyWord?key=' + encodeURIComponent(kw) + '&pn=1&rn=20&httpsStatus=1',
        { 
            Referer: 'https://www.kuwo.cn/', 
            'csrf': '0', 
            'Cookie': 'kw_token=0' 
        }
    );
    const list = (data.data && data.data.list) || [];
    const out = [];
    for (const s of list.slice(0, 15)) {
        const rid = s.rid || s.id;
        if (!rid) continue;
        out.push({
            name: s.name || '未知歌曲',
            artist: s.artist || '未知',
            pic: s.albumpic ? s.albumpic.replace('{size}', '200') : 'https://image.kuwo.net/logo/default_cover.png',
            url: '/api/music-url?server=kuwo&rid=' + rid,
            lrc: '/api/music-lyric?server=kuwo&rid=' + rid
        });
    }
    return out;
}

// ---------- 汽水音乐 ----------
async function searchQishui(kw) {
    // 汽水音乐用网易云接口作为备用
    const data = await fetchJson(
        'https://music.163.com/api/cloudsearch/pc?s=' + encodeURIComponent(kw) + '&type=1&offset=0&total=true&limit=20',
        { 
            Referer: 'https://music.163.com/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    );
    const songs = (data.result && data.result.songs) || [];
    const out = [];
    for (const s of songs.slice(0, 15)) {
        const id = s.id;
        out.push({
            name: s.name,
            artist: (s.artists && s.artists[0] && s.artists[0].name) || '未知',
            pic: s.album && s.album.picUrl ? s.album.picUrl + '?param=200y200' : 'https://p1.music.126.net/6y-UleORITEDbvr0Im1-5w==/109951165804443793.jpg',
            url: 'https://music.163.com/song/media/outer/url?id=' + id + '.mp3',
            lrc: '/api/music-lyric?server=netease&id=' + id
        });
    }
    return out;
}
