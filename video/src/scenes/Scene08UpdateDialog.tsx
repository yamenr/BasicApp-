import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ActivityShell, EditDialog, ListScreen, Phone, SAMPLE_RESTAURANTS, Tap, Toast} from '../components/AppUI';
import {Appear, progress} from '../components/anim';
import {CodePanel} from '../components/CodePanel';
import {SceneFrame} from '../components/SceneFrame';
import {snippet} from '../code/snippet';
import {sources} from '../code/sources';
import {useBeat} from '../timeline';
import {press, tap, typed, within} from './helpers';

const onUpdateClick = snippet(sources.showRestaurantsFragment, '// Called by the adapter when the user clicks "Update"', '    }');
const dialog = snippet(sources.editRestaurantDialog, 'public class EditRestaurantDialog', '}');

const ROW = 1; // Burger Hub
const UPDATE_BUTTON = {x: 339, y: 163 + ROW * 108};
const SAVE_BUTTON = {x: 318, y: 500};
const OLD_LOCATION = SAMPLE_RESTAURANTS[ROW].location;
const NEW_LOCATION = 'Station Square';

export const Scene08UpdateDialog: React.FC = () => {
  const frame = useCurrentFrame();
  const {beat, timing} = useBeat();
  const s = timing.beatStarts;
  const end = timing.durationInFrames;
  const at = (b: number, f: number) => within(s, end, b, f);

  const updateTap = at(0, 0.55);
  const saveTap = at(4, 0.45);
  const dialogAlpha = progress(frame, updateTap + 8, 10) * (1 - progress(frame, at(5, 0.15), 8));
  const filled = progress(frame, s[2] + 10, 12) > 0.5 || beat < 2;

  // Beat 3: delete the old location, then type the new one
  const eraseStart = at(3, 0.25);
  const erased = OLD_LOCATION.slice(0, OLD_LOCATION.length - Math.round(Math.max(0, Math.min(1, (frame - eraseStart) / 14)) * OLD_LOCATION.length));
  const location = frame < eraseStart ? OLD_LOCATION
    : frame < eraseStart + 16 ? erased
    : typed(NEW_LOCATION, frame, eraseStart + 16, eraseStart + 46);

  const item = SAMPLE_RESTAURANTS[ROW];
  const values = filled
    ? {name: item.name, type: item.type, description: 'Big burgers and fries', location}
    : {};
  const saved = frame >= at(5, 0.15);
  const items = SAMPLE_RESTAURANTS.map((r, i) => (i === ROW && saved ? {...r, location: NEW_LOCATION} : r));
  const toast = progress(frame, at(5, 0.2), 8) * (1 - progress(frame, at(5, 0.9), 8));
  const lastTap = frame >= saveTap ? {...SAVE_BUTTON, at: saveTap} : {...UPDATE_BUTTON, at: updateTap};

  return (
    <SceneFrame>
      <Appear at={2} out={s[1]} from="left" style={{left: 0, top: 0}}>
        <CodePanel
          snippet={onUpdateClick}
          width={1120}
          height={740}
          maxFontSize={26}
          steps={{0: {reveal: 'all', highlight: [['EditRestaurantDialog dialog', 'dialog.show(']]}}}
        />
      </Appear>
      <Appear at={s[1]} from="left" style={{left: 0, top: 0}}>
        <CodePanel
          snippet={dialog}
          width={1120}
          height={740}
          steps={{
            1: {reveal: ['public static EditRestaurantDialog newInstance', '=    }'], highlight: [['public static EditRestaurantDialog newInstance', '=    }']]},
            2: {
              reveal: ['public void onViewCreated', '=    }'],
              highlight: ['restaurant = (Restaurant) requireArguments()', ['etName.setText', 'etLocation.setText']],
            },
            3: {reveal: ['private void saveChanges()', 'restaurant.setLocation'], highlight: [['restaurant.setName(name);', 'restaurant.setLocation']]},
            4: {reveal: '.set(restaurant)', highlight: [['FirebaseServices.getInstance().getDb()', '.set(restaurant)']]},
            5: {reveal: 'all', highlight: [['if (onSavedListener != null)', 'dismiss();']]},
          }}
        />
      </Appear>

      <Appear at={6} from="right" distance={80} style={{left: 1290, top: -20}}>
        <Phone scale={0.92}>
          <ActivityShell>
            <ListScreen
              items={items}
              highlightIndex={ROW}
              highlight={saved ? 1 - progress(frame, at(5, 0.85), 10) : 0}
              pressed="update"
              pressAmount={press(frame, updateTap)}
            />
          </ActivityShell>
          {dialogAlpha > 0 && (
            <EditDialog
              alpha={dialogAlpha}
              values={values}
              focused={beat === 3 ? 'location' : null}
              savePressed={press(frame, saveTap)}
            />
          )}
          <Toast text="Changes saved" alpha={toast} />
          <Tap x={lastTap.x} y={lastTap.y} amount={tap(frame, lastTap.at)} />
        </Phone>
      </Appear>
    </SceneFrame>
  );
};
