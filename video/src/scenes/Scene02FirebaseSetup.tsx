import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Appear, progress} from '../components/anim';
import {CodePanel} from '../components/CodePanel';
import {Mono} from '../components/Diagram';
import {SceneFrame} from '../components/SceneFrame';
import {snippet} from '../code/snippet';
import {sources} from '../code/sources';
import {useBeat} from '../timeline';
import {colors, fonts} from '../theme';
import {typed, within} from './helpers';

const STEPS = [
  'Create a Firebase project',
  'Add an Android app',
  'Add google-services.json',
  'Turn on Firestore + Storage',
  'Add the libraries',
];

const gradle = snippet(sources.appBuildGradle, 'dependencies {', '}');

const RIGHT = {left: 720, top: 0, width: 1040, height: 740};

const Browser: React.FC<{url: string; children: React.ReactNode}> = ({url, children}) => (
  <div
    style={{
      width: RIGHT.width,
      height: 600,
      borderRadius: 20,
      overflow: 'hidden',
      background: '#F5F7FA',
      boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
    }}
  >
    <div style={{height: 60, background: '#E3E7ED', display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px'}}>
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
        <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
      ))}
      <div
        style={{
          marginLeft: 20,
          flex: 1,
          height: 38,
          borderRadius: 19,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          fontSize: 22,
          color: '#4A5568',
        }}
      >
        {url}
      </div>
    </div>
    <div style={{padding: 40, color: '#1D2433'}}>{children}</div>
  </div>
);

const Product: React.FC<{name: string; text: string; color: string}> = ({name, text, color}) => (
  <div
    style={{
      flex: 1,
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 20,
      padding: 30,
      borderTop: `6px solid ${color}`,
    }}
  >
    <div style={{fontSize: 34, fontWeight: 800}}>{name}</div>
    <div style={{fontSize: 26, color: colors.muted, marginTop: 10, lineHeight: 1.4}}>{text}</div>
  </div>
);

const Toggle: React.FC<{name: string; on: number}> = ({name, on}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 20,
      padding: '30px 36px',
      marginBottom: 24,
    }}
  >
    <div>
      <div style={{fontSize: 36, fontWeight: 800}}>{name}</div>
      <div style={{fontSize: 26, color: on > 0.5 ? colors.android : colors.muted, marginTop: 6}}>
        {on > 0.5 ? 'Enabled · test mode' : 'Not enabled'}
      </div>
    </div>
    <div style={{width: 96, height: 52, borderRadius: 26, background: on > 0.5 ? colors.android : colors.border, position: 'relative'}}>
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: 6 + 44 * on,
          width: 40,
          height: 40,
          borderRadius: 20,
          background: '#fff',
        }}
      />
    </div>
  </div>
);

export const Scene02FirebaseSetup: React.FC = () => {
  const frame = useCurrentFrame();
  const {beat, timing} = useBeat();
  const s = timing.beatStarts;
  const end = timing.durationInFrames;

  return (
    <SceneFrame>
      {/* Left: the checklist of steps */}
      <div style={{position: 'absolute', left: 0, top: 10, width: 640}}>
        {STEPS.map((step, i) => {
          const stepBeat = i + 1;
          const shown = progress(frame, s[stepBeat] ?? end, 14);
          const active = beat === stepBeat;
          const done = beat > stepBeat;
          if (shown <= 0) return null;
          return (
            <div
              key={step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                padding: '22px 26px',
                marginBottom: 18,
                borderRadius: 18,
                background: active ? colors.surfaceHi : colors.surface,
                border: `2px solid ${active ? colors.firebase : colors.border}`,
                opacity: shown,
                transform: `translateX(${(1 - shown) * -30}px)`,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 26,
                  background: done ? colors.android : active ? colors.firebase : colors.border,
                  color: colors.bg,
                }}
              >
                {done ? '✓' : stepBeat}
              </div>
              <div style={{fontSize: 30, fontWeight: 700, color: active || done ? colors.text : colors.muted}}>{step}</div>
            </div>
          );
        })}
      </div>

      {/* Beat 0: what Firebase is */}
      <Appear at={0} out={s[1]} style={{left: 0, top: 40, width: 1760}}>
        <div style={{fontSize: 64, fontWeight: 800, marginBottom: 40}}>
          <span style={{color: colors.firebase}}>Firebase</span> gives our app a backend in the cloud
        </div>
        <div style={{display: 'flex', gap: 30}}>
          <Product name="Firestore" text="A database that stores our restaurants as documents." color={colors.firebaseOrange} />
          <Product name="Storage" text="Stores files, like the restaurant logos." color={colors.firebase} />
          <Product name="Authentication" text="Signs users in (ready for later)." color={colors.blue} />
        </div>
      </Appear>

      {/* Beat 1: add a project */}
      <Appear at={s[1]} out={s[2]} from="right" style={{...RIGHT}}>
        <Browser url="console.firebase.google.com">
          <div style={{fontSize: 40, fontWeight: 800}}>Your Firebase projects</div>
          <div style={{display: 'flex', gap: 30, marginTop: 36}}>
            <div
              style={{
                width: 300,
                height: 200,
                borderRadius: 18,
                border: '3px dashed #F57C00',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
                fontWeight: 700,
                color: '#F57C00',
              }}
            >
              <div style={{fontSize: 64, lineHeight: 1}}>+</div>
              Add project
            </div>
            <div style={{flex: 1}}>
              <div style={{fontSize: 24, color: '#5F6B7A'}}>Project name</div>
              <div
                style={{
                  marginTop: 12,
                  height: 70,
                  borderRadius: 12,
                  border: '2px solid #1A73E8',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 20px',
                  fontSize: 30,
                  fontFamily: fonts.mono,
                }}
              >
                {typed('restaurant-admin', frame, within(s, end, 1, 0.3), within(s, end, 1, 0.8))}
              </div>
            </div>
          </div>
        </Browser>
      </Appear>

      {/* Beat 2: add an Android app */}
      <Appear at={s[2]} out={s[3]} from="right" style={{...RIGHT}}>
        <Browser url="console.firebase.google.com/project/restaurant-admin">
          <div style={{fontSize: 40, fontWeight: 800}}>Add Firebase to your Android app</div>
          <div style={{fontSize: 24, color: '#5F6B7A', marginTop: 36}}>Android package name</div>
          <div
            style={{
              marginTop: 12,
              height: 70,
              borderRadius: 12,
              border: '2px solid #1A73E8',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              padding: '0 20px',
              fontSize: 30,
              fontFamily: fonts.mono,
            }}
          >
            {typed('com.example.restaurantadmin', frame, within(s, end, 2, 0.4), within(s, end, 2, 0.85))}
          </div>
          <div style={{fontSize: 22, color: '#5F6B7A', marginTop: 16}}>
            It must match <b>applicationId</b> in app/build.gradle
          </div>
        </Browser>
      </Appear>

      {/* Beat 3: google-services.json goes into app/ */}
      <Appear at={s[3]} out={s[4]} from="right" style={{...RIGHT}}>
        <div style={{background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: 20, padding: '36px 44px', fontFamily: fonts.mono, fontSize: 34, lineHeight: 1.9}}>
          {[
            {name: 'android-app/', depth: 0},
            {name: 'app/', depth: 1},
            {name: 'google-services.json', depth: 2, hot: true},
            {name: 'build.gradle', depth: 2},
            {name: 'src/', depth: 2},
            {name: 'build.gradle', depth: 1},
            {name: 'settings.gradle', depth: 1},
          ].map((row, i) => {
            const hot = row.hot ? progress(frame, within(s, end, 3, 0.35), 16) : 0;
            return (
              <div key={i} style={{paddingLeft: row.depth * 50, display: 'flex', alignItems: 'center', gap: 16}}>
                <span style={{color: row.name.endsWith('/') ? colors.blue : colors.muted}}>
                  {row.name.endsWith('/') ? '▸' : '•'}
                </span>
                <span
                  style={{
                    color: row.hot ? colors.firebase : colors.text,
                    opacity: row.hot ? hot : 1,
                    transform: row.hot ? `translateX(${(1 - hot) * 80}px)` : undefined,
                    fontWeight: row.hot ? 700 : 400,
                  }}
                >
                  {row.name}
                </span>
                {row.hot && hot > 0.9 && <span style={{color: colors.android, fontSize: 26}}>← put it here</span>}
              </div>
            );
          })}
        </div>
      </Appear>

      {/* Beat 4: turn on Firestore and Storage */}
      <Appear at={s[4]} out={s[5]} from="right" style={{...RIGHT}}>
        <Toggle name="Cloud Firestore" on={progress(frame, within(s, end, 4, 0.3), 10)} />
        <Toggle name="Storage" on={progress(frame, within(s, end, 4, 0.45), 10)} />
        <div
          style={{
            background: `${colors.red}1F`,
            border: `2px solid ${colors.red}`,
            borderRadius: 18,
            padding: '22px 28px',
            fontSize: 26,
            lineHeight: 1.4,
            opacity: progress(frame, within(s, end, 4, 0.6)),
          }}
        >
          Test mode lets <b>anyone</b> read and write. Use it only while you learn.
          The rules are in <Mono>android-app/README.md</Mono>.
        </div>
      </Appear>

      {/* Beat 5: the dependencies, straight from app/build.gradle */}
      <Appear at={s[5]} from="right" style={{...RIGHT}}>
        <CodePanel
          snippet={gradle}
          width={RIGHT.width}
          height={RIGHT.height}
          maxFontSize={26}
          steps={{
            5: {
              reveal: 'all',
              highlight: [["platform('com.google.firebase:firebase-bom", "'com.google.firebase:firebase-storage'"], 'com.github.bumptech.glide'],
            },
          }}
        />
      </Appear>
    </SceneFrame>
  );
};
