import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import loading from '@/assets/animation/loading.json'

const LoadingAnimation: React.FC = () => (
    <>
  <Player
    autoplay
    loop
    src={loading}
    style={{ height: '200px', width: '200px' }}
    className='mt-40'
  />
  
  <p className="text-muted-foreground text-center">Đang tải phim...Server đồ chùa load nhanh hết cỡ rồi:))</p>
  </>
);

export default LoadingAnimation;
