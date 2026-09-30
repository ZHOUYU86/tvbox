// 剧OK v17 - 用searchUrl方式实现搜索
var rule = {
  title: '剧OK',
  host: 'https://juok9.top',
  homeUrl: 'https://juok9.top/',
  detailUrl: 'https://juok9.top/detail/fyclass/fyid',
  searchUrl: 'https://juok9.top/api/search?q=**',
  class_name: '电影&电视剧&综艺&动漫',
  class_url: '1&2&3&4',
  url: 'https://juok9.top/api/filter?catId=fyclass&sort=ranklatest&page=fypage&size=24',
  一级: 'js:try{var h=request(MY_URL,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36","Referer":"https://juok9.top/"}});var j=JSON.parse(h);var list=j.movies||[];VODS=[];for(var i=0;i<list.length;i++){var m=list[i];var img=m.cover||m.cdncover||"";if(img&&img.indexOf("//")===0)img="https:"+img;VODS.push({vod_id:MY_CATE+"/"+m.id,vod_name:m.title,vod_pic:img,vod_remarks:m.upinfo||""});}}catch(e){VODS=[{vod_id:"err",vod_name:"分类错误:"+e.message,vod_pic:"",vod_remarks:"错误"}];}',
  二级: 'js:try{var mc=input.match(/(\\d+)\\/(.+)/);var cat=mc?mc[1]:"2";var id=mc?mc[2]:input;var api="https://juok9.top/api/detail?cat="+cat+"&id="+encodeURIComponent(id);var h=request(api,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36","Referer":"https://juok9.top/"}});var hs=String(h);if(hs.indexOf("<html")>=0||hs.indexOf("<!DOCTYPE")>=0){VOD={vod_name:"返回HTML,id="+id,vod_play_from:"错误$$$",vod_play_url:"错$"};}else{var j=JSON.parse(hs);var d=j.data||j||{};var img=d.cdncover||d.cover||"";if(img&&img.indexOf("//")===0)img="https:"+img;var pls=d.playlinks||{};var eps=d.allepidetail||{};var pf=[];var pu=[];var keys=Object.keys(eps);var nameMap={qiyi:"爱奇艺",youku:"优酷",qq:"腾讯",mgtv:"芒果",letv:"乐视",sohu:"搜狐",pptv:"PPTV",bilibili:"B站",xigua:"西瓜"};for(var ki=0;ki<keys.length;ki++){var s=keys[ki];var sn=nameMap[s]||s;var el=eps[s];if(!el||!el.length){if(pls[s]){pf.push(sn);pu.push("播放$"+pls[s]);}continue;}var ll=[];for(var i=0;i<el.length;i++){var ep=el[i];if(!ep){continue;}var epUrl=ep.url||pls[s]||"";var epNum=ep.playlink_num||(i+1);ll.push("第"+epNum+"集$"+epUrl);}if(ll.length>0){pf.push(sn);pu.push(ll.join("#"));}}if(pf.length===0){var firstKey=Object.keys(pls)[0];if(firstKey){pf.push(nameMap[firstKey]||firstKey);pu.push("播放$"+(pls[firstKey]||""));}else{pf.push("暂无线路");pu.push("暂无$");}}VOD={vod_id:id,vod_name:d.title||"无标题",vod_pic:img,vod_remarks:"更新:"+(d.upinfo||"")+"/"+(d.total||""),vod_year:d.pubdate||"",vod_area:(d.area||[]).join("/"),vod_actor:(d.actor||[]).join("/"),vod_director:(d.director||[]).join("/"),vod_content:d.description||d.comment||"暂无简介",vod_play_from:pf.join("$$$"),vod_play_url:pu.join("$$$")};}}catch(e){VOD={vod_name:"详情错误:"+e.message,vod_play_from:"错误$$$",vod_play_url:"错$"+e.message};}',
  play_parse: true,
  lazy: 'js:try{var src="qiyi";if(input.indexOf("youku")>=0)src="youku";else if(input.indexOf("qq.com")>=0||input.indexOf("v.qq")>=0)src="qq";var h=request("https://juok9.top/api/player/resolve",{method:"POST",headers:{"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36","Referer":"https://juok9.top/"},body:JSON.stringify({playUrl:input,source:src,vodId:"",episode:1})});var hs=String(h);var j=JSON.parse(hs);if(j.success&&j.url){input=j.url;}else{input="ERR:"+hs.substring(0,100);}}catch(e){input="ERR:"+e.message;}',
  搜索: 'json:results;titleTxt;cover;cat_name;cat_id+"/"+id;description',
  搜索页: '',
  headers:{
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer':'https://juok9.top/',
  },
};
