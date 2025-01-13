import { Html } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react';
import { Mesh } from 'three';

const YoutubeController = () => {
  const [videoUrl, updateVideoUrl] = useState<string>("https://www.youtube.com/embed/htIuSWBnmok?si=JP3abY8bOs6Ki3qW");
  const [rawVideoUrl,updateRawVideoUrl] = useState<string>("")
  const meshRef = useRef<Mesh>(null);
  const [error,updateError] = useState<string>("");
  
useEffect(()=>{

  

},[videoUrl])

  
  const handlePlayButton = () => {
      const videoId = extractYouTubeVideoId(rawVideoUrl);
      if(videoId == null){
        console.log("coudn't able to fetch the video id.")
        updateError("Invalid Video URL !");
        return
      }
    updateRawVideoUrl("")
    updateVideoUrl(`https://www.youtube.com/embed/${videoId}`);
    
    };
  
    const extractYouTubeVideoId = (url:string) => {
      const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^&]+)/;
      const match = url.match(regex);
      return match ? match[1] || match[2] : null;
    };
  
  return (
    <>
    <Html position={[-5, 1, Math.PI+0.01]} transform distanceFactor={1.5} zIndexRange={[0]} occlude>
            <div className='h-[530px] w-[1200px] flex flex-col items-center justify-center bg-black'>
                <h1 className='text-white font-mono font-extrabold text-5xl'>Youtube Link</h1>
                <div className='flex items-center'>
                  <div className='flex justify-center items-center'>
                <input type="text" name="youtube-link" id="youtube-link" className=' font-mono h-12 w-64' placeholder='Youtube link'
              value={rawVideoUrl}  onChange={(e)=>{updateRawVideoUrl(e.target.value)}} />
                <button className='bg-red-600 px-2 py-3 rounded-sm font-mono text-white'
                onClick={handlePlayButton}>Play</button>
                </div>
                </div>
                {error && <h5 className='text-red-600 font-mono mt-2 '>{error}</h5> }
      
            </div> 
    </Html>
    <mesh ref={meshRef} position={[-5-2.4, 1,Math.PI+2.5]} >
      <Html
        transform
        occlude
        distanceFactor={1.5}
        rotation={[0,Math.PI/2,0]}
        zIndexRange={[0]}
        
      >
        <div className="h-[520px] w-[1200px] bg-black">
          <iframe
            src={videoUrl}
            width={'100%'}
            height={'100%'}
            className="border-none"
          />
        </div>
      </Html>
    </mesh>   
     </>
  )
}

export default YoutubeController
