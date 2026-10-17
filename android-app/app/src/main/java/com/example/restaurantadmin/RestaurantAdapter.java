package com.example.restaurantadmin;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.ArrayList;

/**
 * The adapter connects our list of restaurants to the RecyclerView.
 *  - onCreateViewHolder: makes a new row (from item_restaurant.xml)
 *  - onBindViewHolder:   fills a row with one restaurant's data
 *  - getItemCount:       how many rows there are
 */
public class RestaurantAdapter extends RecyclerView.Adapter<RestaurantAdapter.RestaurantViewHolder> {

    // The fragment implements this, so the adapter can tell it about button clicks
    public interface OnRestaurantActionListener {
        void onUpdateClick(Restaurant restaurant);

        void onDeleteClick(Restaurant restaurant);
    }

    private final ArrayList<Restaurant> restaurants;
    private final OnRestaurantActionListener listener;

    public RestaurantAdapter(ArrayList<Restaurant> restaurants,
                             OnRestaurantActionListener listener) {
        this.restaurants = restaurants;
        this.listener = listener;
    }

    @NonNull
    @Override
    public RestaurantViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View row = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_restaurant, parent, false);
        return new RestaurantViewHolder(row);
    }

    @Override
    public void onBindViewHolder(@NonNull RestaurantViewHolder holder, int position) {
        Restaurant restaurant = restaurants.get(position);

        holder.tvName.setText(restaurant.getName());
        holder.tvType.setText(restaurant.getType());
        holder.tvLocation.setText(restaurant.getLocation());

        // Glide downloads the logo from its URL and shows it
        Glide.with(holder.itemView.getContext())
                .load(restaurant.getLogoUrl())
                .placeholder(android.R.drawable.ic_menu_gallery)
                .into(holder.ivLogo);

        holder.btnUpdate.setOnClickListener(v -> listener.onUpdateClick(restaurant));
        holder.btnDelete.setOnClickListener(v -> listener.onDeleteClick(restaurant));
    }

    @Override
    public int getItemCount() {
        return restaurants.size();
    }

    // The ViewHolder keeps the views of one row, so we find them only once
    static class RestaurantViewHolder extends RecyclerView.ViewHolder {
        ImageView ivLogo;
        TextView tvName, tvType, tvLocation;
        Button btnUpdate, btnDelete;

        RestaurantViewHolder(@NonNull View itemView) {
            super(itemView);
            ivLogo = itemView.findViewById(R.id.ivLogo);
            tvName = itemView.findViewById(R.id.tvName);
            tvType = itemView.findViewById(R.id.tvType);
            tvLocation = itemView.findViewById(R.id.tvLocation);
            btnUpdate = itemView.findViewById(R.id.btnUpdate);
            btnDelete = itemView.findViewById(R.id.btnDelete);
        }
    }
}
