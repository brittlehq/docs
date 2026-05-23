import "./index.css";
import { Composition } from "remotion";
import { BrittleDemo, totalDurationInFrames } from "./Composition";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BrittleDemo"
      component={BrittleDemo}
      durationInFrames={totalDurationInFrames(FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
