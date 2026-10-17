package com.example.restaurantadmin;

import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.storage.StorageReference;

/**
 * A form to add a new restaurant.
 * Steps when the user clicks "Add":
 *  1. Upload the logo image to Firebase Storage
 *  2. Get the image's download URL
 *  3. Save a Restaurant object in the Firestore "restaurants" collection
 *  4. Go to the Show screen
 */
public class AddRestaurantFragment extends Fragment {

    private EditText etName, etType, etDescription, etLocation;
    private ImageView ivLogo;
    private Button btnAdd;

    private Uri selectedImageUri; // the logo the user picked (null until they pick one)
    private FirebaseServices fbs;

    // Opens the gallery. When the user picks an image, we get its Uri here.
    private final ActivityResultLauncher<String> pickImage =
            registerForActivityResult(new ActivityResultContracts.GetContent(), uri -> {
                if (uri != null) {
                    selectedImageUri = uri;
                    ivLogo.setImageURI(uri);
                }
            });

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_add_restaurant, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        fbs = FirebaseServices.getInstance();

        etName = view.findViewById(R.id.etName);
        etType = view.findViewById(R.id.etType);
        etDescription = view.findViewById(R.id.etDescription);
        etLocation = view.findViewById(R.id.etLocation);
        ivLogo = view.findViewById(R.id.ivLogo);
        btnAdd = view.findViewById(R.id.btnAdd);

        ivLogo.setOnClickListener(v -> pickImage.launch("image/*"));
        btnAdd.setOnClickListener(v -> addRestaurant());
    }

    private void addRestaurant() {
        String name = etName.getText().toString().trim();
        String type = etType.getText().toString().trim();
        String description = etDescription.getText().toString().trim();
        String location = etLocation.getText().toString().trim();

        // Check the form before we talk to Firebase
        if (name.isEmpty() || type.isEmpty() || location.isEmpty()) {
            Toast.makeText(getContext(), "Please fill in name, type and location",
                    Toast.LENGTH_SHORT).show();
            return;
        }
        if (selectedImageUri == null) {
            Toast.makeText(getContext(), "Please pick a logo", Toast.LENGTH_SHORT).show();
            return;
        }

        btnAdd.setEnabled(false); // stop double clicks while we upload

        // A new, empty document gives us a unique id for the restaurant
        DocumentReference doc = fbs.getDb().collection("restaurants").document();
        StorageReference logoRef = fbs.getStorage().getReference()
                .child("logos/" + doc.getId() + ".jpg");

        // Step 1: upload the logo to Storage
        logoRef.putFile(selectedImageUri)
                .addOnSuccessListener(snapshot -> {
                    // Step 2: ask Storage for the image's download URL
                    logoRef.getDownloadUrl()
                            .addOnSuccessListener(uri -> saveRestaurant(doc, name, type,
                                    description, location, uri.toString()))
                            .addOnFailureListener(this::showError);
                })
                .addOnFailureListener(this::showError);
    }

    // Step 3: create the Restaurant object and save it in Firestore
    private void saveRestaurant(DocumentReference doc, String name, String type,
                                String description, String location, String logoUrl) {
        Restaurant restaurant = new Restaurant(doc.getId(), name, type,
                description, location, logoUrl);

        doc.set(restaurant)
                .addOnSuccessListener(unused -> {
                    if (!isAdded()) return; // the user already left this screen
                    Toast.makeText(getContext(), "Restaurant added!",
                            Toast.LENGTH_SHORT).show();
                    // Step 4: go to the Show screen
                    MainActivity activity = (MainActivity) requireActivity();
                    activity.showFragment(new ShowRestaurantsFragment());
                })
                .addOnFailureListener(this::showError);
    }

    private void showError(Exception e) {
        if (!isAdded()) return;
        btnAdd.setEnabled(true);
        Toast.makeText(getContext(), "Failed: " + e.getMessage(), Toast.LENGTH_LONG).show();
    }
}
