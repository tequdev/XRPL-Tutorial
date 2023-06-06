import { URL } from 'url'

import { NextApiHandler } from "next";
import ogs from 'open-graph-scraper'

type Meta = {
  url: string
  hostname: string
  title: string
  description: string
  image: string
  favicon: string
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const meta = await getLinkMeta(req.query['href'] as string)
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
    res.status(200).json(meta)
  } else {
    res.status(405).end();
  }
}


async function getLinkMeta(url: string): Promise<Meta> {
  const metaData: Meta = {
    url,
    hostname: '',
    title: '',
    description: '',
    image: '',
    favicon: ''
  }
  try {
    const res = await ogs({ url })
    metaData.title = res.result?.ogTitle || ''
    metaData.description = res.result?.ogDescription || ''
    metaData.image = res.result?.ogImage ? res.result?.ogImage[0].url : ''
    const urlmeta = new URL(url)
    metaData.hostname = urlmeta.hostname
    metaData.favicon = `${urlmeta.protocol}//${urlmeta.hostname}/${res.result?.favicon}`
  } catch (e) {
    console.error(e)
  }
  return metaData
}

export default handler
