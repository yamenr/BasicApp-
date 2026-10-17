package com.example.restaurantadmin;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.firestore.DocumentSnapshot;

import java.util.ArrayList;

/**
 * Shows all restaurants in a RecyclerView.
 * Each row has an Update button and a Delete button.
 */
public class ShowRestaurantsFragment extends Fragment
        implements RestaurantAdapter.OnRestaurantActionListener {

    private final ArrayList<Restaurant> restaurants = new ArrayList<>();
    private RestaurantAdapter adapter;
    private TextView tvEmpty;
    private FirebaseServices fbs;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_show_restaurants, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        fbs = FirebaseServices.getInstance();
        tvEmpty = view.findViewById(R.id.tvEmpty);

        RecyclerView recyclerView = view.findViewById(R.id.recyclerRestaurants);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new RestaurantAdapter(restaurants, this);
        recyclerView.setAdapter(adapter);

        loadRestaurants();
    }

    // Reads every document in "restaurants" and shows it in the list
    private void loadRestaurants() {
        fbs.getDb().collection("restaurants").get()
                .addOnSuccessListener(result -> {
                    if (!isAdded()) return;
                    restaurants.clear();
                    for (DocumentSnapshot document : result.getDocuments()) {
                        Restaurant restaurant = document.toObject(Restaurant.class);
                        if (restaurant != null) {
                            // Use the document's id (it is always there)
                            restaurant.setId(document.getId());
                            restaurants.add(restaurant);
                        }
                    }
                    adapter.notifyDataSetChanged(); // tell the list to redraw
                    tvEmpty.setVisibility(restaurants.isEmpty() ? View.VISIBLE : View.GONE);
                })
                .addOnFailureListener(e -> showMessage("Could not load: " + e.getMessage()));
    }

    // Called by the adapter when the user clicks "Update" on a row
    @Override
    public void onUpdateClick(Restaurant restaurant) {
        EditRestaurantDialog dialog = EditRestaurantDialog.newInstance(restaurant);
        dialog.setOnSavedListener(this::loadRestaurants); // refresh the list after saving
        dialog.show(getChildFragmentManager(), "edit_restaurant");
    }

    // Called by the adapter when the user clicks "Delete" on a row
    @Override
    public void onDeleteClick(Restaurant restaurant) {
        new AlertDialog.Builder(requireContext())
                .setTitle("Delete restaurant")
                .setMessage("Are you sure you want to delete "
                        + restaurant.getName() + "?")
                .setPositiveButton("Yes", (dialog, which) -> deleteRestaurant(restaurant))
                .setNegativeButton("No", null)
                .show();
    }

    private void deleteRestaurant(Restaurant restaurant) {
        fbs.getDb().collection("restaurants").document(restaurant.getId())
                .delete()
                .addOnSuccessListener(unused -> {
                    showMessage("Restaurant deleted");
                    loadRestaurants();
                })
                .addOnFailureListener(e -> showMessage("Delete failed: " + e.getMessage()));
    }

    private void showMessage(String message) {
        if (!isAdded()) return;
        Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
    }
}
