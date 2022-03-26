import { useLottie } from 'lottie-react';
import drawingAnimation from '../../assets/lotties/waiting.json';

const Waiting = () => {
  const options = {
    animationData: drawingAnimation,
    loop: true,
    autoplay: true
  };

  const { View } = useLottie(options);

  return View;
};

export default Waiting;
