import { useRef, memo, useMemo, useEffect, useState } from "react";
import { MovieEpisode } from "@/types/movie";
import Hls from "hls.js";

interface VideoPlayerProps {
  episode: MovieEpisode;
}

const VideoPlayer = memo(({ episode }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Extract video source from episode and determine format
  const videoInfo = useMemo(() => {
    // Check linkM3u8 first, but also verify it's actually M3U8
    if (episode.linkM3u8) {
      // Check if linkM3u8 is actually an MP4 file
      if (episode.linkM3u8.includes('.mp4') || episode.linkM3u8.includes('mp4')) {
        return { src: episode.linkM3u8, type: 'mp4' };
      } else if (episode.linkM3u8.includes('.m3u8') || episode.linkM3u8.includes('m3u8')) {
        return { src: episode.linkM3u8, type: 'hls' };
      } else {
        // If linkM3u8 doesn't contain clear indicators, assume it's HLS
        return { src: episode.linkM3u8, type: 'hls' };
      }
    } else if (episode.linkEmbed) {
      // Check if linkEmbed is a direct MP4 URL
      if (episode.linkEmbed.includes('.mp4') || episode.linkEmbed.includes('mp4')) {
        return { src: episode.linkEmbed, type: 'mp4' };
      } else if (episode.linkEmbed.includes('.m3u8') || episode.linkEmbed.includes('m3u8')) {
        return { src: episode.linkEmbed, type: 'hls' };
      } else {
        // If it's an embed link, we can't use it
        return { src: null, type: 'unsupported' };
      }
    }
    return { src: null, type: 'none' };
  }, [episode]);

  useEffect(() => {
    // Clean up previous instance when component unmounts or video source changes
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [episode.id]);  // Keyboard shortcuts with improved event handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      const container = containerRef.current;
      
      if (!video || !container) return;

      // Check if we should handle this event
      const isVideoPlayerActive = container.contains(document.activeElement) || 
                                 document.activeElement === container ||
                                 document.activeElement === video ||
                                 document.activeElement === document.body;

      // List of keys we want to handle
      const controlKeys = [
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 
        ' ', 'k', 'm', 'f',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
      ];
      
      // For arrow keys, always handle them when video is playing/visible
      const isArrowKey = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key);
      
      if (!controlKeys.includes(e.key)) return;
      if (!isVideoPlayerActive && !isArrowKey) return;

      // Prevent default browser behavior ALWAYS for these keys
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      console.log('Video Player: Handling key:', e.key);      switch (e.key) {
        case 'ArrowLeft': {
          // Seek backward 10 seconds
          const newTimeBackward = Math.max(0, video.currentTime - 10);
          video.currentTime = newTimeBackward;
          console.log('Seeking backward 10s, new time:', newTimeBackward);
          break;
        }
        case 'ArrowRight': {
          // Seek forward 10 seconds
          const newTimeForward = Math.min(video.duration || 0, video.currentTime + 10);
          video.currentTime = newTimeForward;
          console.log('Seeking forward 10s, new time:', newTimeForward);
          break;
        }
        case 'ArrowUp':
          // Increase volume by 10%
          video.volume = Math.min(1, video.volume + 0.1);
          break;
        case 'ArrowDown':
          // Decrease volume by 10%
          video.volume = Math.max(0, video.volume - 0.1);
          break;
        case ' ':
        case 'k':
          // Toggle play/pause
          if (video.paused) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
          break;
        case 'm':
          // Toggle mute
          video.muted = !video.muted;
          break;
        case 'f':
          // Toggle fullscreen
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          } else {
            container.requestFullscreen().catch(() => {});
          }
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9': {
          // Jump to percentage of video
          const percentage = parseInt(e.key) * 10;
          const duration = video.duration || 0;
          video.currentTime = (duration * percentage) / 100;
          break;
        }
      }
    };

    // Use capture phase to intercept BEFORE any other handlers
    document.addEventListener('keydown', handleKeyDown, { capture: true, passive: false });

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, []);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoInfo.src) return;

    setIsLoading(true);
    setError(null);

    const loadVideo = async () => {
      try {
        if (videoInfo.type === 'mp4') {
          // Handle MP4 files with native HTML5 video
          video.src = videoInfo.src;
          
          const handleLoadedMetadata = () => {
            setIsLoading(false);
            video.play().catch(error => {
              console.warn('Autoplay prevented:', error);
            });
          };
          
          const handleError = () => {
            setError('Không thể phát video MP4');
            setIsLoading(false);
          };
          
          video.addEventListener('loadedmetadata', handleLoadedMetadata);
          video.addEventListener('error', handleError);
          
          // Cleanup event listeners
          return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('error', handleError);
          };
          
        } else if (videoInfo.type === 'hls') {
          // Handle HLS streams
          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            video.src = videoInfo.src;
            video.addEventListener('loadedmetadata', () => {
              setIsLoading(false);
            });
          } else if (Hls.isSupported()) {
            // Use HLS.js for browsers without native HLS support
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90
            });
            
            hlsRef.current = hls;
            
            hls.attachMedia(video);
            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
              hls.loadSource(videoInfo.src);
            });
            
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              setIsLoading(false);
              video.play().catch(error => {
                console.warn('Autoplay prevented:', error);
              });
            });
            
            hls.on(Hls.Events.ERROR, (_, data) => {
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    // Try to recover network error
                    console.log('Fatal network error', data);
                    hls.startLoad();
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    // Try to recover media error
                    console.log('Fatal media error', data);
                    hls.recoverMediaError();
                    break;
                  default:
                    // Cannot recover
                    setError('Không thể phát video');
                    hls.destroy();
                    break;
                }
              }
            });
          } else {
            setError('Trình duyệt không hỗ trợ phát video HLS');
          }
        }
      } catch (err) {
        console.error('Video player error:', err);
        setError('Có lỗi khi phát video');
        setIsLoading(false);
      }
    };    loadVideo();
  }, [videoInfo, episode.id]);

  if (!videoInfo.src || videoInfo.type === 'unsupported' || error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-xl font-medium text-white">
            {error || "Không hỗ trợ định dạng video này"}
          </p>
          <p className="mt-2 text-sm text-white/70">
            {error 
              ? "Vui lòng thử lại sau hoặc chọn nguồn phát khác" 
              : "Không thể tải nguồn phát cho phim này"}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full"
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin" />
        </div>
      )}      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        controls
        autoPlay
        playsInline
        tabIndex={-1}
        style={{ outline: 'none' }}
      />
    </div>
  );
});

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;