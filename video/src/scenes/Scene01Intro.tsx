import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ActivityShell, ListScreen, Phone, SAMPLE_RESTAURANTS} from '../components/AppUI';
import {Appear, progress} from '../components/anim';
import {Arrow, Chip, Node} from '../components/Diagram';
import {SceneFrame} from '../components/SceneFrame';
import {useSceneTiming, useT} from '../timeline';
import {colors} from '../theme';

const FRAGMENTS = [
  {label: 'AdminFragment', sub: ['home', 'الرئيسية'], x: 80},
  {label: 'AddRestaurantFragment', sub: ['add screen', 'شاشة الإضافة'], x: 645},
  {label: 'ShowRestaurantsFragment', sub: ['show screen', 'شاشة العرض'], x: 1210},
];
const DIALOGS = [
  {label: 'EditRestaurantDialog', sub: ['update', 'التعديل'], x: 960, width: 400},
  {label: 'Delete AlertDialog', sub: ['are you sure?', 'هل أنت متأكد؟'], x: 1400, width: 360},
];
const FIREBASE = [
  {label: 'Authentication', x: 300},
  {label: 'Firestore', x: 730},
  {label: 'Storage', x: 1160},
];

export const Scene01Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {beatStarts: s} = useSceneTiming();
  const t = useT();
  const d = (at: number, duration = 18) => progress(frame, at, duration);

  return (
    <SceneFrame>
      {/* Beats 0-2: title and app preview */}
      <Appear at={0} out={s[3]} from="left" style={{left: 0, top: 70, width: 1150}}>
        {t(
          <div style={{fontSize: 104, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2}}>
            Build an Android app
            <br />
            with <span style={{color: colors.android}}>Java</span> +{' '}
            <span style={{color: colors.firebase}}>Firebase</span>
          </div>,
          <div dir="rtl" style={{fontSize: 96, fontWeight: 800, lineHeight: 1.3, textAlign: 'right'}}>
            نبني تطبيق Android
            <br />
            باستخدام <span style={{color: colors.android}}>Java</span> و{' '}
            <span style={{color: colors.firebase}}>Firebase</span>
          </div>,
        )}
        <div dir={t('ltr', 'rtl')} style={{fontSize: 36, color: colors.muted, marginTop: 28, textAlign: t('left', 'right')}}>
          {t('A restaurant admin app, step by step', 'تطبيق لإدارة المطاعم، خطوة بخطوة')}
        </div>
      </Appear>
      <Appear
        at={s[1]}
        out={s[3]}
        style={{left: 0, top: 470, width: 1150, display: 'flex', gap: 16, flexWrap: 'wrap', direction: t('ltr', 'rtl')}}
      >
        {t(['name', 'type', 'description', 'location', 'logo'], ['الاسم', 'النوع', 'الوصف', 'الموقع', 'الشعار']).map((f) => (
          <Chip key={f} label={f} color={colors.blue} />
        ))}
      </Appear>
      <Appear at={s[2]} out={s[3]} style={{left: 0, top: 570, width: 1150, display: 'flex', gap: 16, direction: t('ltr', 'rtl')}}>
        <Chip label="Add" color={colors.android} />
        <Chip label="Show" color={colors.android} />
        <Chip label="Update" color={colors.firebase} />
        <Chip label="Delete" color={colors.red} />
      </Appear>
      <Appear at={6} out={s[3]} from="right" distance={80} style={{left: 1290, top: -10}}>
        <Phone scale={0.9}>
          <ActivityShell>
            <ListScreen items={SAMPLE_RESTAURANTS} />
          </ActivityShell>
        </Phone>
      </Appear>

      {/* Beats 3-7: the app's plan, built level by level */}
      <Node x={630} y={0} width={500} height={90} label="MainActivity" sub="Activity" color={colors.android} alpha={d(s[3] + 8)} />

      {FRAGMENTS.map((f, i) => (
        <React.Fragment key={f.label}>
          <Arrow x1={880} y1={90} x2={f.x + 235} y2={150} amount={d(s[4] + i * 5)} color={colors.android} />
          <Node x={f.x} y={150} width={470} height={90} label={f.label} sub={t(f.sub[0], f.sub[1])} color={colors.blue} alpha={d(s[4] + 6 + i * 5)} fontSize={28} />
        </React.Fragment>
      ))}

      {DIALOGS.map((dlg, i) => (
        <React.Fragment key={dlg.label}>
          <Arrow x1={1445} y1={240} x2={dlg.x + dlg.width / 2} y2={290} amount={d(s[5] + i * 5)} color={colors.purple} />
          <Node x={dlg.x} y={290} width={dlg.width} height={90} label={dlg.label} sub={t(dlg.sub[0], dlg.sub[1])} color={colors.purple} alpha={d(s[5] + 6 + i * 5)} fontSize={26} />
        </React.Fragment>
      ))}

      <Arrow x1={880} y1={240} x2={880} y2={440} amount={d(s[6], 20)} color={colors.firebase} dashed />
      <Arrow x1={1160} y1={380} x2={1060} y2={440} amount={d(s[6] + 6, 20)} color={colors.firebase} dashed />
      <Arrow x1={1580} y1={380} x2={1130} y2={450} amount={d(s[6] + 10, 20)} color={colors.firebase} dashed />
      <Node
        x={630}
        y={440}
        width={500}
        height={90}
        label="FirebaseServices"
        sub={t('one shared helper', 'كلاس مساعد مشترك')}
        color={colors.firebase}
        alpha={d(s[6] + 4)}
        glow={d(s[6] + 20, 20) * (1 - d(s[7] + 10, 20))}
        mono
      />

      {FIREBASE.map((f, i) => (
        <React.Fragment key={f.label}>
          <Arrow x1={880} y1={530} x2={f.x + 150} y2={600} amount={d(s[7] + i * 5)} color={colors.firebaseOrange} />
          <Node x={f.x} y={600} width={300} height={90} label={f.label} color={colors.firebaseOrange} alpha={d(s[7] + 6 + i * 5)} fontSize={28} />
        </React.Fragment>
      ))}
    </SceneFrame>
  );
};
