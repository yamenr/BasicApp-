import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Appear, progress} from '../components/anim';
import {SceneFrame} from '../components/SceneFrame';
import {useBeat, useT} from '../timeline';
import {colors, fonts} from '../theme';

const POINTS = [
  {text: 'Restaurant: a model class for Firestore', textAr: 'Restaurant: كلاس model يعمل مع Firestore', color: colors.blue},
  {text: 'FirebaseServices: a lazy singleton', textAr: 'FirebaseServices: الـ Lazy Singleton', color: colors.firebase},
  {text: 'One activity, three fragments, two dialogs', textAr: 'Activity واحدة، وثلاثة Fragments، ونافذتان', color: colors.android},
  {text: 'Storage + Firestore + RecyclerView', textAr: 'Storage و Firestore و RecyclerView', color: colors.firebaseOrange},
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
  const t = useT();
  const dir = t('ltr', 'rtl');
  const s = timing.beatStarts;
  const last = s.length - 1;

  return (
    <SceneFrame>
      <Appear at={4} out={s[last]} from="up" style={{left: 0, top: 0, width: 1760}}>
        <div dir={dir} style={{fontSize: 96, fontWeight: 800}}>
          {t(<>Great <span style={{color: colors.android}}>job!</span></>, <><span style={{color: colors.android}}>أحسنتم!</span></>)}
        </div>
      </Appear>
      {POINTS.map((point, i) => {
        const p = progress(frame, s[i + 1] ?? timing.durationInFrames, 14);
        return (
          <Appear key={point.text} at={s[i + 1]} out={s[last]} from="left" style={{left: 0, top: 170 + i * 130, width: 1760}}>
            <div dir={dir} style={{display: 'flex', alignItems: 'center', gap: 28}}>
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
              <div style={{fontSize: 48, fontWeight: 700}}>{t(point.text, point.textAr)}</div>
            </div>
          </Appear>
        );
      })}

      {/* End screen: where the reference code is */}
      <Appear at={s[last]} from="scale" style={{left: 0, top: 0, width: 1760, height: 740}}>
        <div dir={dir} style={{display: 'flex', gap: 60, alignItems: 'center', height: 740}}>
          <div style={{flex: 1}}>
            <div style={{fontSize: 30, color: colors.android, fontWeight: 800, letterSpacing: 3}}>{t('REFERENCE CODE', 'الكود المرجعي')}</div>
            <div style={{fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 16}}>
              {t('Try it yourself!', 'جرّبه بنفسك!')}
            </div>
            <div style={{fontSize: 34, color: colors.muted, marginTop: 30, lineHeight: 1.5}}>
              {t(
                <>
                  1. Open <span style={{fontFamily: fonts.mono, color: colors.firebase}}>android-app</span> in Android Studio
                  <br />
                  2. Add your own <span style={{fontFamily: fonts.mono, color: colors.firebase}}>google-services.json</span>
                  <br />
                  3. Run it, then change it!
                </>,
                <>
                  1. افتح <span style={{fontFamily: fonts.mono, color: colors.firebase}}>android-app</span> في Android Studio
                  <br />
                  2. أضف ملف <span style={{fontFamily: fonts.mono, color: colors.firebase}}>google-services.json</span> الخاص بك
                  <br />
                  3. شغّله، ثم عدّل عليه!
                </>,
              )}
            </div>
          </div>
          <div
            style={{
              width: 700,
              direction: 'ltr',
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
