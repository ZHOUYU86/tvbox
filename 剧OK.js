// 剧OK v5 - 分类用JSON解析器，详情/播放用lazy代码，无模板
var rule = {
  title: '剧OK',
  host: 'https://juok9.top',
  homeUrl: 'https://juok9.top/',
  detailUrl: 'https://juok9.top/detail/fyclass/fyid',
  class_name: '电影&电视剧&综艺&动漫',
  class_url: '1&2&3&4',
  url: 'https://juok9.top/api/filter?catId=fyclass&sort=ranklatest&page=fypage&size=24',
  // 分类用JSON解析器：父元素;标题;封面;状态;链接
  一级: 'json:$.movies;json:$.title;json:$.cover;json:$.upinfo;json:$.id',
  // 详情用lazy代码
  二级: 'js:try{var mc=input.match(/\\/detail\\/(\\d+)\\/([a-zA-Z0-9]+)/);var cat=mc?mc[1]:"2";var id=mc?mc[2]:input;var api="https://juok9.top/api/detail?cat="+cat+"&id="+id+"&site=qiyi";var h=request(api);var j=JSON.parse(h);var d=j.data||{};var img=d.cdncover||"";if(img&&img.indexOf("//")===0)img="https:"+img;var pls=d.playlinks||{};var eps=d.allepidetail||{};var pf=[];var pu=[];for(var s in pls){var sn=s==="qiyi"?"爱奇艺":s==="youku"?"优酷":s==="qq"?"腾讯":s;var el=eps[s]||[];var ll=[];if(el.length>0){for(var i=0;i<el.length;i++){ll.push("第"+(i+1)+"集$"+(el[i].url||pls[s]));}}else{ll.push("播放$"+pls[s]);}pf.push(sn);pu.push(ll.join("#"));}VOD={vod_id:id,vod_name:d.title||"无标题",vod_pic:img,vod_remarks:"更新:"+(d.upinfo||"")+"/"+(d.total||""),vod_year:d.pubdate||"",vod_area:(d.area||[]).join("/"),vod_actor:(d.actor||[]).join("/"),vod_director:(d.director||[]).join("/"),vod_content:d.description||d.comment||"暂无简介",vod_play_from:pf.join("$$$"),vod_play_url:pu.join("$$$")};}catch(e){VOD={vod_name:"详情错误:"+e.message,vod_play_from:"错误$$$",vod_play_url:"错$"+e.message};}',
  // 播放用lazy代码
  play_parse: true,
  lazy: 'js:try{var h=request("https://juok9.top/api/player/resolve",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({playUrl:input,source:"qiyi",vodId:"",episode:1})});var j=JSON.parse(h);if(j.success&&j.url){input=j.url;}else{input="";}}catch(e){input="";}',
  搜索: '',
  搜索页: '',
  headers:{
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer':'https://juok9.top/',
  },
};
