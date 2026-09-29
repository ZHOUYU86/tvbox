// 大米星球 v16 - 完善请求头，绕过反爬
muban.mxpro.二级.title = 'div.module-info-heading h1&&Text;.module-info-tag-link:eq(2)&&Text'
muban.mxpro.二级.desc = '.module-info-item:eq(5) .module-info-item-content&&Text;.module-info-tag-link:eq(0)&&Text;.module-info-tag-link:eq(1)&&Text;.module-info-item:eq(3) .module-info-item-content&&Text;.module-info-item:eq(1) .module-info-item-content&&Text'
muban.mxpro.二级.content = 'div.module-info-introduction-content&&Text'

var rule = {
    title:'大米星球',
    模板:'mxpro',
    host:'https://dmxq7.com',
    url:'/vodtype/fyclass-fypage.html',
    detailUrl:'/voddetail/fyid.html',
    searchUrl:'/vodsearch/**-------------.html',
    class_url:'20&21&36&22&23',
    class_name:'电影&电视剧&短剧&动漫&综艺',
    class_parse:'',
    一级:'.module-items .module-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    推荐:'.module-items .module-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
    headers:{
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer':'https://dmxq7.com/',
    },
    play_parse:true,
    lazy:'js:try{let html=fetch(input,fetch_params);let m=html.match(/player_aaaa\\s*=\\s*(\\{.*?\\})/);if(m){let d=JSON.parse(m[1]);let u=d.url;if(d.encrypt=="1"){u=unescape(u)}else if(d.encrypt=="2"){u=unescape(base64Decode(u))}if(/m3u8|mp4|flv/.test(u)){input=u}}}catch(e){}',
}