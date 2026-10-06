// 取真实播放地址（网易云音乐官方接口）
export async function onRequest(context) {
    const url = new URL(context.request.url);
    const songId = url.searchParams.get('id') || '';

    try {
        let playUrl = '';
        
        // 用网易云音乐官方播放地址
        if (songId) {
            playUrl = `https://music.163.com/song/media/outer/url?id=${songId}.mp3`;
        }

        if (playUrl && playUrl.startsWith('http')) {
            return Response.redirect(playUrl, 302);
        }

        return new Response('该歌曲暂无法播放', { status: 403 });
    } catch (e) {
        return new Response('err: ' + e.message, { status: 500 });
    }
}
