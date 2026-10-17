# Restaurant Admin — reference app

A small Android app (Java, minSdk 24) that shows how to use **Firebase Firestore** and **Firebase Storage** from fragments and dialogs. It goes with the tutorial video in `../video`.

## What the app does

- **MainActivity** is the admin page. It has an **Add** button, a **Show** button and a `FrameLayout` container. Each button puts a different fragment in the container.
- **AdminFragment** is the home screen, with a welcome message and two big buttons.
- **AddRestaurantFragment** is a form. Pick a logo from the gallery, fill in the fields and click **Add**. The logo goes to Storage, then the restaurant is saved in Firestore.
- **ShowRestaurantsFragment** lists every restaurant in a `RecyclerView`. Each row has **Update** and **Delete** buttons.
- **EditRestaurantDialog** opens with all the fields filled in. Change them and click **Save**.
- **Delete** asks "Are you sure?" in an `AlertDialog` before it deletes anything.

## The files

| File | What it is |
| --- | --- |
| `Restaurant.java` | The model class (id, name, type, description, location, logoUrl) |
| `FirebaseServices.java` | Lazy singleton that holds `FirebaseAuth`, `FirebaseFirestore` and `FirebaseStorage` |
| `MainActivity.java` | Admin page and fragment switching |
| `AdminFragment.java` | Home screen |
| `AddRestaurantFragment.java` | Add form: upload the logo, then save to Firestore |
| `ShowRestaurantsFragment.java` | The list, plus the delete confirmation dialog |
| `RestaurantAdapter.java` | RecyclerView adapter and ViewHolder |
| `EditRestaurantDialog.java` | The update dialog |

Layouts are in `app/src/main/res/layout`.

## Firebase setup

1. Go to the [Firebase console](https://console.firebase.google.com) and click **Add project**. You can turn off Google Analytics.
2. In the project, click the **Android** icon to add an Android app.
   - Package name: `com.example.restaurantadmin`
   - Nickname: anything you like
3. Download **google-services.json** and put it in the `app/` folder (next to `app/build.gradle`).
   The app will not build without this file. It is in `.gitignore` because every student uses their own project.
4. **Firestore**: open **Build → Firestore Database → Create database**. Pick a location and choose **test mode**.
5. **Storage**: open **Build → Storage → Get started** and choose **test mode**.
   New Firebase projects may need the Blaze (pay-as-you-go) plan to use Storage. Small classroom use usually stays in the free quota.

### Rules for testing

Test mode rules allow anyone to read and write, so **only use them while you learn**, and never in a real app.

Firestore (**Firestore Database → Rules**):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /restaurants/{restaurantId} {
      allow read, write: if true;
    }
  }
}
```

Storage (**Storage → Rules**):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /logos/{fileName} {
      allow read, write: if true;
    }
  }
}
```

## Run it

1. Open the `android-app` folder in Android Studio.
2. Wait for Gradle sync to finish.
3. Run the app on an emulator or a phone (Android 7.0 or newer).
4. Tap **Add**, pick a logo, fill in the form and tap **Add**. Then open **Show** to see the list.

On an emulator, put a picture in the gallery first: drag an image file onto the emulator window.

## Things to try next

- Delete the logo from Storage when a restaurant is deleted.
- Let the user change the logo in the edit dialog.
- Add Firebase Authentication so only admins can add and delete.
