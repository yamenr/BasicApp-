import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  ActivityShell,
  AddFormScreen,
  AdminHomeScreen,
  ConfirmDialog,
  EditDialog,
  ListScreen,
  Phone,
  RestaurantItem,
  SAMPLE_RESTAURANTS,
  Tap,
  Toast,
} from '../components/AppUI';
import {Appear, progress} from '../components/anim';
import {SceneFrame} from '../components/SceneFrame';
import {useBeat} from '../timeline';
import {colors, fonts} from '../theme';
import {press, tap, typed, within} from './helpers';

const NEW: RestaurantItem = {name: 'Taco Fiesta', type: 'Mexican', location: 'River Street', color: '#D1495B'};
const DESCRIPTION = 'Fresh tacos and burritos';
const NEW_LOCATION = 'Market Square';
const ROW = 4;

const USER_STEPS = ['Open the app', 'Tap “Add a restaurant”', 'Fill in the form, tap Add', 'See it in the list', 'Update the location', 'Delete it'];

export const Scene10Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const {beat, timing} = useBeat();
  const s = timing.beatStarts;
  const end = timing.durationInFrames;
  const at = (b: number, f: number) => within(s, end, b, f);

  // Every tap in the demo, in order
  const t = {
    goAdd: at(1, 0.5),
    logo: at(2, 0.06),
    add: at(2, 0.9),
    update: at(4, 0.12),
    save: at(4, 0.75),
    del: at(5, 0.12),
    yes: at(5, 0.5),
  };
  const taps = [
    {x: 195, y: 468, at: t.goAdd},
    {x: 195, y: 233, at: t.logo},
    {x: 195, y: 536, at: t.add},
    {x: 339, y: 163 + ROW * 108, at: t.update},
    {x: 318, y: 500, at: t.save},
    {x: 339, y: 201 + ROW * 108, at: t.del},
    {x: 312, y: 438, at: t.yes},
  ];
  const lastTap = [...taps].reverse().find((x) => frame >= x.at) ?? taps[0];

  // Which screen is in the container
  const toList = at(3, 0.3);
  const screen = frame < t.goAdd + 8 ? 'admin' : frame < toList ? 'add' : 'list';
  const screenIn = progress(frame, screen === 'add' ? t.goAdd + 8 : screen === 'list' ? toList : 0, 10);

  const form = {
    name: typed(NEW.name, frame, at(2, 0.16), at(2, 0.32)),
    type: typed(NEW.type, frame, at(2, 0.35), at(2, 0.46)),
    description: typed(DESCRIPTION, frame, at(2, 0.49), at(2, 0.68)),
    location: typed(NEW.location, frame, at(2, 0.71), at(2, 0.84)),
  };
  const focused = frame < at(2, 0.16) ? null
    : frame < at(2, 0.35) ? 'name'
    : frame < at(2, 0.49) ? 'type'
    : frame < at(2, 0.71) ? 'description'
    : frame < t.add ? 'location'
    : null;

  const editLocation = frame < at(4, 0.32) ? NEW.location : typed(NEW_LOCATION, frame, at(4, 0.36), at(4, 0.62));
  const saved = frame >= t.save + 6;
  const items = [...SAMPLE_RESTAURANTS.slice(0, 4), saved ? {...NEW, location: NEW_LOCATION} : NEW];

  const editAlpha = progress(frame, t.update + 8, 10) * (1 - progress(frame, t.save + 6, 8));
  const confirmAlpha = progress(frame, t.del + 8, 10) * (1 - progress(frame, t.yes + 6, 8));
  const removing = progress(frame, t.yes + 12, 18);

  const toasts = [
    {text: 'Restaurant added!', alpha: progress(frame, t.add + 12, 8) * (1 - progress(frame, at(3, 0.7), 8))},
    {text: 'Changes saved', alpha: progress(frame, t.save + 10, 8) * (1 - progress(frame, at(4, 0.97), 6))},
    {text: 'Restaurant deleted', alpha: progress(frame, t.yes + 20, 8) * (1 - progress(frame, end - 20, 8))},
  ];

  const logs = [
    {at: t.add + 14, service: 'Storage', color: colors.firebase, text: 'upload logos/k3J9xQ.jpg'},
    {at: t.add + 30, service: 'Firestore', color: colors.firebaseOrange, text: 'add restaurants/k3J9xQ'},
    {at: t.save + 8, service: 'Firestore', color: colors.firebaseOrange, text: 'set location = "Market Square"'},
    {at: t.yes + 10, service: 'Firestore', color: colors.firebaseOrange, text: 'delete restaurants/k3J9xQ'},
  ];

  return (
    <SceneFrame>
      {/* Left: what the user does */}
      <div style={{position: 'absolute', left: 0, top: 20, width: 560}}>
        <div style={{fontSize: 26, color: colors.muted, fontWeight: 700, letterSpacing: 2, marginBottom: 20}}>THE USER</div>
        {USER_STEPS.map((step, i) => {
          const shown = progress(frame, s[i] ?? end, 12);
          const active = beat === i;
          return (
            <div
              key={step}
              style={{
                opacity: shown * (active ? 1 : 0.5),
                fontSize: 30,
                fontWeight: active ? 800 : 600,
                padding: '14px 0 14px 20px',
                borderLeft: `5px solid ${active ? colors.android : colors.border}`,
                marginBottom: 8,
              }}
            >
              {step}
            </div>
          );
        })}
      </div>

      {/* Center: the phone */}
      <Appear at={4} from="scale" style={{left: 692, top: -10}}>
        <Phone scale={0.9}>
          <ActivityShell>
            <div style={{position: 'absolute', inset: 0, opacity: screenIn}}>
              {screen === 'admin' && <AdminHomeScreen />}
              {screen === 'add' && (
                <AddFormScreen logo={frame >= t.logo + 12 ? NEW : null} values={form} focused={focused} addPressed={press(frame, t.add)} />
              )}
              {screen === 'list' && (
                <ListScreen
                  items={items}
                  highlightIndex={ROW}
                  highlight={beat === 3 ? progress(frame, toList + 8, 10) : 0}
                  pressed={frame >= t.del ? 'delete' : 'update'}
                  pressAmount={Math.max(press(frame, t.update), press(frame, t.del))}
                  removing={{index: ROW, amount: removing}}
                />
              )}
            </div>
          </ActivityShell>
          {editAlpha > 0 && (
            <EditDialog
              alpha={editAlpha}
              values={{name: NEW.name, type: NEW.type, description: DESCRIPTION, location: editLocation}}
              focused={frame >= at(4, 0.32) ? 'location' : null}
              savePressed={press(frame, t.save)}
            />
          )}
          {confirmAlpha > 0 && (
            <ConfirmDialog alpha={confirmAlpha} name={NEW.name} pressed="yes" pressAmount={press(frame, t.yes)} />
          )}
          {toasts.map((toast) => (
            <Toast key={toast.text} text={toast.text} alpha={toast.alpha} />
          ))}
          <Tap x={lastTap.x} y={lastTap.y} amount={tap(frame, lastTap.at)} />
        </Phone>
      </Appear>

      {/* Right: what happens in Firebase */}
      <div style={{position: 'absolute', left: 1180, top: 20, width: 580}}>
        <div style={{fontSize: 26, color: colors.muted, fontWeight: 700, letterSpacing: 2, marginBottom: 20}}>FIREBASE</div>
        {logs.map((log) => {
          const p = progress(frame, log.at, 12);
          if (p <= 0) return null;
          return (
            <div
              key={log.text}
              style={{
                opacity: p,
                transform: `translateX(${(1 - p) * 30}px)`,
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderLeft: `6px solid ${log.color}`,
                borderRadius: 14,
                padding: '16px 20px',
                marginBottom: 16,
              }}
            >
              <div style={{fontSize: 24, fontWeight: 800, color: log.color}}>{log.service}</div>
              <div style={{fontFamily: fonts.mono, fontSize: 22, marginTop: 6}}>{log.text}</div>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
