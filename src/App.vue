<template>
  <v-app>
    <v-toolbar color="light-blue accent-1">
      <v-toolbar-title class="title mr-6 hidden-sm-and-down">Weatherpedia</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-autocomplete
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        chips
        clearable
        hide-details
        hide-selected
        item-text="name"
        item-value="id"
        label="Search for a city..."
        solo
      >
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-title>
              Search for your favorite
              <strong>City</strong>
            </v-list-item-title>
          </v-list-item>
        </template>
        <template v-slot:selection="{ attr, on, item, selected }">
          <v-chip
            v-bind="attr"
            :input-value="selected"
            color="blue-grey"
            class="white--text"
            v-on="on"
          >
            <v-icon left>mdi-coin</v-icon>
            <span v-text="item.name"></span>
          </v-chip>
        </template>
        <template v-slot:item="{ item }">
          <v-list-item-avatar
            color="indigo"
            class="headline font-weight-light white--text"
          >{{ item.country }}</v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
            <v-list-item-subtitle v-text="'Lat: ' + item.coord.lat + ', Lon: ' +item.coord.lon"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-coin</v-icon>
          </v-list-item-action>
        </template>
      </v-autocomplete>
    </v-toolbar>

    <v-content>
      <Home />
    </v-content>
  </v-app>
</template>

<script>
import Home from "./views/Home";
import { fetchCityJson, fetchWeatherByCityId } from "./api.service";

export default {
  name: "App",
  data: () => ({
    isLoading: false,
    items: [],
    model: null,
    search: null
  }),

  watch: {
    model(val) {
      if (!val) return;
      fetchWeatherByCityId(val).then(response =>
        this.$store.dispatch("changeHomepageCardData", response.data)
      );
    },
    search() {
      if (this.items.length > 0) return;
      this.isLoading = true;
      this.items = this.$store.getters.getCityList;
      this.isLoading = false;
    }
  },

  components: {
    Home
  },

  created() {
    fetchCityJson().then(
      response => {
        this.$store.dispatch("changeCityList", response.data);
      },
      error => console.log(error)
    );
  }
};
</script>
