// 555电影 新域名55dy1.top 爬虫
const siteUrl = 'https://55dy1.top';

async function init() {
  return {
    class: await getCategory(),
    site: { name: '555电影(新域名)', subtitle: '55dy1.top', version: '1', directory: ['最新', '电影', '剧集', '动漫', '综艺'], isPoster: 1 }
  };
}

async function getCategory() {
  const html = await getString(siteUrl);
  const $ = load(html);
  const cats = [];
  $('.navbar a, .nav a').each((i, el) => {
    const name = $(el).text().trim();
    const url = $(el).attr('href');
    if (name && url && !name.includes('首页') && name.length < 10) {
      cats.push({ type_id: cats.length + 1, type_name: name });
    }
  });
  return cats.length > 0 ? cats : [{type_id:1,type_name:'电影'},{type_id:2,type_name:'剧集'},{type_id:3,type_name:'动漫'},{type_id:4,type_name:'综艺'}];
}

async function homeVod() {
  const html = await getString(siteUrl);
  return parseList(html);
}

async function category(tid, pg) {
  const url = `${siteUrl}/index.php/vod/type/id/${tid}/page/${pg || 1}.html`;
  const html = await getString(url);
  return parseList(html);
}

function parseList(html) {
  const $ = load(html);
  const list = [];
  $('.module-item, .stui-vodlist__item, .video-item').each((i, el) => {
    const name = $(el).find('a, .title').text().trim();
    const pic = $(el).find('img').attr('data-original') || $(el).find('img').attr('src');
    const id = $(el).find('a').attr('href');
    if (name && id) list.push({vod_id:id, vod_name:name, vod_pic:pic, vod_remarks:$(el).find('.pic-text, .remark').text().trim()});
  });
  return { list, page: 1, pagecount: 1, total: list.length };
}

async function detail(ids) {
  const html = await getString(siteUrl + ids);
  const $ = load(html);
  const playFrom = [];
  $('.playlist, .stui-content__playlist').each((i, el) => {
    const from = $(el).prev('h3, .type').text().trim() || `线路${i+1}`;
    const flags = [];
    $(el).find('a').each((j, a) => {
      const name = $(a).text().trim();
      const url = $(a).attr('href');
      flags.push({flag:name, url:url});
    });
    playFrom.push({flag:from, media:flags});
  });
  return {
    list: [{vod_id:ids, vod_name: $('.detail-content h1, .video-info h1').text().trim(), vod_pic:$('.detail-content img, .video-info img').attr('src'), vod_play_from:playFrom.map(x=>x.flag).join('$$$'), vod_play_url:playFrom.map(x=>x.media.map(m=>`${m.name}$${m.url}`).join('#')).join('$$$')}]
  };
}

async function play(flag, id) {
  const html = await getString(siteUrl + id);
  const $ = load(html);
  const m3u8 = $('video source, iframe').attr('src') || $(':contains(m3u8)').text().match(/https?:\/\/[^"'\s]+\.m3u8/)?.[0];
  return { parse: 0, play: {flag:flag, url:m3u8, header:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', 'Referer':siteUrl}} };
}

async function search(wd, pg) {
  const url = `${siteUrl}/index.php/vod/search/wd/${encodeURIComponent(wd)}.html`;
  const html = await getString(url);
  return parseList(html);
}
