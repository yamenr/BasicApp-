import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Appear, progress} from '../components/anim';
import {SceneFrame} from '../components/SceneFrame';
import {useBeat} from '../timeline';
import {colors, fonts} from '../theme';

const POINTS = [
  {text: 'Restaurant: a model class for Firestore', color: colors.blue},
  {text: 'FirebaseServices: a lazy singleton', color: colors.firebase},
  {text: 'One activity, three fragments, two dialogs', color: colors.android},
  {text: 'Storage + Firestore + RecyclerView', color: colors.firebaseOrange},
];

const FILES = [
  'Restaurant.java',
  'FirebaseServices.java',
  'MainActivity.java',
  'AdminFragment.java',
  'AddRestaurantFragment.java',
  'ShowRestaurantsFragment.java',
  'RestaurantAdapter.java',
  'EditRestaurantDialog.java',
];

export const Scene11Summary: React.FC = () => {
  const frame = useCurrentFrame();
  const {timing} = useBeat();
  const s = timing.beatStarts;
  const last = s.length - 1;

  return (
    <SceneFrame>
      <Appear at={4} out={s[last]} from="up" style={{left: 0, top: 0, width: 1760}}>
        <div style={{fontSize: 96, fontWeight: 800, letterSpacing: -2}}>
          Great <span style={{color: colors.android}}>job!</span>
        </div>
      </Appear>
      {POINTS.map((point, i) => {
        const p = progress(frame, s[i + 1] ?? timing.durationInFrames, 14);
        return (
          <Appear key={point.text} at={s[i + 1]} out={s[last]} from="left" style={{left: 0, top: 170 + i * 130, width: 1400}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  background: point.color,
                  color: colors.bg,
                  fontSize: 40,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${0.6 + 0.4 * p})`,
                }}
              >
                ✓
              </div>
              <div style={{fontSize: 48, fontWeight: 700}}>{point.text}</div>
            </div>
          </Appear>
        );
      })}

      {/* End screen: where the reference code is */}
      <Appear at={s[last]} from="scale" style={{left: 0, top: 0, width: 1760, height: 740}}>
        <div style={{display: 'flex', gap: 60, alignItems: 'center', height: 740}}>
          <div style={{flex: 1}}>
            <div style={{fontSize: 30, color: colors.android, fontWeight: 800, letterSpacing: 3}}>REFERENCE CODE</div>
            <div style={{fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 16}}>
              Try it yourself!
            </div>
            <div style={{fontSize: 34, color: colors.muted, marginTop: 30, lineHeight: 1.5}}>
              1. Open <span style={{fontFamily: fonts.mono, color: colors.firebase}}>android-app</span> in Android Studio
              <br />
              2. Add your own <span style={{fontFamily: fonts.mono, color: colors.firebase}}>google-services.json</span>
              <br />
              3. Run it, then change it!
            </div>
          </div>
          <div
            style={{
              width: 700,
              background: colors.panel,
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: '30px 36px',
              fontFamily: fonts.mono,
              fontSize: 26,
              lineHeight: 1.75,
            }}
          >
            <div style={{color: colors.blue}}>▸ android-app/</div>
            <div style={{color: colors.blue, paddingLeft: 32}}>▸ app/src/main/java/…/</div>
            {FILES.map((file, i) => (
              <div key={file} style={{paddingLeft: 64, opacity: progress(frame, s[last] + 10 + i * 4, 10)}}>
                {file}
              </div>
            ))}
            <div style={{color: colors.muted, paddingLeft: 32}}>README.md</div>
          </div>
        </div>
      </Appear>
    </SceneFrame>
  );
};
