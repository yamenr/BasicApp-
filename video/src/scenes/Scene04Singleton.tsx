import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Appear, progress} from '../components/anim';
import {CodePanel} from '../components/CodePanel';
import {Arrow, InfoCard, Mono, Node} from '../components/Diagram';
import {SceneFrame} from '../components/SceneFrame';
import {snippet} from '../code/snippet';
import {sources} from '../code/sources';
import {useBeat, useT} from '../timeline';
import {colors, fonts, syntax} from '../theme';
import {within} from './helpers';

const code = snippet(sources.firebaseServices, 'public class FirebaseServices', '}');

// The screens around the shared instance
const SCREENS = [
  {label: 'AddRestaurantFragment', x: 40, y: 40},
  {label: 'ShowRestaurantsFragment', x: 40, y: 560},
  {label: 'EditRestaurantDialog', x: 1260, y: 40},
  {label: 'Your next screen…', labelAr: 'شاشتك التالية…', x: 1260, y: 560, dashed: true},
];
const CARD = {width: 460, height: 110};
const CENTER = {x: 880, y: 370, width: 440, height: 160};
const TOOLS = ['auth', 'db', 'storage'];

const cardCenter = (i: number) => ({x: SCREENS[i].x + CARD.width / 2, y: SCREENS[i].y + CARD.height / 2});

// The animation shown in beats 0-2 and 8
const SingletonDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT();
  const {beat, timing} = useBeat();
  const s = timing.beatStarts;
  const end = timing.durationInFrames;

  // Beat 0: every screen has its own copies. Beat 1: they merge into one.
  const merge = progress(frame, s[1] + 4, 26);
  // Beat 2: the instance starts as null, then the first call creates it
  const lazyCall = within(s, end, 2, 0.45);
  const isLazyBeat = beat === 2;
  const created = isLazyBeat ? progress(frame, lazyCall + 18, 14) : 1;
  const lastBeat = s.length - 1;
  const pulse = beat === lastBeat ? (frame - s[lastBeat]) % 45 / 45 : 0;

  return (
    <>
      {SCREENS.map((screen, i) => {
        const c = cardCenter(i);
        const toCenterX = CENTER.x + (c.x < CENTER.x ? -CENTER.width / 2 : CENTER.width / 2);
        const showArrow = beat >= 1 ? progress(frame, s[1] + 20 + i * 4, 14) : 0;
        return (
          <React.Fragment key={screen.label}>
            <Arrow
              x1={c.x < CENTER.x ? c.x + CARD.width / 2 : c.x - CARD.width / 2}
              y1={c.y}
              x2={toCenterX}
              y2={CENTER.y}
              amount={showArrow}
              color={colors.firebase}
              dashed={screen.dashed}
            />
            {/* The getInstance() call travelling to the instance */}
            {((isLazyBeat && i === 0 && frame >= lazyCall && frame < lazyCall + 30) || beat === lastBeat) && (
              <CallDot
                from={{x: c.x < CENTER.x ? c.x + CARD.width / 2 : c.x - CARD.width / 2, y: c.y}}
                to={{x: toCenterX, y: CENTER.y}}
                amount={isLazyBeat ? (frame - lazyCall) / 18 : (pulse + i * 0.25) % 1}
              />
            )}
            <Node
              x={screen.x}
              y={screen.y}
              width={CARD.width}
              height={CARD.height}
              label={screen.labelAr ? t(screen.label, screen.labelAr) : screen.label}
              color={colors.blue}
              dashed={screen.dashed}
              fontSize={28}
            />
            {/* Beat 0: each screen's own copies of the Firebase tools */}
            {TOOLS.map((tool, t) => {
              const startX = screen.x + 30 + t * 140;
              const startY = screen.y + (screen.y < CENTER.y ? CARD.height + 24 : -74);
              const x = interpolate(merge, [0, 1], [startX, CENTER.x - 60]);
              const y = interpolate(merge, [0, 1], [startY, CENTER.y - 25]);
              const alpha = progress(frame, 10 + i * 6 + t * 3, 12) * (1 - merge);
              if (alpha <= 0) return null;
              return (
                <div
                  key={tool}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: 120,
                    height: 50,
                    borderRadius: 12,
                    background: `${colors.firebaseOrange}33`,
                    border: `2px solid ${colors.firebaseOrange}`,
                    fontFamily: fonts.mono,
                    fontSize: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: alpha,
                  }}
                >
                  {tool}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}

      {beat === 0 && (
        <Appear at={s[0] + 40} style={{left: 560, top: 300, width: 640, textAlign: 'center'}}>
          <div style={{fontSize: 40, fontWeight: 800, color: colors.red}}>{t('4 screens × 3 objects', '4 شاشات × 3 كائنات')}</div>
          <div style={{fontSize: 30, color: colors.muted, marginTop: 10}}>{t('= 12 copies of the same thing', '= 12 نسخة من الشيء نفسه')}</div>
        </Appear>
      )}

      {beat >= 1 && (
        <>
          {/* The empty "null" slot, shown while the lazy instance is not created yet */}
          {isLazyBeat && created < 1 && (
            <Node
              x={CENTER.x - CENTER.width / 2}
              y={CENTER.y - CENTER.height / 2}
              width={CENTER.width}
              height={CENTER.height}
              label="instance = null"
              sub={t('nothing created yet', 'لم يُنشأ شيء بعد')}
              color={colors.faint}
              dashed
              mono
              alpha={1 - created}
            />
          )}
          <Node
            x={CENTER.x - CENTER.width / 2}
            y={CENTER.y - CENTER.height / 2}
            width={CENTER.width}
            height={CENTER.height}
            label="FirebaseServices"
            sub={isLazyBeat ? t('created on the first call', 'يُنشأ عند أول استدعاء') : t('the ONE shared instance', 'الكائن الوحيد المشترك')}
            color={colors.firebase}
            alpha={Math.min(progress(frame, s[1] + 14, 14), created)}
            glow={beat === lastBeat ? 0.6 + 0.4 * Math.sin(pulse * Math.PI * 2) : 0.5}
            mono
            fontSize={34}
          />
        </>
      )}
      {isLazyBeat && frame >= lazyCall && (
        <Appear at={lazyCall} style={{left: CENTER.x - 330, top: CENTER.y + 110, width: 660, textAlign: 'center', fontSize: 30}}>
          <Mono>FirebaseServices.getInstance()</Mono>
          <span style={{fontSize: 26, color: colors.muted}}> {t('← first call', '← أول استدعاء')}</span>
        </Appear>
      )}
      {beat === lastBeat && (
        <Appear at={s[lastBeat] + 10} style={{left: CENTER.x - 330, top: CENTER.y + 110, width: 660, textAlign: 'center', fontSize: 30, color: colors.muted}}>
          {t(
            <>Every <Mono>getInstance()</Mono> returns the same object</>,
            <span dir="rtl">كل استدعاء لـ <Mono>getInstance()</Mono> يُرجع الكائن نفسه</span>,
          )}
        </Appear>
      )}
    </>
  );
};

const CallDot: React.FC<{from: {x: number; y: number}; to: {x: number; y: number}; amount: number}> = ({from, to, amount}) =>
  amount < 0 || amount > 1 ? null : (
    <div
      style={{
        position: 'absolute',
        left: from.x + (to.x - from.x) * amount - 12,
        top: from.y + (to.y - from.y) * amount - 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        background: colors.firebase,
        boxShadow: `0 0 20px ${colors.firebase}`,
      }}
    />
  );

// The value of "instance" while we read the code
const StateCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {beat, timing} = useBeat();
  const s = timing.beatStarts;
  const created = beat >= 6 ? progress(frame, s[6] + 30, 14) : 0;
  const t = useT();
  const rtl = {direction: t('ltr', 'rtl')} as const;

  return (
    <div style={{width: 590}}>
      <div
        style={{
          background: colors.panel,
          border: `2px solid ${created > 0.5 ? colors.android : colors.border}`,
          borderRadius: 18,
          padding: '26px 30px',
          fontFamily: fonts.mono,
          fontSize: 28,
        }}
      >
        <div style={{color: colors.muted, fontSize: 22, marginBottom: 10, fontFamily: fonts.sans}}>{t('Right now in memory', 'الآن في الذاكرة')}</div>
        <span style={{color: colors.blue}}>instance</span> ={' '}
        <span style={{color: created > 0.5 ? colors.android : syntax.number}}>
          {created > 0.5 ? 'FirebaseServices@1' : 'null'}
        </span>
      </div>
      <div style={{marginTop: 26}} key={beat}>
        <div style={{opacity: progress(frame, s[beat] + 4, 14)}}>
          {beat === 3 && (
            <InfoCard title="static" color={colors.purple} style={rtl}>
              {t(
                <>The field belongs to the <b>class</b>, not to one object. So there is only one <Mono>instance</Mono> field for the whole app.</>,
                <>الحقل يتبع <b>الكلاس</b> نفسه، وليس كائنًا واحدًا. لذلك يوجد حقل <Mono>instance</Mono> واحد فقط في التطبيق كله.</>,
              )}
            </InfoCard>
          )}
          {beat === 4 && (
            <InfoCard title={t('The Firebase tools', 'أدوات Firebase')} color={colors.firebaseOrange} style={rtl}>
              <Mono>auth</Mono> {t('→ sign in', '← تسجيل الدخول')}<br />
              <Mono>db</Mono> {t('→ Firestore database', '← قاعدة بيانات Firestore')}<br />
              <Mono>storage</Mono> {t('→ files and images', '← الملفات والصور')}
            </InfoCard>
          )}
          {beat === 5 && (
            <InfoCard title={t('Private constructor', 'constructor من نوع private')} color={colors.red} style={rtl}>
              {t('In another class:', 'في كلاس آخر:')}<br />
              <Mono color={colors.red}>new FirebaseServices()</Mono> ✗<br />
              {t('The compiler will not allow it.', 'المترجم (compiler) لن يسمح بذلك.')}
            </InfoCard>
          )}
          {beat === 6 && (
            <InfoCard title="getInstance()" color={colors.android} style={rtl}>
              {t('1st call: instance is null → create it.', 'أول استدعاء: instance قيمته null ← ننشئه.')}<br />
              {t('Every other call: return the same one.', 'كل استدعاء بعده: نُرجع الكائن نفسه.')}
            </InfoCard>
          )}
          {beat === 7 && (
            <InfoCard title={t('Using it', 'طريقة الاستخدام')} color={colors.blue}>
              <Mono>fbs = FirebaseServices.getInstance();</Mono>
              <br />
              <Mono>fbs.getDb().collection("restaurants")</Mono>
            </InfoCard>
          )}
        </div>
      </div>
    </div>
  );
};

export const Scene04Singleton: React.FC = () => {
  const {timing} = useBeat();
  const s = timing.beatStarts;
  const lastBeat = s.length - 1;

  return (
    <SceneFrame>
      <Appear at={0} out={s[3]} from="none">
        <SingletonDiagram />
      </Appear>

      <Appear at={s[3]} out={s[lastBeat]} from="left" style={{left: 0, top: 0}}>
        <CodePanel
          snippet={code}
          width={1120}
          height={740}
          steps={{
            3: {reveal: 'private static FirebaseServices instance;', highlight: ['private static FirebaseServices instance;']},
            4: {reveal: 'private final FirebaseStorage storage;', highlight: [['private final FirebaseAuth auth;', 'private final FirebaseStorage storage;']]},
            5: {reveal: ['private FirebaseServices() {', '}'], highlight: [['private FirebaseServices() {', '}']]},
            6: {reveal: ['return instance;', '}'], highlight: [['public static FirebaseServices getInstance()', 'return instance;']]},
            7: {reveal: 'all', highlight: [['public FirebaseAuth getAuth()', 'return storage;']]},
          }}
        />
      </Appear>
      <Appear at={s[3] + 6} out={s[lastBeat]} from="right" style={{left: 1170, top: 0}}>
        <StateCard />
      </Appear>

      <Appear at={s[lastBeat]} from="none">
        <SingletonDiagram />
      </Appear>
    </SceneFrame>
  );
};
