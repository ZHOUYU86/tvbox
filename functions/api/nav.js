// 导航数据同步接口 - GET读取线上导航数据，POST保存导航数据到Cloudflare KV
// 变量名: NAV_DATA (绑定到KV命名空间 tvbox_nav_data)
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

export async function onRequest(context) {
    const request = context.request;
    const kv = context.env.NAV_DATA;
    const url = new URL(request.url);
    const key = url.searchParams.get('key') || 'navData';

    // 处理预检请求
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: CORS_HEADERS });
    }

    try {
        // GET - 读取导航数据
        if (request.method === 'GET') {
            const data = await kv.get(key);
            if (data === null) {
                return new Response(JSON.stringify({ empty: true, data: null }), { headers: CORS_HEADERS });
            }
            return new Response(data, { headers: CORS_HEADERS });
        }

        // POST - 保存导航数据
        if (request.method === 'POST') {
            const body = await request.text();
            if (!body || body.trim() === '') {
                return new Response(JSON.stringify({ error: 'empty body' }), { status: 400, headers: CORS_HEADERS });
            }
            // 校验是合法JSON
            try {
                JSON.parse(body);
            } catch (e) {
                return new Response(JSON.stringify({ error: 'invalid json' }), { status: 400, headers: CORS_HEADERS });
            }
            await kv.put(key, body);
            return new Response(JSON.stringify({ ok: true, size: body.length }), { headers: CORS_HEADERS });
        }

        return new Response(JSON.stringify({ error: 'method not allowed' }), { status: 405, headers: CORS_HEADERS });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: CORS_HEADERS });
    }
}
