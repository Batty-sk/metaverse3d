import { Html } from '@react-three/drei'
import React, { useState } from 'react'
import YouTubePlayer from './YoutubePlayer'

const YoutubeController = () => {
    const [youtubeLink,updateYoutubeLink] = useState<string>('')
  return (
    <>
    <Html position={[0,5,0]}>
            <div className='h-[200px] w-[500px] flex flex-col items-center justify-center bg-black'>
                <h1 className='text-white font-mono'>Youtube Link</h1>
                <div className='flex items-center'>
                <input type="text" name="" id="" className='mt-2 font-mono' placeholder='Youtube link' />
                <button className='bg-red-600 px-2 rounded-sm font-mono text-white'>Play</button>
                </div>
                <div className='w-2/4 flex mt-2'>
                    <span className='me-2 text-white text-sm font-mono'>Playing:</span>
                    {/*@ts-ignore */}
                    <marquee behavior="" direction="" className="text-white">Bru</marquee>
                </div>
            </div>
    </Html>
    <YouTubePlayer />
    </>
  )
}

export default YoutubeController
