import useSWR, { Fetcher } from 'swr'

type Meta = {
  url: string
  hostname: string
  title: string
  description: string
  image: string
  favicon: string
}

interface P {
  href: string
  children: any
  metas: Meta[]
}

const fetcher: Fetcher<Meta, string> = async (url) => {
  const res = await fetch(url)
  const data = await res.json()
  console.log(data)
  return data
}

export const LinkCard: React.FC<P> = ({ href, children }) => {
  const { data: target, error, isLoading } = useSWR(`/api/linkmeta?${new URLSearchParams({ href })}`, fetcher)

  if (target) {
    return (
      <a href={href} target='_blank' rel='noreferrer' className='mx-auto mt-6 flex justify-center'>
        <div className=' flex w-full max-w-[660px] justify-around rounded-md border bg-white'>
          <div className='ml-3 flex flex-col justify-start p-3 px-1'>
            <div className='whitespace-pre-wrap text-lg font-bold text-black'>{target.title}</div>
            <div className='mt-2 whitespace-pre-wrap text-sm text-gray-500'>{target.description}</div>
            <div className='mt-2 flex gap-1 whitespace-pre-wrap text-sm text-gray-500'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={target.favicon} alt={target.title + '-favicon'} className='h-5 w-5' />
              {target.hostname}
            </div>
          </div>
          <div className='w-1/2 max-w-[230px]'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={target.image} alt={target.title} className='m-auto' />
          </div>
        </div>
      </a>
    )
  }
  return (
    <a href={href} target='_brank'>
      {children}
    </a>
  )
}