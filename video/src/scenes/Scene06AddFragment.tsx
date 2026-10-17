import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ActivityShell, AddFormScreen, Phone, Tap, Toast} from '../components/AppUI';
import {Appear, progress} from '../components/anim';
import {CodePanel} from '../components/CodePanel';
import {Arrow, Node} from '../components/Diagram';
import {SceneFrame} from '../components/SceneFrame';
import {snippet} from '../code/snippet';
import {sources} from '../code/sources';
import {useBeat} from '../timeline';
import {colors, fonts} from '../theme';
import {press, tap, typed, within} from './helpers';

const code = snippet(sources.addRestaurantFragment, 'public class AddRestaurantFragment', '}');

const LOGO = {name: 'Taco Fiesta', color: '#D1495B'};

// The parts of the Add layout, pointed at in beat 0 (y is in stage pixels)
const PARTS = [
  {y: 238, text: 'ivLogo', sub: 'ImageView: tap to pick a logo', color: colors.pink},
  {y: 392, text: 'etName, etType, etDescription, etLocation', sub: 'EditText: the four text fields', color: colors.blue},
  {y: 517, text: 'btnAdd', sub: 'Button: saves the restaurant', color: colors.android},
];

// The steps of addRestaurant(), shown on the right in beats 5-9
const FLOW = [
  {beat: 5, label: 'New document', sub: 'gives us a unique id', color: colors.firebaseOrange},
  {beat: 6, label: 'logos/<id>.jpg', sub: 'the logo file name in Storage', color: colors.firebase},
  {beat: 7, label: '1 putFile()  2 getDownloadUrl()', sub: 'upload, then get the image link', color: colors.firebase},
  {beat: 8, label: '3 set(restaurant)', sub: 'save it in Firestore', color: colors.firebaseOrange},
  {beat: 9, label: '4 Toast + Show screen', sub: 'or showError() if it fails', color: colors.android},
];

export const Scene06AddFragment: React.FC = () => {
  const frame = useCurrentFrame();
  const {beat, timing} = useBeat();
  const s = timing.beatStarts;
  const end = timing.durationInFrames;
  const at = (b: number, f: number) => within(s, end, b, f);

  // The small phone in beats 1-4
  const logoTap = at(2, 0.4);
  const addTap = at(3, 0.6);
  const logoTap2 = at(3, 0.15);
  const picked = frame >= logoTap + 12;
  const typingStart = at(4, 0.05);
  const values = beat >= 4
    ? {
        type: typed('Mexican', frame, typingStart, typingStart + 20),
        location: typed('River Street', frame, typingStart + 22, typingStart + 46),
      }
    : {};
  const errorTap = at(4, 0.55);
  const errorToast = progress(frame, errorTap + 6, 8) * (1 - progress(frame, at(4, 0.97), 6));
  const lastTap = frame >= errorTap ? {x: 195, y: 536, at: errorTap}
    : frame >= addTap ? {x: 195, y: 536, at: addTap}
    : frame >= logoTap2 ? {x: 195, y: 233, at: logoTap2}
    : {x: 195, y: 233, at: logoTap};

  return (
    <SceneFrame>
      {/* Beat 0: the layout, with its parts labelled */}
      <Appear at={4} out={s[1]} from="left" style={{left: 360, top: -20}}>
        <Phone scale={0.92}>
          <ActivityShell>
            <AddFormScreen />
          </ActivityShell>
        </Phone>
      </Appear>
      {PARTS.map((part, i) => (
        <React.Fragment key={part.text}>
          <Arrow x1={880} y1={part.y} x2={765} y2={part.y} amount={beat === 0 ? progress(frame, 30 + i * 30, 14) : 0} color={part.color} />
          <Appear at={36 + i * 30} out={s[1]} from="right" style={{left: 900, top: part.y - 42}}>
            <div style={{fontFamily: fonts.mono, fontSize: 30, fontWeight: 700, color: part.color}}>{part.text}</div>
            <div style={{fontSize: 26, color: colors.muted, marginTop: 4}}>{part.sub}</div>
          </Appear>
        </React.Fragment>
      ))}

      {/* Beats 1-9: the code */}
      <Appear at={s[1]} from="left" style={{left: 0, top: 0}}>
        <CodePanel
          snippet={code}
          width={1120}
          height={740}
          steps={{
            1: {reveal: 'btnAdd = view.findViewById', highlight: [['fbs = FirebaseServices.getInstance();', 'btnAdd = view.findViewById']]},
            2: {highlight: [['private final ActivityResultLauncher', '});']]},
            3: {reveal: 'btnAdd.setOnClickListener', highlight: ['ivLogo.setOnClickListener', 'btnAdd.setOnClickListener']},
            4: {
              reveal: ['if (selectedImageUri == null)', '}'],
              highlight: [['String name = etName', 'String location = etLocation'], ['if (name.isEmpty()', 'return;']],
            },
            5: {reveal: 'DocumentReference doc =', highlight: ['DocumentReference doc =']},
            6: {reveal: '.child("logos/"', highlight: [['StorageReference logoRef', '.child("logos/"']]},
            7: {reveal: ['// Step 1', '=    }'], highlight: [['logoRef.putFile', '.addOnFailureListener(this::showError);']]},
            8: {reveal: 'doc.set(restaurant)', highlight: [['Restaurant restaurant = new Restaurant', 'doc.set(restaurant)']]},
            9: {
              reveal: 'all',
              highlight: [['.addOnSuccessListener(unused', 'activity.showFragment'], ['private void showError', 'Toast.makeText(getContext(), "Failed']],
            },
          }}
        />
      </Appear>

      {/* Beats 1-4: a small phone that follows the code */}
      <Appear at={s[1] + 8} out={s[5]} from="right" style={{left: 1290, top: 20}}>
        <Phone scale={0.8}>
          <ActivityShell>
            <AddFormScreen
              logo={picked ? LOGO : null}
              values={values}
              focused={beat === 4 && errorToast === 0 ? (values.location ? 'location' : 'type') : null}
              addPressed={beat >= 3 ? press(frame, lastTap.y === 536 ? lastTap.at : -100) : 0}
            />
          </ActivityShell>
          <Toast text="Please fill in name, type and location" alpha={errorToast} />
          <Tap x={lastTap.x} y={lastTap.y} amount={tap(frame, lastTap.at)} />
        </Phone>
      </Appear>
      {beat === 2 && frame >= logoTap && frame < logoTap + 30 && (
        <Appear at={logoTap} style={{left: 1300, top: -40, fontSize: 24, color: colors.muted}}>
          Gallery opens… image picked
        </Appear>
      )}

      {/* Beats 5-9: the steps of addRestaurant() */}
      {FLOW.map((step, i) => {
        const active = beat === step.beat;
        const done = beat > step.beat;
        return (
          <React.Fragment key={step.label}>
            {i > 0 && <Arrow x1={1465} y1={i * 148 - 38} x2={1465} y2={i * 148 - 6} amount={progress(frame, s[step.beat], 10)} color={colors.muted} />}
            <Node
              x={1170}
              y={i * 148}
              width={590}
              height={110}
              label={step.label}
              sub={step.sub}
              color={done ? colors.android : active ? step.color : colors.border}
              glow={active ? 0.6 : 0}
              alpha={progress(frame, s[step.beat] ?? end, 12)}
              mono
              fontSize={26}
            />
          </React.Fragment>
        );
      })}
    </SceneFrame>
  );
};
