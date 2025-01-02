import React, { useState, useRef } from "react";
import {  Html } from "@react-three/drei";
import { Mesh } from "three";

const YouTubePlayer = () => {
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ");
  const meshRef = useRef<any>();

  const handleInputChange = (event:any) => {
    const url = event.target.value;
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      setVideoUrl(`https://www.youtube.com/embed/${videoId}`);
    }
  };

  const extractYouTubeVideoId = (url:string) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] || match[2] : null;
  };

  return (
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
  );
};

export default YouTubePlayer;