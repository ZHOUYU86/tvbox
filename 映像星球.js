// 映像星球 v1 - 基础版本
var rule = {
  title: '映像星球',
  host: 'https://www.yxxq35.cc',
  homeUrl: 'https://www.yxxq35.cc/',
  url: '/top/fyclass--------fypage---.html',
  class_name: '电影&电视剧&综艺&动漫&短剧',
  class_url: '1&2&3&4&5',
  推荐: '.module-poster-item;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
  一级: '.module-poster-item;a&&title;img&&data-original;.module-item-note&&Text;a&&href',
  二级: {
    title: 'h1&&Text',
    img: '.module-item-pic img&&data-original',
    desc: '.module-info-item:eq(0)&&Text;.module-info-item:eq(1)&&Text;;.module-info-item:eq(3)&&Text;.module-info-item:eq(2)&&Text',
    content: '.module-info-content&&Text',
    tabs: '.module-tab-items-box .module-tab-item',
    tab_text: 'span&&Text',
    lists: '.module-list.his-tab-list.active .module-play-list-link',
    list_text: 'span&&Text',
    list_url: 'a&&href'
  },
  搜索: '.module-item;img&&alt;img&&data-original;.module-item-note&&Text;a&&href',
  searchUrl: '/search/**-------------.html',
  播放配置: 'player_aaaa',
  播放解析: 'json',
  下载: 'm3u8',
  headers:{
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer':'https://www.yxxq35.cc/',
  },
};
