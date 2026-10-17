import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ActivityShell, ConfirmDialog, ListScreen, Phone, SAMPLE_RESTAURANTS, Tap, Toast} from '../components/AppUI';
import {Appear, progress} from '../components/anim';
import {CodePanel} from '../components/CodePanel';
import {SceneFrame} from '../components/SceneFrame';
import {snippet} from '../code/snippet';
import {sources} from '../code/sources';
import {useBeat} from '../timeline';
import {colors} from '../theme';
import {press, tap, within} from './helpers';

const code = snippet(
  sources.showRestaurantsFragment,
  '// Called by the adapter when the user clicks "Delete"',
  '    }',
  'private void deleteRestaurant',
);

const ROW = 3; // Sushi Go
const DELETE_BUTTON = {x: 339, y: 201 + ROW * 108};
const NO_BUTTON = {x: 249, y: 438};
const YES_BUTTON = {x: 312, y: 438};

export const Scene09DeleteDialog: React.FC = () => {
  const frame = useCurrentFrame();
  const {timing} = useBeat();
  const s = timing.beatStarts;
  const end = timing.durationInFrames;
  const at = (b: number, f: number) => within(s, end, b, f);

  // Tap Delete → dialog. Tap No → closes. Tap Delete again → dialog. Tap Yes → deleted.
  const taps = [
    {...DELETE_BUTTON, at: at(0, 0.45), kind: 'delete'},
    {...NO_BUTTON, at: at(2, 0.25), kind: 'no'},
    {...DELETE_BUTTON, at: at(2, 0.8), kind: 'delete'},
    {...YES_BUTTON, at: at(3, 0.3), kind: 'yes'},
  ];
  const lastTap = [...taps].reverse().find((t) => frame >= t.at) ?? taps[0];
  const dialogAlpha =
    progress(frame, taps[0].at + 8, 10) * (1 - progress(frame, taps[1].at + 6, 8)) +
    progress(frame, taps[2].at + 8, 10) * (1 - progress(frame, taps[3].at + 6, 8));
  const removing = progress(frame, at(3, 0.55), 18);
  const toast = progress(frame, at(3, 0.6), 8) * (1 - progress(frame, at(4, 0.9), 8));
  const deletePress = Math.max(press(frame, taps[0].at), press(frame, taps[2].at));

  return (
    <SceneFrame>
      <Appear at={2} from="left" style={{left: 0, top: 0}}>
        <CodePanel
          snippet={code}
          width={1120}
          height={740}
          steps={{
            0: {reveal: ['public void onDeleteClick', '=}'], highlight: ['new AlertDialog.Builder']},
            1: {highlight: [['.setTitle', '.setNegativeButton']]},
            2: {highlight: ['.setNegativeButton("No", null)']},
            3: {
              reveal: ['private void deleteRestaurant', '.delete()'],
              highlight: ['.setPositiveButton("Yes"', ['fbs.getDb().collection("restaurants").document(restaurant.getId())', '.delete()']],
            },
            4: {reveal: 'all', highlight: [['.addOnSuccessListener(unused', 'loadRestaurants();']]},
          }}
          accent={colors.red}
        />
      </Appear>

      <Appear at={6} from="right" distance={80} style={{left: 1290, top: -20}}>
        <Phone scale={0.92}>
          <ActivityShell>
            <ListScreen
              items={SAMPLE_RESTAURANTS}
              highlightIndex={ROW}
              highlight={removing > 0 ? 0 : progress(frame, taps[0].at, 8)}
              pressed="delete"
              pressAmount={deletePress}
              removing={{index: ROW, amount: removing}}
            />
          </ActivityShell>
          {dialogAlpha > 0 && (
            <ConfirmDialog
              alpha={dialogAlpha}
              name={SAMPLE_RESTAURANTS[ROW].name}
              pressed={lastTap.kind === 'no' || lastTap.kind === 'yes' ? lastTap.kind : null}
              pressAmount={press(frame, lastTap.at)}
            />
          )}
          <Toast text="Restaurant deleted" alpha={toast} />
          <Tap x={lastTap.x} y={lastTap.y} amount={tap(frame, lastTap.at)} />
        </Phone>
      </Appear>
    </SceneFrame>
  );
};
