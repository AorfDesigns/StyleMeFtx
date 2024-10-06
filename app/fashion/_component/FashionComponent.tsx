'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Define the type for the images
interface Image {
  url: string; // Define the properties based on the API response structure
}

interface PinterestVideo {
  title: string;
  videoUrl: string;
  images: {
    [key: string]: Image; // Use an index signature for dynamic keys like "474x"
  };
}

interface PinterestApiResponse {
  data: PinterestVideo[];
}

const FashionAnalysis: React.FC = () => {
  const [videos, setVideos] = useState<PinterestVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPinterestFashionVideos = async () => {
    const options: AxiosRequestConfig = {
      method: 'GET',
      url: 'https://unofficial-pinterest-api.p.rapidapi.com/pinterest/videos/relevance',
      params: {
        keyword: 'fashion', // Changed the keyword to "fashion"
        num: '20'
      },
      headers: {
        'x-rapidapi-key': '7e8f1fc79amshd1d2db34ab20267p1de4fbjsncb34daf0c555',
        'x-rapidapi-host': 'unofficial-pinterest-api.p.rapidapi.com'
      }
    };

    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<PinterestApiResponse> = await axios.request(options);
      console.log(response.data); // Log the response data for debugging
      setVideos(response.data.data); // Store the video results
    } catch (error: any) {
      console.error(error);
      setError('Failed to fetch Pinterest fashion videos.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Pinterest fashion videos on component mount
  useEffect(() => {
    fetchPinterestFashionVideos();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Pinterest Fashion Trends</h1>

      {loading && <p className="text-center text-lg mt-4">Loading...</p>}

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {!loading && videos.length === 0 && <p className="text-center text-lg mt-4">No videos found.</p>}

      {videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {videos.map((video, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-lg">
              <img
                src={video?.images["474x"]?.url} // Optional chaining for safety
                alt={video.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h2 className="text-lg font-semibold mb-2">{video.title}</h2>
              {/* Uncomment to enable the video link */}
              {/* <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Watch Video
              </a> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FashionAnalysis;
