// 大米星球 v1 - 用模板'mxpro'（mxtheme主题专用）
muban.mxpro.二级.title = 'div.module-info-heading h1&&Text'
muban.mxpro.二级.desc = 'div.module-info-items&&Text'
muban.mxpro.二级.content = 'div.module-info-introduction-content&&Text'

var rule = {
    title:'大米星球',
    模板:'mxpro',
    host:'https://dmxq7.com',
    url:'/vodtype/fyclass-fypage.html',
    detailUrl:'/voddetail/fyid.html',
    searchUrl:'/vodsearch/**-------------.html',
    class_url:'20&21&22&23',
    class_name:'电影&电视剧&动漫&综艺',
    class_parse:'.navbar-items li;a&&Text;a&&href;/(\\d+).html',
    play_parse:true,
    lazy:'js:try{let html=fetch(input,fetch_params);let m=html.match(/player_aaaa\\s*=\\s*(\\{.*?\\})/);if(m){let d=JSON.parse(m[1]);let u=d.url;if(d.encrypt=="1"){u=unescape(u)}else if(d.encrypt=="2"){u=unescape(base64Decode(u))}if(/m3u8|mp4|flv/.test(u)){input=u}}}catch(e){}',
}