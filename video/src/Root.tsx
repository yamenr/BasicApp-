import React from 'react';
import {Composition, Folder} from 'remotion';
import {scenes} from './script';
import {loadTimeline} from './timeline';
import {SingleScene, SingleSceneProps, Tutorial, TutorialProps} from './Tutorial';
import {VIDEO} from './config';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Tutorial"
      component={Tutorial}
      {...VIDEO}
      durationInFrames={VIDEO.fps * 60}
      defaultProps={{timeline: []} as TutorialProps}
      calculateMetadata={async () => {
        // Scene lengths come from the audio files in public/audio (or an estimate)
        const timeline = await loadTimeline();
        return {
          durationInFrames: timeline.reduce((sum, t) => sum + t.durationInFrames, 0),
          props: {timeline},
        };
      }}
    />
    <Folder name="Scenes">
      {scenes.map((scene, index) => (
        <Composition
          key={scene.id}
          id={`Scene${String(index + 1).padStart(2, '0')}-${scene.id}`}
          component={SingleScene}
          {...VIDEO}
          durationInFrames={VIDEO.fps * 10}
          defaultProps={{index, timing: null} as SingleSceneProps}
          calculateMetadata={async ({props}) => {
            const timing = (await loadTimeline())[props.index];
            return {durationInFrames: timing.durationInFrames, props: {...props, timing}};
          }}
        />
      ))}
    </Folder>
  </>
);
