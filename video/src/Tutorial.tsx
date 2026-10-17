import React from 'react';
import {AbsoluteFill, Audio, Sequence, Series, staticFile} from 'remotion';
import {LEAD_IN_FRAMES, SceneTiming, SceneTimingContext} from './timeline';
import {colors} from './theme';
import {Scene01Intro} from './scenes/Scene01Intro';
import {Scene02FirebaseSetup} from './scenes/Scene02FirebaseSetup';
import {Scene03Model} from './scenes/Scene03Model';
import {Scene04Singleton} from './scenes/Scene04Singleton';
import {Scene05MainActivity} from './scenes/Scene05MainActivity';
import {Scene06AddFragment} from './scenes/Scene06AddFragment';
import {Scene07ShowFragment} from './scenes/Scene07ShowFragment';
import {Scene08UpdateDialog} from './scenes/Scene08UpdateDialog';
import {Scene09DeleteDialog} from './scenes/Scene09DeleteDialog';
import {Scene10Demo} from './scenes/Scene10Demo';
import {Scene11Summary} from './scenes/Scene11Summary';

// Same order as the scenes in script.ts
export const SCENE_COMPONENTS: React.FC[] = [
  Scene01Intro,
  Scene02FirebaseSetup,
  Scene03Model,
  Scene04Singleton,
  Scene05MainActivity,
  Scene06AddFragment,
  Scene07ShowFragment,
  Scene08UpdateDialog,
  Scene09DeleteDialog,
  Scene10Demo,
  Scene11Summary,
];

// One scene with its narration audio (if the audio file exists)
export const SceneRunner: React.FC<{timing: SceneTiming}> = ({timing}) => {
  const Scene = SCENE_COMPONENTS[timing.index];
  return (
    <SceneTimingContext.Provider value={timing}>
      <Scene />
      {timing.audio && (
        <Sequence from={LEAD_IN_FRAMES} layout="none">
          <Audio src={staticFile(timing.audio)} />
        </Sequence>
      )}
    </SceneTimingContext.Provider>
  );
};

export type TutorialProps = {timeline: SceneTiming[]};

export const Tutorial: React.FC<TutorialProps> = ({timeline}) => (
  <AbsoluteFill style={{background: colors.bg}}>
    <Series>
      {timeline.map((timing) => (
        <Series.Sequence key={timing.id} durationInFrames={timing.durationInFrames}>
          <SceneRunner timing={timing} />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

export type SingleSceneProps = {index: number; timing: SceneTiming | null};

// Lets you preview one scene on its own in Remotion Studio
export const SingleScene: React.FC<SingleSceneProps> = ({timing}) =>
  timing ? <SceneRunner timing={timing} /> : null;
