import { Html } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { SocketContext } from "../contexts/Socket";
import { Mesh } from "three";

const YoutubeController = () => {
  const { socket } = useContext(SocketContext);
  const [videoUrl, updateVideoUrl] = useState<string>(
    "https://www.youtube.com/embed/dQw4w9WgXcQ?si=DR3zQnZoOtPIb_tX"
  );
  const [rawVideoUrl, updateRawVideoUrl] = useState<string>("");
  const meshRef = useRef<Mesh>(null);
  const [error, updateError] = useState<string>("");
  useEffect(() => {
    socket?.on("video-url", handleVideoUrl);
    return () => {
      socket?.off("video-url", handleVideoUrl);
    };
  },[]);

  const handleVideoUrl = (videUrl:string) => {
    updateVideoUrl(videUrl);
  };
  useEffect(() => {}, [videoUrl]);

  const handlePlayButton = () => {
    const videoId = extractYouTubeVideoId(rawVideoUrl);
    if (videoId == null) {
      console.log("coudn't able to fetch the video id.");
      updateError("Invalid Video URL !");
      return;
    }
    updateRawVideoUrl("");
    updateVideoUrl(`https://www.youtube.com/embed/${videoId}`);
    socket?.emit("sendVideoUrl",`https://www.youtube.com/embed/${videoId}`)
  };

  const extractYouTubeVideoId = (url: string) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] || match[2] : null;
  };

  return (
    <>

      <mesh ref={meshRef} position={[-5 - 2.4, 1, Math.PI + 2.5]}>
        <Html
          transform
          distanceFactor={1.5}
          rotation={[0, Math.PI / 2, 0]}
          occlude={true}

        >
               <div className="h-fit w-[1200px] flex items-center justify-end bg-black">
          <div className="flex items-center">
            <div className="flex justify-center items-center">
              <input
                type="text"
                name="youtube-link"
                id="youtube-link"
                className=" font-mono h-12 w-64"
                placeholder="Youtube link"
                value={rawVideoUrl}
                onChange={(e) => {
                  updateRawVideoUrl(e.target.value);
                }}
              />
              <button
                className="bg-red-600 px-2 py-3 rounded-sm font-mono text-white"
                onClick={handlePlayButton}
              >
                Play
              </button>
            </div>
          </div>
          {error && <h5 className="text-red-600 font-mono mt-2 ">{error}</h5>}
        </div>
          <div className="h-[520px] w-[1200px] bg-black">
            <iframe
              src={videoUrl}
              width={"100%"}
              height={"100%"}
              className="border-none"
            
            />
          </div>
        </Html>
      </mesh>
    </>
  );
};

export default YoutubeController;
