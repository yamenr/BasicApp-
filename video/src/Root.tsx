import React from 'react';
import {Composition, Folder} from 'remotion';
import {Lang, scriptFor} from './lang';
import {loadTimeline} from './timeline';
import {SingleScene, SingleSceneProps, Tutorial, TutorialProps} from './Tutorial';
import {VIDEO} from './config';

// One full video and one composition per scene, for each language
const LanguageCompositions: React.FC<{lang: Lang}> = ({lang}) => {
  const suffix = lang === 'en' ? '' : '-Arabic';
  return (
    <>
      <Composition
        id={`Tutorial${suffix}`}
        component={Tutorial}
        {...VIDEO}
        durationInFrames={VIDEO.fps * 60}
        defaultProps={{timeline: []} as TutorialProps}
        calculateMetadata={async () => {
          // Scene lengths come from the audio files in public/audio (or an estimate)
          const timeline = await loadTimeline(lang);
          return {
            durationInFrames: timeline.reduce((sum, t) => sum + t.durationInFrames, 0),
            props: {timeline},
          };
        }}
      />
      <Folder name={`Scenes${suffix}`}>
        {scriptFor(lang).map((scene, index) => (
          <Composition
            key={scene.id}
            id={`Scene${String(index + 1).padStart(2, '0')}-${scene.id}${suffix}`}
            component={SingleScene}
            {...VIDEO}
            durationInFrames={VIDEO.fps * 10}
            defaultProps={{index, timing: null} as SingleSceneProps}
            calculateMetadata={async ({props}) => {
              const timing = (await loadTimeline(lang))[props.index];
              return {durationInFrames: timing.durationInFrames, props: {...props, timing}};
            }}
          />
        ))}
      </Folder>
    </>
  );
};

export const RemotionRoot: React.FC = () => (
  <>
    <LanguageCompositions lang="en" />
    <LanguageCompositions lang="ar" />
  </>
);
