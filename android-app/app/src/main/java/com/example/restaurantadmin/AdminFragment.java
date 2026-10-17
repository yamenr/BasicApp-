package com.example.restaurantadmin;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

/**
 * The home screen of the admin page.
 * It shows a welcome message and two big buttons: Add and Show.
 */
public class AdminFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_admin, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Button btnGoAdd = view.findViewById(R.id.btnGoAdd);
        Button btnGoShow = view.findViewById(R.id.btnGoShow);

        // Ask MainActivity to swap the fragment in its container
        MainActivity activity = (MainActivity) requireActivity();
        btnGoAdd.setOnClickListener(v -> activity.showFragment(new AddRestaurantFragment()));
        btnGoShow.setOnClickListener(v -> activity.showFragment(new ShowRestaurantsFragment()));
    }
}
