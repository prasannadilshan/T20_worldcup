export const getStreamUrl = async (): Promise<string> => {
  const base = import.meta.env.VITE_BACKEND_URL;
  if (!base) throw new Error("VITE_BACKEND_URL is not set");
  return `${base}/stream/playlist.m3u8`;
};
