import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Appear, progress} from '../components/anim';
import {CodePanel} from '../components/CodePanel';
import {InfoCard, Mono} from '../components/Diagram';
import {SceneFrame} from '../components/SceneFrame';
import {snippet} from '../code/snippet';
import {sources} from '../code/sources';
import {useBeat} from '../timeline';
import {colors, fonts, syntax} from '../theme';

const code = snippet(sources.restaurant, 'public class Restaurant', '}');

const FIELDS: [string, string][] = [
  ['id', '"k3J9xQ"'],
  ['name', '"Pizza Roma"'],
  ['type', '"Pizza"'],
  ['description', '"Wood-fired pizza"'],
  ['location', '"Main Street"'],
  ['logoUrl', '"https://…/logos/k3J9xQ.jpg"'],
];

const NOTES: {title: string; color: string; body: React.ReactNode}[] = [
  {title: 'A model class', color: colors.blue, body: <>Describes one thing in our app: <b>a restaurant</b>. One object = one restaurant.</>},
  {title: 'Fields', color: colors.blue, body: <>Each field matches a field in the Firestore document.</>},
  {title: 'Reading a document', color: colors.firebase, body: <>Firestore calls <Mono>new Restaurant()</Mono>, then the setters, to fill in the object.</>},
  {title: 'Creating a restaurant', color: colors.android, body: <><Mono>new Restaurant(id, name, type, description, location, logoUrl)</Mono></>},
  {title: 'Getters and setters', color: colors.purple, body: <><Mono>getName()</Mono> reads a value.<br /><Mono>setName(…)</Mono> changes it.</>},
  {title: 'Serializable', color: colors.pink, body: <>Lets us put a Restaurant inside a <Mono>Bundle</Mono> and send it to the edit dialog.</>},
];

export const Scene03Model: React.FC = () => {
  const frame = useCurrentFrame();
  const {beat, timing} = useBeat();
  const s = timing.beatStarts;
  const note = NOTES[beat];

  return (
    <SceneFrame>
      <Appear at={2} from="left" style={{left: 0, top: 0}}>
        <CodePanel
          snippet={code}
          width={1120}
          height={740}
          steps={{
            0: {reveal: 'public class Restaurant', highlight: ['public class Restaurant']},
            1: {reveal: 'private String logoUrl;', highlight: [['private String id;', 'private String logoUrl;']]},
            2: {reveal: ['public Restaurant() {', '}'], highlight: [['// Empty constructor', '}']]},
            3: {reveal: ['public Restaurant(String id', '}'], highlight: [['// Full constructor', '}']]},
            4: {reveal: 'all', highlight: [['public String getName()', '}'], ['public void setName(', '}']]},
            5: {highlight: ['implements Serializable']},
          }}
        />
      </Appear>

      {/* A Firestore document, to show what the fields become */}
      <Appear at={s[1]} from="right" style={{left: 1170, top: 0, width: 590}}>
        <div style={{background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 18, overflow: 'hidden'}}>
          <div style={{background: colors.surfaceHi, padding: '16px 24px', fontSize: 24, color: colors.muted}}>
            Firestore · <span style={{color: colors.firebase}}>restaurants</span> / k3J9xQ
          </div>
          <div style={{padding: '14px 24px 18px'}}>
            {FIELDS.map(([name, value], i) => {
              const p = progress(frame, s[1] + 6 + i * 5, 12);
              return (
                <div key={name} style={{display: 'flex', gap: 14, fontFamily: fonts.mono, fontSize: 22, lineHeight: 1.8, opacity: p}}>
                  <span style={{color: colors.blue, width: 150}}>{name}</span>
                  <span style={{color: syntax.string, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Appear>

      <div style={{position: 'absolute', left: 1170, top: beat === 0 ? 0 : 400, width: 590}}>
        <div key={beat} style={{opacity: progress(frame, s[beat] + 4, 14)}}>
          <InfoCard title={note.title} color={note.color}>
            {note.body}
          </InfoCard>
        </div>
      </div>
    </SceneFrame>
  );
};

