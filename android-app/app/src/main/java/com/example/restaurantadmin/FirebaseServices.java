package com.example.restaurantadmin;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;

/**
 * One shared place to get Firebase from.
 *
 * This class is a "lazy singleton":
 *  - singleton: there is only ONE object of this class in the whole app
 *  - lazy: that object is created the first time someone asks for it, not before
 *
 * Every fragment and dialog calls FirebaseServices.getInstance()
 * and gets the same object back.
 */
public class FirebaseServices {

    // The one and only instance. It starts as null (nothing created yet).
    private static FirebaseServices instance;

    private final FirebaseAuth auth;
    private final FirebaseFirestore db;
    private final FirebaseStorage storage;

    // Private constructor: no other class can write "new FirebaseServices()"
    private FirebaseServices() {
        auth = FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();
        storage = FirebaseStorage.getInstance();
    }

    // Creates the instance the first time, then returns the same one every time
    public static FirebaseServices getInstance() {
        if (instance == null) {
            instance = new FirebaseServices();
        }
        return instance;
    }

    public FirebaseAuth getAuth() {
        return auth;
    }

    public FirebaseFirestore getDb() {
        return db;
    }

    public FirebaseStorage getStorage() {
        return storage;
    }
}
