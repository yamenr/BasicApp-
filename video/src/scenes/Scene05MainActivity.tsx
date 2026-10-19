import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  ActivityShell,
  AddFormScreen,
  AdminHomeScreen,
  ListScreen,
  Phone,
  SAMPLE_RESTAURANTS,
  Tap,
} from '../components/AppUI';
import {Appear, progress} from '../components/anim';
import {CodePanel} from '../components/CodePanel';
import {Node} from '../components/Diagram';
import {SceneFrame} from '../components/SceneFrame';
import {snippet} from '../code/snippet';
import {sources} from '../code/sources';
import {useBeat, useT} from '../timeline';
import {colors} from '../theme';
import {press, tap, within} from './helpers';

const layoutXml = snippet(sources.activityMainXml, '<LinearLayout');
const mainActivity = snippet(sources.mainActivity, 'public class MainActivity', '}');

type Screen = 'empty' | 'admin' | 'add' | 'show';

const SCREEN_LABEL: Record<Screen, string> = {
  empty: '',
  admin: 'AdminFragment',
  add: 'AddRestaurantFragment',
  show: 'ShowRestaurantsFragment',
};

const BUTTON = {add: {x: 100, y: 90}, show: {x: 289, y: 90}};

const Content: React.FC<{screen: Screen}> = ({screen}) =>
  screen === 'admin' ? <AdminHomeScreen />
  : screen === 'add' ? <AddFormScreen />
  : screen === 'show' ? <ListScreen items={SAMPLE_RESTAURANTS} />
  : null;

// A list of [frame, screen, button tapped] changes, played in order
type Swap = {at: number; screen: Screen; button?: 'add' | 'show'};

const usePhoneState = (swaps: Swap[]) => {
  const frame = useCurrentFrame();
  let current: Screen = 'empty';
  let previous: Screen = 'empty';
  let swapAt = -1000;
  let lastTap: Swap | null = null;
  for (const swap of swaps) {
    if (frame >= swap.at) {
      previous = current;
      current = swap.screen;
      swapAt = swap.at;
      if (swap.button) lastTap = swap;
    }
  }
  return {frame, current, previous, swapAt, lastTap};
};

export const Scene05MainActivity: React.FC = () => {
  const {beat, timing} = useBeat();
  const t = useT();
  const s = timing.beatStarts;
  const end = timing.durationInFrames;
  const at = (b: number, f: number) => within(s, end, b, f);

  // Taps are 8 frames before each swap, so the press shows first
  const swaps: Swap[] = [
    {at: at(1, 0.15), screen: 'admin'},
    {at: at(1, 0.45), screen: 'add'},
    {at: at(1, 0.75), screen: 'show'},
    {at: at(3, 0.2), screen: 'add', button: 'add'},
    {at: at(3, 0.65), screen: 'show', button: 'show'},
    {at: at(4, 0.2), screen: 'admin'},
    {at: at(5, 0.5), screen: 'add', button: 'add'},
    {at: at(6, 0.12), screen: 'add', button: 'add'},
    {at: at(6, 0.42), screen: 'show', button: 'show'},
    {at: at(6, 0.72), screen: 'add', button: 'add'},
  ];
  const {frame, current, previous, swapAt, lastTap} = usePhoneState(swaps);
  const swapP = progress(frame, swapAt, 14);
  const tapAt = lastTap ? lastTap.at - 8 : -1000;
  const containerOutline = beat <= 1 ? 1 : beat === 5 ? progress(frame, s[5], 12) : 0;

  return (
    <SceneFrame>
      {/* Beat 0: the layout file */}
      <Appear at={2} out={s[1]} from="left" style={{left: 0, top: 0}}>
        <CodePanel
          snippet={layoutXml}
          width={1120}
          height={740}
          maxFontSize={24}
          steps={{
            0: {
              reveal: 'all',
              highlight: [
                ['android:id="@+id/btnAdd"', 'android:text="Add" />'],
                ['android:id="@+id/btnShow"', 'android:text="Show" />'],
                ['android:id="@+id/fragmentContainer"', 'android:layout_weight="1" />'],
              ],
            },
          }}
          accent={colors.android}
        />
      </Appear>

      {/* Beat 1 and 6: the three fragments, like slides */}
      {(beat === 1 || beat === 6) && (
        <div style={{position: 'absolute', left: 60, top: 60}}>
          {(['admin', 'add', 'show'] as Screen[]).map((screen, i) => {
            const active = current === screen;
            return (
              <Appear key={screen} at={s[beat] + i * 6} style={{left: 0, top: i * 200}}>
                <Node
                  x={0}
                  y={0}
                  width={760}
                  height={150}
                  label={SCREEN_LABEL[screen]}
                  sub={active ? t('in the container now', 'داخل الحاوية الآن') : t('waiting', 'ينتظر')}
                  color={active ? colors.firebaseOrange : colors.border}
                  glow={active ? 0.6 : 0}
                  fontSize={36}
                />
              </Appear>
            );
          })}
        </div>
      )}

      {/* Beats 2-5: MainActivity.java */}
      <Appear at={s[2]} out={s[6]} from="left" style={{left: 0, top: 0}}>
        <CodePanel
          snippet={mainActivity}
          width={1120}
          height={740}
          steps={{
            2: {reveal: 'Button btnShow = findViewById', highlight: [['setContentView', 'Button btnShow']]},
            3: {reveal: 'btnShow.setOnClickListener', highlight: ['btnAdd.setOnClickListener', 'btnShow.setOnClickListener']},
            4: {reveal: ['if (savedInstanceState == null)', '}'], highlight: [['if (savedInstanceState == null)', '}']]},
            5: {reveal: 'all', highlight: [['public void showFragment', '.commit();']]},
          }}
        />
      </Appear>

      {/* The phone, always on the right */}
      <Appear at={6} from="right" distance={80} style={{left: 1290, top: -20}}>
        <Phone scale={0.92}>
          <ActivityShell
            pressed={lastTap?.button ?? null}
            pressAmount={press(frame, tapAt)}
            showContainerOutline={containerOutline}
          >
            {/* Old fragment slides out to the left, new one slides in from the right */}
            {swapP < 1 && (
              <div style={{position: 'absolute', inset: 0, transform: `translateX(${-swapP * 100}%)`}}>
                <Content screen={previous} />
              </div>
            )}
            <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - swapP) * 100}%)`}}>
              <Content screen={current} />
            </div>
          </ActivityShell>
          {lastTap?.button && <Tap {...BUTTON[lastTap.button]} amount={tap(frame, tapAt)} />}
        </Phone>
      </Appear>

      {/* Labels for the parts of the screen */}
      {beat === 0 && (
        <>
          <Appear at={s[0] + 30} from="right" style={{left: 1135, top: 130, whiteSpace: 'nowrap'}}>
            <Label text={t('Buttons', 'الأزرار')} color={colors.android} />
          </Appear>
          <Appear at={s[0] + 45} from="right" style={{left: 1080, top: 420, whiteSpace: 'nowrap'}}>
            <Label text="FrameLayout" color={colors.firebaseOrange} />
          </Appear>
        </>
      )}
    </SceneFrame>
  );
};

const Label: React.FC<{text: string; color: string}> = ({text, color}) => (
  <div style={{fontSize: 26, fontWeight: 700, color}}>
    {text} {'→'}
  </div>
);
