// VideoPlayer.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoUrl = 'https://cdn.bitmovin.com/content/assets/art-of-motion-dash-hls-progressive/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';

  useEffect(() => {
    if (videoRef.current) {
      const hls = new Hls();

      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);

      // Clean up on component unmount
      return () => {
        hls.destroy();
      };
    }
  }, [videoUrl]);

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        controls
        className="w-full h-auto"
        autoPlay
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
