/**
 * The narration for the whole video. This is the ONE place to change what is said.
 *
 * - Each scene is split into "beats". A beat is one or two sentences.
 * - `say` is what the narrator says (also sent to ElevenLabs by `npm run voice`).
 * - `caption` is the short line shown at the bottom of the screen.
 * - The scene files in src/scenes change the picture at the start of each beat
 *   (beat 0, beat 1, ...). If you add or remove a beat, update that scene file too.
 *
 * Beat timing is spread over the scene's audio by word count, so code reveals and
 * highlights follow the voice. `npm run script` writes ../script.md from this file.
 */

export type Beat = {
  say: string;
  caption: string;
};

export type SceneScript = {
  id: string;
  title: string;
  beats: Beat[];
};

export const scenes: SceneScript[] = [
  {
    id: 'intro',
    title: 'What we will build',
    beats: [
      {
        say: 'Hi everyone! In this video, we will build a real Android app, step by step, using Java and Firebase.',
        caption: 'Build an Android app with Java and Firebase',
      },
      {
        say: 'Our app is an admin page for restaurants. The admin can add a restaurant with a name, a type, a description, a location, and a logo.',
        caption: 'A restaurant admin app',
      },
      {
        say: 'The admin can also see all the restaurants in a list, update them, and delete them.',
        caption: 'Add, show, update and delete',
      },
      {
        say: 'Here is the plan of the app. We have one activity, called MainActivity.',
        caption: 'One activity: MainActivity',
      },
      {
        say: 'Inside it, we show three fragments: the admin home, the add screen, and the show screen.',
        caption: 'Three fragments',
      },
      {
        say: 'We also have two dialogs: one to edit a restaurant, and one to confirm a delete.',
        caption: 'Two dialogs',
      },
      {
        say: 'All of these screens talk to Firebase through one helper class, called FirebaseServices.',
        caption: 'One helper class: FirebaseServices',
      },
      {
        say: 'And FirebaseServices talks to Firebase: Authentication, the Firestore database, and Storage for images. Let’s get started!',
        caption: 'Firebase: Auth, Firestore and Storage',
      },
    ],
  },
  {
    id: 'firebase-setup',
    title: 'Set up Firebase',
    beats: [
      {
        say: 'First, we need a Firebase project. Firebase is a set of tools from Google. It gives our app a database and file storage in the cloud.',
        caption: 'Firebase = cloud tools from Google',
      },
      {
        say: 'Go to the Firebase console, click Add project, and give your project a name.',
        caption: 'Step 1: Firebase console → Add project',
      },
      {
        say: 'Next, add an Android app to the project. Type your app’s package name: com dot example dot restaurant admin.',
        caption: 'Step 2: Add an Android app',
      },
      {
        say: 'Firebase gives you a file called google services dot json. Put it inside the app folder of your project.',
        caption: 'Step 3: Put google-services.json in app/',
      },
      {
        say: 'Now turn on Firestore Database and Storage. Start them both in test mode, so we can read and write while we learn.',
        caption: 'Step 4: Turn on Firestore and Storage (test mode)',
      },
      {
        say: 'Last, add the Firebase libraries to app slash build dot gradle. The Firebase BoM picks matching versions for us. We also add Glide, to show images.',
        caption: 'Step 5: Add the libraries to build.gradle',
      },
    ],
  },
  {
    id: 'model',
    title: 'The Restaurant model class',
    beats: [
      {
        say: 'Now let’s write our first class: Restaurant. This is our model class. It describes one restaurant.',
        caption: 'Restaurant is our model class',
      },
      {
        say: 'It has six fields: id, name, type, description, location, and logo URL. They are all Strings.',
        caption: 'Six String fields',
      },
      {
        say: 'Next, an empty constructor. It looks like it does nothing, but Firestore needs it. Firestore uses it to rebuild our object when it reads a document.',
        caption: 'Empty constructor: Firestore needs it',
      },
      {
        say: 'Then a full constructor. We use it when we create a new restaurant.',
        caption: 'Full constructor: for new restaurants',
      },
      {
        say: 'Finally, a getter and a setter for every field. Firestore uses them to read and write the values.',
        caption: 'A getter and a setter for every field',
      },
      {
        say: 'One more thing: the class implements Serializable. This lets us send a restaurant to a dialog later.',
        caption: 'implements Serializable',
      },
    ],
  },
  {
    id: 'singleton',
    title: 'FirebaseServices: a lazy singleton',
    beats: [
      {
        say: 'Every screen in our app needs Firebase. We could create the Firebase objects again in every screen. But there is a better way: a singleton.',
        caption: 'Every screen needs Firebase',
      },
      {
        say: 'A singleton is a class that has only one object in the whole app. Everyone shares that same object.',
        caption: 'Singleton = only one object, shared by everyone',
      },
      {
        say: 'Our singleton is also lazy. Lazy means we do not create the object when the app starts. We create it the first time someone asks for it.',
        caption: 'Lazy = create it the first time it is needed',
      },
      {
        say: 'Let’s look at the code. First, a private static field called instance. It starts as null, because nothing is created yet.',
        caption: 'instance starts as null',
      },
      {
        say: 'Then three fields: auth, db, and storage. These are the three Firebase tools we will use.',
        caption: 'Three Firebase tools: auth, db, storage',
      },
      {
        say: 'The constructor is private. That means no other class can write new FirebaseServices. Inside, we get each Firebase tool.',
        caption: 'Private constructor: no one else can call new',
      },
      {
        say: 'Here is the important part: getInstance. If instance is null, we create it. Then we always return the same instance.',
        caption: 'getInstance(): create once, then reuse',
      },
      {
        say: 'Finally, three getters, so the screens can use auth, db, and storage.',
        caption: 'Getters for auth, db and storage',
      },
      {
        say: 'So now, any fragment or dialog just calls FirebaseServices dot getInstance, and they all get the same object.',
        caption: 'Every screen calls FirebaseServices.getInstance()',
      },
    ],
  },
  {
    id: 'main-activity',
    title: 'MainActivity and fragments',
    beats: [
      {
        say: 'Now, MainActivity. This is our admin page. It has two buttons, Add and Show, and a FrameLayout. The FrameLayout is an empty container that holds a fragment.',
        caption: 'Two buttons and a FrameLayout container',
      },
      {
        say: 'A fragment is a piece of a screen, with its own layout and its own code. We can swap fragments in and out of the container, like changing slides.',
        caption: 'A fragment = a piece of a screen',
      },
      {
        say: 'In onCreate, we set the layout and find the two buttons with findViewById.',
        caption: 'onCreate: find the buttons',
      },
      {
        say: 'When we click Add, we show the AddRestaurantFragment. When we click Show, we show the ShowRestaurantsFragment.',
        caption: 'Add → AddRestaurantFragment, Show → ShowRestaurantsFragment',
      },
      {
        say: 'The first time the app opens, we show the AdminFragment, our home screen.',
        caption: 'Start with AdminFragment',
      },
      {
        say: 'The showFragment method does the swap. It starts a transaction, replaces what is in the container with the new fragment, and commits.',
        caption: 'showFragment(): replace and commit',
      },
      {
        say: 'Watch: Add, then Show, then Add again. Same activity, different fragments.',
        caption: 'Same activity, different fragments',
      },
    ],
  },
  {
    id: 'add-fragment',
    title: 'The Add screen',
    beats: [
      {
        say: 'Now the Add screen. Its layout has a picture you tap to choose a logo, four text fields, and an Add button.',
        caption: 'Logo picker, four fields, and an Add button',
      },
      {
        say: 'In the code, we first get our FirebaseServices instance, and find all the views.',
        caption: 'Get FirebaseServices and find the views',
      },
      {
        say: 'To pick an image from the gallery, we use registerForActivityResult with GetContent. When the user picks an image, we save its Uri and show it.',
        caption: 'Pick an image from the gallery',
      },
      {
        say: 'Tapping the logo opens the gallery. Tapping Add calls our addRestaurant method.',
        caption: 'Tap logo → gallery, tap Add → addRestaurant()',
      },
      {
        say: 'In addRestaurant, we read the text from each field, and check the form. If something is missing, we show a Toast and stop.',
        caption: 'Read the fields and check the form',
      },
      {
        say: 'Next, we make a new, empty document in the restaurants collection. This gives us a unique id.',
        caption: 'A new document gives us a unique id',
      },
      {
        say: 'We use that id to name the logo file in Storage, inside a folder called logos.',
        caption: 'The logo file: logos/<id>.jpg',
      },
      {
        say: 'Step one: upload the image with putFile. Step two: when the upload works, ask for the download URL. This is a web link to the image.',
        caption: 'Upload the image, then get its URL',
      },
      {
        say: 'Step three, in saveRestaurant: build a Restaurant object with the id, the text, and the logo URL, and save it to Firestore with set.',
        caption: 'Build a Restaurant and save it with set()',
      },
      {
        say: 'If it works, we show a Toast, and go to the Show screen. If anything fails, showError shows a Toast with the problem.',
        caption: 'Success → Show screen, failure → error Toast',
      },
    ],
  },
  {
    id: 'show-fragment',
    title: 'The Show screen and RecyclerView',
    beats: [
      {
        say: 'Next, the Show screen. It lists all our restaurants in a RecyclerView.',
        caption: 'A list of restaurants in a RecyclerView',
      },
      {
        say: 'A RecyclerView is smart. It only makes enough rows to fill the screen. When you scroll, it reuses old rows for new data. That’s why it’s called a RecyclerView.',
        caption: 'Rows are recycled when you scroll',
      },
      {
        say: 'A RecyclerView needs three things: a layout for one row, an adapter, and a ViewHolder.',
        caption: 'Row layout + Adapter + ViewHolder',
      },
      {
        say: 'The ViewHolder keeps the views of one row: the logo, the name, the type, the location, and the two buttons. We find them only once.',
        caption: 'ViewHolder: the views of one row',
      },
      {
        say: 'The adapter has three methods. onCreateViewHolder makes a new row from our row layout.',
        caption: 'onCreateViewHolder: make a row',
      },
      {
        say: 'onBindViewHolder fills a row with one restaurant. We set the texts, and use Glide to download the logo and show it.',
        caption: 'onBindViewHolder: fill a row',
      },
      {
        say: 'getItemCount tells the RecyclerView how many rows there are.',
        caption: 'getItemCount: how many rows',
      },
      {
        say: 'When a button is clicked, the adapter tells the fragment, using a small interface with two methods: onUpdateClick and onDeleteClick.',
        caption: 'An interface tells the fragment about clicks',
      },
      {
        say: 'In the fragment, loadRestaurants reads every document in the restaurants collection. toObject turns each document into a Restaurant.',
        caption: 'loadRestaurants(): read from Firestore',
      },
      {
        say: 'Then we call notifyDataSetChanged, and the list draws itself again.',
        caption: 'notifyDataSetChanged(): redraw the list',
      },
    ],
  },
  {
    id: 'update-dialog',
    title: 'The Update dialog',
    beats: [
      {
        say: 'Let’s update a restaurant. When the user clicks Update, the fragment opens our EditRestaurantDialog.',
        caption: 'Update opens EditRestaurantDialog',
      },
      {
        say: 'We create the dialog with newInstance. It puts the restaurant in a Bundle, as the dialog’s arguments. That’s why Restaurant is Serializable.',
        caption: 'newInstance(): put the restaurant in a Bundle',
      },
      {
        say: 'In onViewCreated, we take the restaurant out of the arguments, and fill every field with its current value.',
        caption: 'Fill the fields with the current values',
      },
      {
        say: 'When the user clicks Save, we copy the new values into the restaurant object.',
        caption: 'Save: copy the new values',
      },
      {
        say: 'Then we save it to Firestore with set. We use the same document id, so this replaces the old data.',
        caption: 'set() with the same id replaces the old data',
      },
      {
        say: 'When it works, we call onSaved, so the Show screen loads the list again, and we close the dialog.',
        caption: 'Refresh the list and close the dialog',
      },
    ],
  },
  {
    id: 'delete-dialog',
    title: 'The Delete confirm dialog',
    beats: [
      {
        say: 'Deleting cannot be undone, so we ask first. When the user clicks Delete, we show an AlertDialog.',
        caption: 'Ask before deleting',
      },
      {
        say: 'We give it a title and a message: Are you sure? Then we add two buttons.',
        caption: 'A title, a message, and two buttons',
      },
      {
        say: 'If the user clicks No, nothing happens. The dialog just closes.',
        caption: 'No → nothing happens',
      },
      {
        say: 'If the user clicks Yes, we call deleteRestaurant. It finds the document by its id, and deletes it.',
        caption: 'Yes → delete the document by its id',
      },
      {
        say: 'Then we show a Toast and load the list again, so the restaurant is gone.',
        caption: 'Show a Toast and reload the list',
      },
    ],
  },
  {
    id: 'demo',
    title: 'The full app',
    beats: [
      {
        say: 'Now let’s see the whole app working together.',
        caption: 'The whole app, together',
      },
      {
        say: 'We open the app and see the admin home. We tap Add a restaurant.',
        caption: 'Admin home → Add a restaurant',
      },
      {
        say: 'We pick a logo, type the name, the type, a description, and a location, and tap Add.',
        caption: 'Fill in the form and tap Add',
      },
      {
        say: 'The logo is uploaded to Storage, the restaurant is saved in Firestore, and we see it in the list.',
        caption: 'Storage → Firestore → the list',
      },
      {
        say: 'Let’s tap Update, change the location, and save. The list shows the new location.',
        caption: 'Update the location',
      },
      {
        say: 'And now, Delete. Are you sure? Yes. And it’s gone.',
        caption: 'Delete → Yes → gone',
      },
    ],
  },
  {
    id: 'summary',
    title: 'Summary',
    beats: [
      {
        say: 'Great job! Let’s look back at what we built.',
        caption: 'What we built',
      },
      {
        say: 'A Restaurant model class that Firestore can read and write.',
        caption: 'A model class for Firestore',
      },
      {
        say: 'A lazy singleton, FirebaseServices, that every screen shares.',
        caption: 'A lazy singleton for Firebase',
      },
      {
        say: 'One activity that swaps three fragments, and two dialogs, for update and delete.',
        caption: 'One activity, three fragments, two dialogs',
      },
      {
        say: 'We uploaded images to Storage, saved data in Firestore, and showed it all in a RecyclerView.',
        caption: 'Storage, Firestore and a RecyclerView',
      },
      {
        say: 'The full code is in the android app folder. Open it in Android Studio, add your own google services dot json file, and try it yourself. See you next time!',
        caption: 'Get the reference code and try it yourself!',
      },
    ],
  },
];
