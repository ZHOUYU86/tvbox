addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  let path = url.pathname
  
  // 默认返回index.html
  if (path === '/' || path === '') {
    path = '/index.html'
  }
  
  // 获取静态文件
  const response = await fetch(`https://raw.githubusercontent.com/ZHOUYU86/tvbox-sources/main${path}`)
  
  if (response.ok) {
    return new Response(response.body, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  }
  
  // 如果找不到文件，返回404
  return new Response('Not Found', { status: 404 })
}
