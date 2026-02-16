export const getStreamUrl = async (): Promise<string> => {
  try {
    // In a real implementation, this would call your backend API
    // const response = await fetch('/api/get-secure-stream');
    // const data = await response.json();
    // return data.url;

    // Connect to local backend proxy
    // Dynamically determine the backend URL based on the frontend's hostname
    // This allows it to work when accessed via IP address (e.g. 192.168.x.x) on mobile
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const backendUrl = `${protocol}//${hostname}:5000/stream/playlist.m3u8`;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return backendUrl;
  } catch (error) {
    console.error('Failed to fetch stream URL:', error);
    throw error;
  }
};
