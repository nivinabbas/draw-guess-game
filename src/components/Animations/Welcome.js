import { useLottie } from 'lottie-react';
import drawingAnimation from '../../assets/lotties/welcome.json';

const Welcome = () => {
  const options = {
    animationData: drawingAnimation,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options);

  return View;
};

export default Welcome;
