import React from 'react';
import {colors, fonts} from '../theme';

/**
 * A drawn copy of the real app's screens, used inside <Phone>.
 * Sizes are in "phone pixels": the screen is 390 x 800.
 */

export const SCREEN = {width: 390, height: 800};

export type RestaurantItem = {
  name: string;
  type: string;
  location: string;
  color: string;
};

export const SAMPLE_RESTAURANTS: RestaurantItem[] = [
  {name: 'Pizza Roma', type: 'Pizza', location: 'Main Street', color: '#E4572E'},
  {name: 'Burger Hub', type: 'Burgers', location: 'City Center', color: '#F3A712'},
  {name: 'Green Bowl', type: 'Salads', location: 'Park Avenue', color: '#3FA34D'},
  {name: 'Sushi Go', type: 'Sushi', location: 'Harbor Road', color: '#2E86AB'},
  {name: 'Cafe Luna', type: 'Cafe', location: 'Old Town', color: '#8E5572'},
];

const text = (size: number, weight = 400, color = colors.appText): React.CSSProperties => ({
  fontFamily: fonts.sans,
  fontSize: size,
  fontWeight: weight,
  color,
});

export const Phone: React.FC<{
  children: React.ReactNode;
  scale?: number;
  style?: React.CSSProperties;
}> = ({children, scale = 1, style}) => (
  <div
    style={{
      position: 'absolute',
      width: SCREEN.width + 28,
      height: SCREEN.height + 28,
      borderRadius: 56,
      background: '#05070D',
      border: '3px solid #3A4562',
      boxShadow: '0 40px 90px rgba(0,0,0,0.55)',
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 14,
        top: 14,
        width: SCREEN.width,
        height: SCREEN.height,
        borderRadius: 44,
        overflow: 'hidden',
        background: colors.appBg,
      }}
    >
      <div
        style={{
          height: 34,
          background: colors.appGreenDark,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 30px',
          ...text(14, 600, '#fff'),
        }}
      >
        <span>9:41</span>
        <div style={{width: 90, height: 22, borderRadius: 11, background: '#05070D'}} />
        <span>100%</span>
      </div>
      <div style={{position: 'relative', height: SCREEN.height - 34}}>{children}</div>
    </div>
  </div>
);

export const AppBar: React.FC = () => (
  <div
    style={{
      height: 56,
      background: colors.appGreen,
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      ...text(21, 600, '#fff'),
    }}
  >
    Restaurant Admin
  </div>
);

export const AppButton: React.FC<{
  label: string;
  style?: React.CSSProperties;
  pressed?: number;
  variant?: 'filled' | 'text' | 'danger';
}> = ({label, style, pressed = 0, variant = 'filled'}) => {
  const filled = variant === 'filled';
  return (
    <div
      style={{
        height: 44,
        borderRadius: 6,
        background: filled ? colors.appGreen : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
        boxShadow: filled ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
        transform: `scale(${1 - pressed * 0.06})`,
        filter: `brightness(${1 - pressed * 0.2})`,
        ...text(15, 600, filled ? '#fff' : variant === 'danger' ? '#C62828' : colors.appGreen),
        ...style,
      }}
    >
      {label}
    </div>
  );
};

// MainActivity: the Add / Show buttons and the container below them
export const ActivityShell: React.FC<{
  children?: React.ReactNode;
  pressed?: 'add' | 'show' | null;
  pressAmount?: number;
  showContainerOutline?: number;
}> = ({children, pressed = null, pressAmount = 0, showContainerOutline = 0}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <AppBar />
    <div style={{display: 'flex', gap: 12, padding: 12}}>
      <AppButton label="Add" style={{flex: 1}} pressed={pressed === 'add' ? pressAmount : 0} />
      <AppButton label="Show" style={{flex: 1}} pressed={pressed === 'show' ? pressAmount : 0} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 124, bottom: 0, overflow: 'hidden'}}>
      {children}
      {showContainerOutline > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 6,
            border: `3px dashed ${colors.firebaseOrange}`,
            borderRadius: 10,
            opacity: showContainerOutline,
          }}
        />
      )}
    </div>
  </div>
);

export const AdminHomeScreen: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}
  >
    <div style={text(26, 700)}>Welcome, Admin</div>
    <div style={{...text(15, 400, colors.appMuted), textAlign: 'center', margin: '8px 0 30px'}}>
      Add new restaurants or manage the ones you already have.
    </div>
    <AppButton label="Add a restaurant" style={{width: '100%', height: 56}} />
    <AppButton label="Show restaurants" style={{width: '100%', height: 56, marginTop: 12}} />
  </div>
);

const Field: React.FC<{hint: string; value?: string; focused?: boolean}> = ({hint, value, focused}) => (
  <div
    style={{
      borderBottom: `2px solid ${focused ? colors.appGreen : '#9AA4B2'}`,
      padding: '10px 2px 6px',
      marginTop: 6,
      minHeight: 22,
      ...text(16, 400, value ? colors.appText : '#8A94A3'),
    }}
  >
    {value || hint}
    {focused && <span style={{color: colors.appGreen}}>|</span>}
  </div>
);

export type FormValues = {name?: string; type?: string; description?: string; location?: string};

export const Logo: React.FC<{item: Pick<RestaurantItem, 'name' | 'color'>; size: number}> = ({item, size}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.22,
      background: item.color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      ...text(size * 0.38, 800, '#fff'),
    }}
  >
    {item.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)}
  </div>
);

export const AddFormScreen: React.FC<{
  values?: FormValues;
  logo?: Pick<RestaurantItem, 'name' | 'color'> | null;
  focused?: keyof FormValues | null;
  addPressed?: number;
}> = ({values = {}, logo = null, focused = null, addPressed = 0}) => (
  <div style={{position: 'absolute', inset: 0, padding: '14px 22px'}}>
    <div style={text(22, 700)}>New restaurant</div>
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 12}}>
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: 16,
          border: logo ? 'none' : `2px dashed ${colors.appGreen}`,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {logo ? <Logo item={logo} size={110} /> : <ImageIcon />}
      </div>
      <div style={{...text(13, 400, colors.appMuted), marginTop: 4}}>Tap to pick a logo</div>
    </div>
    <Field hint="Name" value={values.name} focused={focused === 'name'} />
    <Field hint="Type (for example: Pizza, Burgers, Cafe)" value={values.type} focused={focused === 'type'} />
    <Field hint="Description" value={values.description} focused={focused === 'description'} />
    <Field hint="Location" value={values.location} focused={focused === 'location'} />
    <AppButton label="Add" style={{marginTop: 22}} pressed={addPressed} />
  </div>
);

const ImageIcon: React.FC = () => (
  <svg width="54" height="54" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="#8A94A3" strokeWidth="1.6" />
    <circle cx="9" cy="10" r="2" fill="#8A94A3" />
    <path d="M4 18l5-5 4 4 3-3 4 4" fill="none" stroke="#8A94A3" strokeWidth="1.6" />
  </svg>
);

export const RestaurantRow: React.FC<{
  item: RestaurantItem;
  highlight?: number;
  pressed?: 'update' | 'delete' | null;
  pressAmount?: number;
  style?: React.CSSProperties;
}> = ({item, highlight = 0, pressed = null, pressAmount = 0, style}) => (
  <div
    style={{
      height: 96,
      margin: '6px 10px',
      borderRadius: 12,
      background: '#fff',
      boxShadow: `0 1px 4px rgba(0,0,0,0.15), 0 0 0 ${3 * highlight}px ${colors.firebaseOrange}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 6px 0 12px',
      ...style,
    }}
  >
    <Logo item={item} size={60} />
    <div style={{flex: 1, marginLeft: 12, overflow: 'hidden'}}>
      <div style={text(18, 700)}>{item.name}</div>
      <div style={text(14, 400, colors.appMuted)}>{item.type}</div>
      <div style={text(14, 400, colors.appMuted)}>{item.location}</div>
    </div>
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <AppButton label="Update" variant="text" style={{height: 38, padding: '0 8px'}} pressed={pressed === 'update' ? pressAmount : 0} />
      <AppButton label="Delete" variant="danger" style={{height: 38, padding: '0 8px'}} pressed={pressed === 'delete' ? pressAmount : 0} />
    </div>
  </div>
);

export const ListScreen: React.FC<{
  items: RestaurantItem[];
  highlightIndex?: number;
  highlight?: number;
  pressed?: 'update' | 'delete' | null;
  pressAmount?: number;
  // Index of a row that is being removed, and how far (0 → 1)
  removing?: {index: number; amount: number} | null;
  scrollY?: number;
}> = ({items, highlightIndex = -1, highlight = 0, pressed = null, pressAmount = 0, removing = null, scrollY = 0}) => (
  <div style={{position: 'absolute', inset: 0, paddingTop: 4, transform: `translateY(${-scrollY}px)`}}>
    {items.map((item, i) => {
      const isRemoving = removing?.index === i;
      const amount = isRemoving ? removing.amount : 0;
      return (
        <div
          key={item.name}
          style={{
            height: 108 * (1 - amount),
            opacity: 1 - amount,
            transform: `translateX(${amount * 120}px)`,
            overflow: 'hidden',
          }}
        >
          <RestaurantRow
            item={item}
            highlight={i === highlightIndex ? highlight : 0}
            pressed={i === highlightIndex ? pressed : null}
            pressAmount={pressAmount}
          />
        </div>
      );
    })}
  </div>
);

const Scrim: React.FC<{alpha: number; children: React.ReactNode}> = ({alpha, children}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: `rgba(0,0,0,${0.45 * alpha})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div style={{opacity: alpha, transform: `scale(${0.9 + 0.1 * alpha})`, width: '100%', display: 'flex', justifyContent: 'center'}}>
      {children}
    </div>
  </div>
);

export const EditDialog: React.FC<{
  alpha: number;
  values: FormValues;
  focused?: keyof FormValues | null;
  savePressed?: number;
}> = ({alpha, values, focused = null, savePressed = 0}) => (
  <Scrim alpha={alpha}>
    <div style={{width: 350, background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'}}>
      <div style={text(20, 700)}>Edit restaurant</div>
      <Field hint="Name" value={values.name} focused={focused === 'name'} />
      <Field hint="Type" value={values.type} focused={focused === 'type'} />
      <Field hint="Description" value={values.description} focused={focused === 'description'} />
      <Field hint="Location" value={values.location} focused={focused === 'location'} />
      <div style={{display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16}}>
        <AppButton label="Cancel" variant="text" style={{padding: '0 12px'}} />
        <AppButton label="Save" style={{padding: '0 18px'}} pressed={savePressed} />
      </div>
    </div>
  </Scrim>
);

export const ConfirmDialog: React.FC<{
  alpha: number;
  name: string;
  pressed?: 'yes' | 'no' | null;
  pressAmount?: number;
}> = ({alpha, name, pressed = null, pressAmount = 0}) => (
  <Scrim alpha={alpha}>
    <div style={{width: 330, background: '#fff', borderRadius: 14, padding: '22px 22px 12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'}}>
      <div style={text(20, 700)}>Delete restaurant</div>
      <div style={{...text(16, 400, colors.appMuted), marginTop: 12}}>
        Are you sure you want to delete {name}?
      </div>
      <div style={{display: 'flex', justifyContent: 'flex-end', gap: 4, marginTop: 18}}>
        <AppButton label="No" variant="text" style={{padding: '0 14px'}} pressed={pressed === 'no' ? pressAmount : 0} />
        <AppButton label="Yes" variant="text" style={{padding: '0 14px'}} pressed={pressed === 'yes' ? pressAmount : 0} />
      </div>
    </div>
  </Scrim>
);

export const Toast: React.FC<{text: string; alpha: number}> = ({text: message, alpha}) =>
  alpha <= 0 ? null : (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 40,
        display: 'flex',
        justifyContent: 'center',
        opacity: alpha,
        transform: `translateY(${(1 - alpha) * 10}px)`,
      }}
    >
      <div style={{background: '#323844', borderRadius: 22, padding: '12px 22px', ...text(15, 500, '#fff')}}>
        {message}
      </div>
    </div>
  );

// A finger tap: a circle that grows and fades
export const Tap: React.FC<{x: number; y: number; amount: number}> = ({x, y, amount}) =>
  amount <= 0 || amount >= 1 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x - 30,
        top: y - 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        background: 'rgba(255, 202, 40, 0.45)',
        border: '3px solid rgba(255, 202, 40, 0.9)',
        transform: `scale(${0.4 + amount * 0.9})`,
        opacity: 1 - amount,
      }}
    />
  );
