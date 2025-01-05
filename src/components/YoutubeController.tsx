import { Html } from '@react-three/drei'
import React, { useState } from 'react'
import YouTubePlayer from './YoutubePlayer'

const YoutubeController = () => {

    const handlePlayButton = ()=>{

    }
  return (
    <>
    <Html position={[-5, 1, Math.PI+0.01]} transform distanceFactor={1.5} zIndexRange={[0]} occlude>
            <div className='h-[530px] w-[1200px] flex flex-col items-center justify-center bg-black'>
                <h1 className='text-white font-mono text-5xl'>Youtube Link</h1>
                <div className='flex items-center'>
                  <div className='flex justify-center items-center'>
                <input type="text" name="youtube-link" id="youtube-link" className=' font-mono h-12 w-64' placeholder='Youtube link' />
                <button className='bg-red-600 px-2 py-3 rounded-sm font-mono text-white'>Play</button>
                </div>
                </div>
      
            </div> 
    </Html>
    <YouTubePlayer />
    </>
  )
}

export default YoutubeController
