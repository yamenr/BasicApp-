import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ActivityShell, ListScreen, Phone, RestaurantRow, SAMPLE_RESTAURANTS} from '../components/AppUI';
import {Appear, progress} from '../components/anim';
import {CodePanel} from '../components/CodePanel';
import {InfoCard, Mono} from '../components/Diagram';
import {SceneFrame} from '../components/SceneFrame';
import {snippet} from '../code/snippet';
import {sources} from '../code/sources';
import {useBeat} from '../timeline';
import {colors, fonts} from '../theme';

const adapter = snippet(sources.restaurantAdapter, 'public class RestaurantAdapter', '}');
const loadRestaurants = snippet(sources.showRestaurantsFragment, '// Reads every document', '    }');

const MORE_RESTAURANTS = [
  ...SAMPLE_RESTAURANTS,
  {name: 'Noodle Bar', type: 'Asian', location: 'East Lane', color: '#5C80BC'},
  {name: 'Taco Fiesta', type: 'Mexican', location: 'River Street', color: '#D1495B'},
  {name: 'Bagel Box', type: 'Bakery', location: 'North Road', color: '#C17C74'},
];

// Beat 1: five row objects are reused while the list scrolls
const RecycleDemo: React.FC<{start: number; length: number}> = ({start, length}) => {
  const frame = useCurrentFrame();
  const ROW = 120;
  const SLOTS = 5;
  const offset = interpolate(frame, [start + 20, start + length - 10], [0, ROW * 9], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const WINDOW = {top: 40, height: 4 * ROW};

  return (
    <div style={{position: 'absolute', left: 640, top: 0, width: 1120, height: 740}}>
      {/* The visible screen area */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: WINDOW.top,
          width: 560,
          height: WINDOW.height,
          border: `3px solid ${colors.android}`,
          borderRadius: 18,
          background: `${colors.android}10`,
        }}
      />
      <div style={{position: 'absolute', left: 0, top: WINDOW.top + WINDOW.height + 16, width: 560, textAlign: 'center', fontSize: 24, color: colors.android, fontWeight: 600}}>
        the screen
      </div>
      {Array.from({length: SLOTS}).map((_, slot) => {
        // Each slot is one row object. When it scrolls off the top, it moves to the bottom.
        const cycles = Math.max(0, Math.ceil((offset - slot * ROW - ROW) / (SLOTS * ROW)));
        const y = slot * ROW - offset + cycles * SLOTS * ROW;
        const data = MORE_RESTAURANTS[(slot + SLOTS * cycles) % MORE_RESTAURANTS.length];
        const visible = interpolate(y, [-ROW, -ROW * 0.4, WINDOW.height - ROW * 0.6, WINDOW.height], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <React.Fragment key={slot}>
            <div style={{position: 'absolute', left: 0, top: WINDOW.top, width: 560, height: WINDOW.height, overflow: 'hidden', borderRadius: 18}}>
              <div style={{position: 'absolute', left: 10, top: y + 6, width: 540}}>
                <div style={{transform: 'scale(1.3)', transformOrigin: 'top left', width: 415}}>
                  <RestaurantRow item={data} style={{margin: 0, height: 84}} />
                </div>
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                left: 600,
                top: WINDOW.top + y + 40,
                fontFamily: fonts.mono,
                fontSize: 26,
                color: colors.firebase,
                whiteSpace: 'nowrap',
                opacity: visible,
              }}
            >
              row object #{slot + 1} → {data.name}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Part: React.FC<{title: string; text: React.ReactNode; color: string; x: number; at: number}> = ({title, text, color, x, at}) => (
  <Appear at={at} style={{left: x, top: 120, width: 540}}>
    <InfoCard title={title} color={color} style={{height: 380}}>
      {text}
    </InfoCard>
  </Appear>
);

export const Scene07ShowFragment: React.FC = () => {
  const frame = useCurrentFrame();
  const {beat, timing} = useBeat();
  const s = timing.beatStarts;
  const end = timing.durationInFrames;
  const listIn = progress(frame, s[9] + 6, 16);

  return (
    <SceneFrame>
      {/* Beats 0-1: the list on a phone */}
      <Appear at={4} out={s[2]} from="left" style={{left: 100, top: -20}}>
        <Phone scale={0.92}>
          <ActivityShell>
            <ListScreen items={SAMPLE_RESTAURANTS} />
          </ActivityShell>
        </Phone>
      </Appear>
      <Appear at={s[0] + 20} out={s[1]} from="right" style={{left: 700, top: 160, width: 1000}}>
        <div style={{fontSize: 64, fontWeight: 800}}>RecyclerView</div>
        <div style={{fontSize: 36, color: colors.muted, marginTop: 16, lineHeight: 1.4}}>
          A scrolling list. One row for each restaurant.
        </div>
      </Appear>
      {beat === 1 && <RecycleDemo start={s[1]} length={(s[2] ?? end) - s[1]} />}

      {/* Beat 2: the three parts */}
      {beat === 2 && (
        <>
          <Part at={s[2] + 4} x={0} color={colors.blue} title="Row layout" text={<><Mono>item_restaurant.xml</Mono><br />What ONE row looks like: logo, texts and two buttons.</>} />
          <Part at={s[2] + 14} x={610} color={colors.android} title="Adapter" text={<><Mono>RestaurantAdapter</Mono><br />Makes rows, and fills each row with a restaurant.</>} />
          <Part at={s[2] + 24} x={1220} color={colors.purple} title="ViewHolder" text={<><Mono>RestaurantViewHolder</Mono><br />Keeps the views of one row, so we find them only once.</>} />
        </>
      )}

      {/* Beats 3-7: the adapter */}
      <Appear at={s[3]} out={s[8]} from="left" style={{left: 0, top: 0}}>
        <CodePanel
          snippet={adapter}
          width={1120}
          height={740}
          steps={{
            3: {reveal: 'all', highlight: [['static class RestaurantViewHolder', '=    }']]},
            4: {highlight: [['public RestaurantViewHolder onCreateViewHolder', '=    }']]},
            5: {highlight: [['public void onBindViewHolder', '=    }']]},
            6: {highlight: [['public int getItemCount()', '=    }']]},
            7: {
              highlight: [
                ['public interface OnRestaurantActionListener', '=    }'],
                ['holder.btnUpdate.setOnClickListener', 'holder.btnDelete.setOnClickListener'],
              ],
            },
          }}
          accent={colors.android}
        />
      </Appear>
      <Appear at={s[3] + 6} out={s[8]} from="right" style={{left: 1170, top: 0, width: 590}}>
        <div style={{transform: 'scale(1.5)', transformOrigin: 'top left', width: 393}}>
          <RestaurantRow item={SAMPLE_RESTAURANTS[0]} style={{margin: 0}} highlight={beat === 5 ? progress(frame, s[5], 10) : 0} />
        </div>
        <div style={{marginTop: 180}} key={beat}>
          <div style={{opacity: progress(frame, s[beat] + 4, 12)}}>
            {beat === 3 && <InfoCard title="ViewHolder" color={colors.purple}>ivLogo, tvName, tvType, tvLocation, btnUpdate, btnDelete</InfoCard>}
            {beat === 4 && <InfoCard title="onCreateViewHolder" color={colors.android}>Inflates <Mono>item_restaurant.xml</Mono> into a new row.</InfoCard>}
            {beat === 5 && <InfoCard title="onBindViewHolder" color={colors.android}>Puts restaurant number <Mono>position</Mono> into the row. Glide loads the logo from its URL.</InfoCard>}
            {beat === 6 && <InfoCard title="getItemCount" color={colors.android}><Mono>restaurants.size()</Mono> → how many rows to show.</InfoCard>}
            {beat === 7 && <InfoCard title="Clicks" color={colors.firebase}>Update → <Mono>onUpdateClick(r)</Mono><br />Delete → <Mono>onDeleteClick(r)</Mono></InfoCard>}
          </div>
        </div>
      </Appear>

      {/* Beats 8-9: loading from Firestore */}
      <Appear at={s[8]} from="left" style={{left: 0, top: 0}}>
        <CodePanel
          snippet={loadRestaurants}
          width={1120}
          height={740}
          steps={{
            8: {reveal: 'all', highlight: [['fbs.getDb().collection("restaurants").get()', 'restaurants.add(restaurant);']]},
            9: {highlight: ['adapter.notifyDataSetChanged();']},
          }}
        />
      </Appear>
      <Appear at={s[8] + 6} from="right" style={{left: 1290, top: -20}}>
        <Phone scale={0.92}>
          <ActivityShell>
            <div style={{position: 'absolute', inset: 0, opacity: listIn, transform: `translateY(${(1 - listIn) * 30}px)`}}>
              <ListScreen items={SAMPLE_RESTAURANTS} />
            </div>
            {listIn === 0 && (
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: colors.appMuted}}>
                Loading…
              </div>
            )}
          </ActivityShell>
        </Phone>
      </Appear>
    </SceneFrame>
  );
};
