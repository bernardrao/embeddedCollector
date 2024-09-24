function jsapi_router(apidata){
    let a = JSON.parse(apidata);
    console.log('js:(jsapi_router)    data:',apidata);
    console.log('js:(jsapi_router)    data:',a.api);
    console.log('js:(jsapi_router)    data:',JSON.stringify(a.data));
    
    /* mg_http_reply(c, 200, s_json_header,
        "{%m:%m,%m:%m,%m:%d}\n",    // 类似 printf, json 名使用 MG_ESC 
        MG_ESC("text"), MG_ESC("Hello!"),
        MG_ESC("data"), MG_ESC("somedata"),
        MG_ESC("devid"),pageno); */
        
    return JSON.stringify({api: a.api, received:true});    
}