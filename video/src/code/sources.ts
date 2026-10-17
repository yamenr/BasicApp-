// The real files from ../android-app. They are imported as text (see remotion.config.ts),
// so every line of code in the video comes straight from the reference project.
import restaurant from '../../../android-app/app/src/main/java/com/example/restaurantadmin/Restaurant.java';
import firebaseServices from '../../../android-app/app/src/main/java/com/example/restaurantadmin/FirebaseServices.java';
import mainActivity from '../../../android-app/app/src/main/java/com/example/restaurantadmin/MainActivity.java';
import addRestaurantFragment from '../../../android-app/app/src/main/java/com/example/restaurantadmin/AddRestaurantFragment.java';
import showRestaurantsFragment from '../../../android-app/app/src/main/java/com/example/restaurantadmin/ShowRestaurantsFragment.java';
import restaurantAdapter from '../../../android-app/app/src/main/java/com/example/restaurantadmin/RestaurantAdapter.java';
import editRestaurantDialog from '../../../android-app/app/src/main/java/com/example/restaurantadmin/EditRestaurantDialog.java';
import appBuildGradle from '../../../android-app/app/build.gradle';
import activityMainXml from '../../../android-app/app/src/main/res/layout/activity_main.xml';

export type SourceFile = {name: string; text: string; language: 'java' | 'xml' | 'gradle'};

const file = (name: string, text: string, language: SourceFile['language']): SourceFile => ({
  name,
  text: text.replace(/\r\n/g, '\n'),
  language,
});

export const sources = {
  restaurant: file('Restaurant.java', restaurant, 'java'),
  firebaseServices: file('FirebaseServices.java', firebaseServices, 'java'),
  mainActivity: file('MainActivity.java', mainActivity, 'java'),
  addRestaurantFragment: file('AddRestaurantFragment.java', addRestaurantFragment, 'java'),
  showRestaurantsFragment: file('ShowRestaurantsFragment.java', showRestaurantsFragment, 'java'),
  restaurantAdapter: file('RestaurantAdapter.java', restaurantAdapter, 'java'),
  editRestaurantDialog: file('EditRestaurantDialog.java', editRestaurantDialog, 'java'),
  appBuildGradle: file('app/build.gradle', appBuildGradle, 'gradle'),
  activityMainXml: file('activity_main.xml', activityMainXml, 'xml'),
};
