package com.example.restaurantadmin;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;

/**
 * A dialog that shows a restaurant's fields, already filled in.
 * The user changes what they want and clicks "Save".
 */
public class EditRestaurantDialog extends DialogFragment {

    // The Show fragment gives us this, so it can refresh the list after we save
    public interface OnSavedListener {
        void onSaved();
    }

    private static final String ARG_RESTAURANT = "restaurant";

    private Restaurant restaurant;
    private OnSavedListener onSavedListener;
    private EditText etName, etType, etDescription, etLocation;

    // Use this to create the dialog: it puts the restaurant inside the arguments
    public static EditRestaurantDialog newInstance(Restaurant restaurant) {
        EditRestaurantDialog dialog = new EditRestaurantDialog();
        Bundle args = new Bundle();
        args.putSerializable(ARG_RESTAURANT, restaurant);
        dialog.setArguments(args);
        return dialog;
    }

    public void setOnSavedListener(OnSavedListener listener) {
        this.onSavedListener = listener;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.dialog_edit_restaurant, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        restaurant = (Restaurant) requireArguments().getSerializable(ARG_RESTAURANT);

        etName = view.findViewById(R.id.etName);
        etType = view.findViewById(R.id.etType);
        etDescription = view.findViewById(R.id.etDescription);
        etLocation = view.findViewById(R.id.etLocation);
        Button btnSave = view.findViewById(R.id.btnSave);
        Button btnCancel = view.findViewById(R.id.btnCancel);

        // Fill the fields with the current values
        etName.setText(restaurant.getName());
        etType.setText(restaurant.getType());
        etDescription.setText(restaurant.getDescription());
        etLocation.setText(restaurant.getLocation());

        btnSave.setOnClickListener(v -> saveChanges());
        btnCancel.setOnClickListener(v -> dismiss());
    }

    @Override
    public void onStart() {
        super.onStart();
        // Make the dialog use the full screen width
        if (getDialog() != null && getDialog().getWindow() != null) {
            getDialog().getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT);
        }
    }

    private void saveChanges() {
        String name = etName.getText().toString().trim();
        if (name.isEmpty()) {
            etName.setError("Name is required");
            return;
        }

        restaurant.setName(name);
        restaurant.setType(etType.getText().toString().trim());
        restaurant.setDescription(etDescription.getText().toString().trim());
        restaurant.setLocation(etLocation.getText().toString().trim());

        // Overwrite the document that has this restaurant's id
        FirebaseServices.getInstance().getDb()
                .collection("restaurants").document(restaurant.getId())
                .set(restaurant)
                .addOnSuccessListener(unused -> {
                    if (!isAdded()) return;
                    Toast.makeText(getContext(), "Changes saved", Toast.LENGTH_SHORT).show();
                    if (onSavedListener != null) {
                        onSavedListener.onSaved();
                    }
                    dismiss();
                })
                .addOnFailureListener(e -> {
                    if (!isAdded()) return;
                    Toast.makeText(getContext(), "Save failed: " + e.getMessage(),
                            Toast.LENGTH_LONG).show();
                });
    }
}
