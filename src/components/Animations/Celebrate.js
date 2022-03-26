import { useLottie } from 'lottie-react';
import drawingAnimation from '../../assets/lotties/celebrate.json';

const Celebrate = () => {
  const options = {
    animationData: drawingAnimation,
    loop: false,
    autoplay: true,
    direction: 'backward'
  };

  const { View } = useLottie(options);

  return View;
};

export default Celebrate;
