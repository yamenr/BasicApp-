package com.example.restaurantadmin;

import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

/**
 * The admin page. It has two buttons ("Add" and "Show")
 * and a FrameLayout container. Each button puts a different
 * fragment inside the container.
 */
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button btnAdd = findViewById(R.id.btnAdd);
        Button btnShow = findViewById(R.id.btnShow);

        btnAdd.setOnClickListener(v -> showFragment(new AddRestaurantFragment()));
        btnShow.setOnClickListener(v -> showFragment(new ShowRestaurantsFragment()));

        // Only the first time: start with the admin home screen
        if (savedInstanceState == null) {
            showFragment(new AdminFragment());
        }
    }

    // Replaces whatever is in the container with the new fragment
    public void showFragment(Fragment fragment) {
        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.fragmentContainer, fragment)
                .commit();
    }
}
