# Narration script: Build an Android app with Java and Firebase

<!-- This file is made by `npm run script` (in /video) from video/src/script.ts. Edit that file, not this one. -->

Total length: **9:15** · 11 scenes · 1402 words

Timings are estimates (2.6 words per second) for scenes without an audio file yet. They update when you add audio and run `npm run script` again.

**Recording tips:** record one file per scene (`scene01.mp3`, `scene02.mp3`, ...) and read the lines in order (the *On screen* captions are not read). Speak slowly and clearly. Leave a short pause between lines. The video stretches each scene to fit your recording.

## Scenes

| # | Scene | Starts | Length | Audio file |
| --- | --- | --- | --- | --- |
| 1 | What we will build | 0:00 | 0:53 | `scene01.mp3` (not yet) |
| 2 | Set up Firebase | 0:53 | 0:50 | `scene02.mp3` (not yet) |
| 3 | The Restaurant model class | 1:43 | 0:42 | `scene03.mp3` (not yet) |
| 4 | FirebaseServices: a lazy singleton | 2:25 | 1:10 | `scene04.mp3` (not yet) |
| 5 | MainActivity and fragments | 3:35 | 0:52 | `scene05.mp3` (not yet) |
| 6 | The Add screen | 4:27 | 1:19 | `scene06.mp3` (not yet) |
| 7 | The Show screen and RecyclerView | 5:46 | 1:08 | `scene07.mp3` (not yet) |
| 8 | The Update dialog | 6:54 | 0:43 | `scene08.mp3` (not yet) |
| 9 | The Delete confirm dialog | 7:36 | 0:31 | `scene09.mp3` (not yet) |
| 10 | The full app | 8:07 | 0:33 | `scene10.mp3` (not yet) |
| 11 | Summary | 8:40 | 0:35 | `scene11.mp3` (not yet) |

## Scene 1: What we will build

Starts at 0:00 · length 0:53 · file `scene01.mp3`

**[0:00]** Hi everyone! In this video, we will build a real Android app, step by step, using Java and Firebase.

> On screen: *Build an Android app with Java and Firebase*

**[0:08]** Our app is an admin page for restaurants. The admin can add a restaurant with a name, a type, a description, a location, and a logo.

> On screen: *A restaurant admin app*

**[0:18]** The admin can also see all the restaurants in a list, update them, and delete them.

> On screen: *Add, show, update and delete*

**[0:24]** Here is the plan of the app. We have one activity, called MainActivity.

> On screen: *One activity: MainActivity*

**[0:29]** Inside it, we show three fragments: the admin home, the add screen, and the show screen.

> On screen: *Three fragments*

**[0:35]** We also have two dialogs: one to edit a restaurant, and one to confirm a delete.

> On screen: *Two dialogs*

**[0:41]** All of these screens talk to Firebase through one helper class, called FirebaseServices.

> On screen: *One helper class: FirebaseServices*

**[0:46]** And FirebaseServices talks to Firebase: Authentication, the Firestore database, and Storage for images. Let’s get started!

> On screen: *Firebase: Auth, Firestore and Storage*


## Scene 2: Set up Firebase

Starts at 0:53 · length 0:50 · file `scene02.mp3`

**[0:54]** First, we need a Firebase project. Firebase is a set of tools from Google. It gives our app a database and file storage in the cloud.

> On screen: *Firebase = cloud tools from Google*

**[1:04]** Go to the Firebase console, click Add project, and give your project a name.

> On screen: *Step 1: Firebase console → Add project*

**[1:09]** Next, add an Android app to the project. Type your app’s package name: com dot example dot restaurant admin.

> On screen: *Step 2: Add an Android app*

**[1:16]** Firebase gives you a file called google services dot json. Put it inside the app folder of your project.

> On screen: *Step 3: Put google-services.json in app/*

**[1:24]** Now turn on Firestore Database and Storage. Start them both in test mode, so we can read and write while we learn.

> On screen: *Step 4: Turn on Firestore and Storage (test mode)*

**[1:32]** Last, add the Firebase libraries to app slash build dot gradle. The Firebase BoM picks matching versions for us. We also add Glide, to show images.

> On screen: *Step 5: Add the libraries to build.gradle*


## Scene 3: The Restaurant model class

Starts at 1:43 · length 0:42 · file `scene03.mp3`

**[1:44]** Now let’s write our first class: Restaurant. This is our model class. It describes one restaurant.

> On screen: *Restaurant is our model class*

**[1:50]** It has six fields: id, name, type, description, location, and logo URL. They are all Strings.

> On screen: *Six String fields*

**[1:56]** Next, an empty constructor. It looks like it does nothing, but Firestore needs it. Firestore uses it to rebuild our object when it reads a document.

> On screen: *Empty constructor: Firestore needs it*

**[2:06]** Then a full constructor. We use it when we create a new restaurant.

> On screen: *Full constructor: for new restaurants*

**[2:11]** Finally, a getter and a setter for every field. Firestore uses them to read and write the values.

> On screen: *A getter and a setter for every field*

**[2:18]** One more thing: the class implements Serializable. This lets us send a restaurant to a dialog later.

> On screen: *implements Serializable*


## Scene 4: FirebaseServices: a lazy singleton

Starts at 2:25 · length 1:10 · file `scene04.mp3`

**[2:26]** Every screen in our app needs Firebase. We could create the Firebase objects again in every screen. But there is a better way: a singleton.

> On screen: *Every screen needs Firebase*

**[2:35]** A singleton is a class that has only one object in the whole app. Everyone shares that same object.

> On screen: *Singleton = only one object, shared by everyone*

**[2:43]** Our singleton is also lazy. Lazy means we do not create the object when the app starts. We create it the first time someone asks for it.

> On screen: *Lazy = create it the first time it is needed*

**[2:53]** Let’s look at the code. First, a private static field called instance. It starts as null, because nothing is created yet.

> On screen: *instance starts as null*

**[3:01]** Then three fields: auth, db, and storage. These are the three Firebase tools we will use.

> On screen: *Three Firebase tools: auth, db, storage*

**[3:07]** The constructor is private. That means no other class can write new FirebaseServices. Inside, we get each Firebase tool.

> On screen: *Private constructor: no one else can call new*

**[3:15]** Here is the important part: getInstance. If instance is null, we create it. Then we always return the same instance.

> On screen: *getInstance(): create once, then reuse*

**[3:22]** Finally, three getters, so the screens can use auth, db, and storage.

> On screen: *Getters for auth, db and storage*

**[3:27]** So now, any fragment or dialog just calls FirebaseServices dot getInstance, and they all get the same object.

> On screen: *Every screen calls FirebaseServices.getInstance()*


## Scene 5: MainActivity and fragments

Starts at 3:35 · length 0:52 · file `scene05.mp3`

**[3:35]** Now, MainActivity. This is our admin page. It has two buttons, Add and Show, and a FrameLayout. The FrameLayout is an empty container that holds a fragment.

> On screen: *Two buttons and a FrameLayout container*

**[3:46]** A fragment is a piece of a screen, with its own layout and its own code. We can swap fragments in and out of the container, like changing slides.

> On screen: *A fragment = a piece of a screen*

**[3:57]** In onCreate, we set the layout and find the two buttons with findViewById.

> On screen: *onCreate: find the buttons*

**[4:02]** When we click Add, we show the AddRestaurantFragment. When we click Show, we show the ShowRestaurantsFragment.

> On screen: *Add → AddRestaurantFragment, Show → ShowRestaurantsFragment*

**[4:08]** The first time the app opens, we show the AdminFragment, our home screen.

> On screen: *Start with AdminFragment*

**[4:13]** The showFragment method does the swap. It starts a transaction, replaces what is in the container with the new fragment, and commits.

> On screen: *showFragment(): replace and commit*

**[4:21]** Watch: Add, then Show, then Add again. Same activity, different fragments.

> On screen: *Same activity, different fragments*


## Scene 6: The Add screen

Starts at 4:27 · length 1:19 · file `scene06.mp3`

**[4:27]** Now the Add screen. Its layout has a picture you tap to choose a logo, four text fields, and an Add button.

> On screen: *Logo picker, four fields, and an Add button*

**[4:36]** In the code, we first get our FirebaseServices instance, and find all the views.

> On screen: *Get FirebaseServices and find the views*

**[4:41]** To pick an image from the gallery, we use registerForActivityResult with GetContent. When the user picks an image, we save its Uri and show it.

> On screen: *Pick an image from the gallery*

**[4:51]** Tapping the logo opens the gallery. Tapping Add calls our addRestaurant method.

> On screen: *Tap logo → gallery, tap Add → addRestaurant()*

**[4:55]** In addRestaurant, we read the text from each field, and check the form. If something is missing, we show a Toast and stop.

> On screen: *Read the fields and check the form*

**[5:04]** Next, we make a new, empty document in the restaurants collection. This gives us a unique id.

> On screen: *A new document gives us a unique id*

**[5:11]** We use that id to name the logo file in Storage, inside a folder called logos.

> On screen: *The logo file: logos/<id>.jpg*

**[5:17]** Step one: upload the image with putFile. Step two: when the upload works, ask for the download URL. This is a web link to the image.

> On screen: *Upload the image, then get its URL*

**[5:27]** Step three, in saveRestaurant: build a Restaurant object with the id, the text, and the logo URL, and save it to Firestore with set.

> On screen: *Build a Restaurant and save it with set()*

**[5:36]** If it works, we show a Toast, and go to the Show screen. If anything fails, showError shows a Toast with the problem.

> On screen: *Success → Show screen, failure → error Toast*


## Scene 7: The Show screen and RecyclerView

Starts at 5:46 · length 1:08 · file `scene07.mp3`

**[5:46]** Next, the Show screen. It lists all our restaurants in a RecyclerView.

> On screen: *A list of restaurants in a RecyclerView*

**[5:51]** A RecyclerView is smart. It only makes enough rows to fill the screen. When you scroll, it reuses old rows for new data. That’s why it’s called a RecyclerView.

> On screen: *Rows are recycled when you scroll*

**[6:02]** A RecyclerView needs three things: a layout for one row, an adapter, and a ViewHolder.

> On screen: *Row layout + Adapter + ViewHolder*

**[6:08]** The ViewHolder keeps the views of one row: the logo, the name, the type, the location, and the two buttons. We find them only once.

> On screen: *ViewHolder: the views of one row*

**[6:17]** The adapter has three methods. onCreateViewHolder makes a new row from our row layout.

> On screen: *onCreateViewHolder: make a row*

**[6:23]** onBindViewHolder fills a row with one restaurant. We set the texts, and use Glide to download the logo and show it.

> On screen: *onBindViewHolder: fill a row*

**[6:31]** getItemCount tells the RecyclerView how many rows there are.

> On screen: *getItemCount: how many rows*

**[6:34]** When a button is clicked, the adapter tells the fragment, using a small interface with two methods: onUpdateClick and onDeleteClick.

> On screen: *An interface tells the fragment about clicks*

**[6:42]** In the fragment, loadRestaurants reads every document in the restaurants collection. toObject turns each document into a Restaurant.

> On screen: *loadRestaurants(): read from Firestore*

**[6:49]** Then we call notifyDataSetChanged, and the list draws itself again.

> On screen: *notifyDataSetChanged(): redraw the list*


## Scene 8: The Update dialog

Starts at 6:54 · length 0:43 · file `scene08.mp3`

**[6:54]** Let’s update a restaurant. When the user clicks Update, the fragment opens our EditRestaurantDialog.

> On screen: *Update opens EditRestaurantDialog*

**[7:00]** We create the dialog with newInstance. It puts the restaurant in a Bundle, as the dialog’s arguments. That’s why Restaurant is Serializable.

> On screen: *newInstance(): put the restaurant in a Bundle*

**[7:08]** In onViewCreated, we take the restaurant out of the arguments, and fill every field with its current value.

> On screen: *Fill the fields with the current values*

**[7:15]** When the user clicks Save, we copy the new values into the restaurant object.

> On screen: *Save: copy the new values*

**[7:20]** Then we save it to Firestore with set. We use the same document id, so this replaces the old data.

> On screen: *set() with the same id replaces the old data*

**[7:28]** When it works, we call onSaved, so the Show screen loads the list again, and we close the dialog.

> On screen: *Refresh the list and close the dialog*


## Scene 9: The Delete confirm dialog

Starts at 7:36 · length 0:31 · file `scene09.mp3`

**[7:37]** Deleting cannot be undone, so we ask first. When the user clicks Delete, we show an AlertDialog.

> On screen: *Ask before deleting*

**[7:43]** We give it a title and a message: Are you sure? Then we add two buttons.

> On screen: *A title, a message, and two buttons*

**[7:49]** If the user clicks No, nothing happens. The dialog just closes.

> On screen: *No → nothing happens*

**[7:54]** If the user clicks Yes, we call deleteRestaurant. It finds the document by its id, and deletes it.

> On screen: *Yes → delete the document by its id*

**[8:01]** Then we show a Toast and load the list again, so the restaurant is gone.

> On screen: *Show a Toast and reload the list*


## Scene 10: The full app

Starts at 8:07 · length 0:33 · file `scene10.mp3`

**[8:08]** Now let’s see the whole app working together.

> On screen: *The whole app, together*

**[8:11]** We open the app and see the admin home. We tap Add a restaurant.

> On screen: *Admin home → Add a restaurant*

**[8:16]** We pick a logo, type the name, the type, a description, and a location, and tap Add.

> On screen: *Fill in the form and tap Add*

**[8:23]** The logo is uploaded to Storage, the restaurant is saved in Firestore, and we see it in the list.

> On screen: *Storage → Firestore → the list*

**[8:30]** Let’s tap Update, change the location, and save. The list shows the new location.

> On screen: *Update the location*

**[8:36]** And now, Delete. Are you sure? Yes. And it’s gone.

> On screen: *Delete → Yes → gone*


## Scene 11: Summary

Starts at 8:40 · length 0:35 · file `scene11.mp3`

**[8:41]** Great job! Let’s look back at what we built.

> On screen: *What we built*

**[8:44]** A Restaurant model class that Firestore can read and write.

> On screen: *A model class for Firestore*

**[8:48]** A lazy singleton, FirebaseServices, that every screen shares.

> On screen: *A lazy singleton for Firebase*

**[8:51]** One activity that swaps three fragments, and two dialogs, for update and delete.

> On screen: *One activity, three fragments, two dialogs*

**[8:56]** We uploaded images to Storage, saved data in Firestore, and showed it all in a RecyclerView.

> On screen: *Storage, Firestore and a RecyclerView*

**[9:02]** The full code is in the android app folder. Open it in Android Studio, add your own google services dot json file, and try it yourself. See you next time!

> On screen: *Get the reference code and try it yourself!*
