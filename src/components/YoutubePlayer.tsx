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
    <mesh ref={meshRef} position={[0, 2, 5]}>
      <planeGeometry args={[4, 2.5]} />
      <meshStandardMaterial color="black" />
      
      <Html
        transform
        occlude
        distanceFactor={1.5}
        position={[0, 0, 0.1]}
        rotation={[0, 0, 0]}
      >
        <div className="w-[400px] h-[250px] bg-black">
          <iframe
            src={videoUrl}
            width="400"
            height="250"
            className="border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </Html>
    </mesh>
  );
};

export default YouTubePlayer;