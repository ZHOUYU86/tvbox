// 热播之家 v2 - 修正分页url格式，加上请求头
var rule = {
  title: '热播之家',
  host: 'https://www.rebozj.cc',
  homeUrl: 'https://www.rebozj.cc/',
  url: '/type/fyclass-fypage.html',
  class_name: '电影&电视剧&纪录片&动漫&综艺',
  class_url: '1&2&3&4&5',
  推荐: '.stui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
  一级: '.stui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
  二级: {
    title: 'h1&&Text',
    img: '.stui-content__thumb img&&data-original',
    desc: '.stui-content__detail .data:eq(0)&&Text;.stui-content__detail .data:eq(1)&&Text;;.stui-content__detail .data:eq(6)&&Text;.stui-content__detail .data:eq(5)&&Text',
    content: '.stui-content__detail .detail-content&&Text',
    tabs: '.nav.nav-tabs.dpplay li',
    tab_text: 'a&&Text',
    lists: '#playlist#id .stui-content__playlist li',
    list_text: 'a&&Text',
    list_url: 'a&&href'
  },
  搜索: '.stui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
  搜索页: '/index.php/vod/search/page/1/wd/***.html',
  播放配置: 'player_aaaa',
  播放解析: 'json',
  下载: 'm3u8',
  headers:{
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer':'https://www.rebozj.cc/',
  },
};