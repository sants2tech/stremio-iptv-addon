const { addonBuilder, serveHTTP } = require("stremio-addon-sdk")
const axios = require("axios")

const SERVER = "http://meusrv.top:80"
const USER = "84288914"
const PASS = "192695239"

let channels = []

async function loadChannels(){

const res = await axios.get(
`${SERVER}/player_api.php?username=${USER}&password=${PASS}&action=get_live_streams`
)

channels = res.data.map(ch => ({
id: ch.stream_id.toString(),
name: ch.name,
poster: ch.stream_icon || ""
}))

}

const manifest = {
id:"xtream.cloud",
version:"1.0.0",
name:"IPTV Cloud",
description:"Xtream IPTV",
resources:["catalog","stream"],
types:["tv"],
catalogs:[
{
type:"tv",
id:"iptv",
name:"📺 IPTV"
}
]
}

const builder = new addonBuilder(manifest)

builder.defineCatalogHandler(async ()=>{

if(channels.length === 0){
await loadChannels()
}

return {
metas: channels.map(ch=>({
id:ch.id,
type:"tv",
name:ch.name,
poster:ch.poster
}))
}

})

builder.defineStreamHandler(({id})=>{

const stream = `${SERVER}/live/${USER}/${PASS}/${id}.m3u8`

return{
streams:[
{
title:"IPTV",
url:stream
}
]
}

})

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 })
