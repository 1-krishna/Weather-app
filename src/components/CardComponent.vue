<template>
  <v-card elevation="50" :loading="!wData" class="mx-auto top-margin" max-width="85vw">
    <v-sheet
      v-if="!wData"
      :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
      class="px-3 pt-3 pb-3 text-center"
    >
      <v-skeleton-loader class="mx-auto" max-width="85vw" type="card"></v-skeleton-loader>
    </v-sheet>
    <template v-if="wData">
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="headline">{{wData.city.name}}</v-list-item-title>
          <v-list-item-subtitle>{{daysFull[dateTime().getDay()]}}, {{time()}}, {{selectedDayData[0].weather[0].main}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-card-text>
        <v-row align="center">
          <v-col
            class="display-3"
            cols="6"
          >{{(selectedDayData[0].main.temp-273.15).toFixed(0)}}&deg;C</v-col>
          <v-col cols="6">
            <v-img :src="imgLink" alt="Sunny image" max-width="100"></v-img>
          </v-col>
        </v-row>
      </v-card-text>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-send</v-icon>
        </v-list-item-icon>
        <v-list-item-subtitle>{{selectedDayData[0].wind.speed}}m/s</v-list-item-subtitle>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-cloud-download</v-icon>
        </v-list-item-icon>
        <v-list-item-subtitle>{{selectedDayData[0].main.humidity}}%</v-list-item-subtitle>
      </v-list-item>

      <v-slider
        v-model="sliderTime"
        :max="Object.keys(datewiseRecord).length-1"
        :tick-labels="labels"
        class="mx-4"
        ticks
      ></v-slider>
      <v-list dark rounded color="light-green" class="top-margin">
        <h3 align="center">{{ selectedDayData[0].dt_txt.substring(0, 10) }}</h3>
        <v-divider></v-divider>
        <v-list-item v-for="(item, idx) in selectedDayData" :key="idx">
          <v-list-item-title>{{ convertTo2Digit(item.dt_txt) }}</v-list-item-title>
          <v-list-item-icon>
            <img :src="convertToImageURL(item.weather[0].icon)" alt="image" />
          </v-list-item-icon>
          <v-list-item-subtitle class="text-right">
            <v-icon>mdi-coolant-temperature</v-icon>
            {{ (item.main.temp-273.15).toFixed(2) }}&deg;C
          </v-list-item-subtitle>
          <v-list-item-subtitle class="text-right">
            <v-icon>mdi-weather-windy</v-icon>
            {{ item.wind.speed }}m/s
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </template>
  </v-card>
</template>

<script>
import { fetchWeatherByCityId } from "@/api.service";

export default {
  name: "CardComponent",
  inject: ["theme"],
  created() {
    fetchWeatherByCityId(1269843).then(response =>
      this.$store.dispatch("changeHomepageCardData", response.data)
    );
  },
  methods: {
    time() {
      if (this.dateTime())
        return this.dateTime().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        });
      return "";
    },
    convertTo2Digit(dateString) {
      return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    },
    dateTime() {
      if (this.selectedDayData) {
        return new Date(this.selectedDayData[0].dt_txt);
      }
      return "";
    },
    findDateTime(dtString) {
      return new Date(dtString);
    },
    convertToImageURL(iconName) {
      return `http://openweathermap.org/img/wn/${iconName}.png`;
    }
  },
  computed: {
    wData() {
      return this.$store.getters.getHomepageCardData;
    },
    datewiseRecord() {
      if (!this.wData) return {};
      var datewise = {};
      this.wData.list.forEach(element => {
        if (datewise[element.dt_txt.substring(0, 10)]) {
          datewise[element.dt_txt.substring(0, 10)] = [
            ...datewise[element.dt_txt.substring(0, 10)],
            element
          ];
        } else {
          datewise[element.dt_txt.substring(0, 10)] = [element];
        }
      });
      return datewise;
    },
    labels() {
      if (!this.wData) return [];
      var lab = [];
      Object.keys(this.datewiseRecord).forEach(key => {
        lab.push(
          this.daysMini[
            this.findDateTime(this.datewiseRecord[key][0].dt_txt).getDay()
          ]
        );
      });
      return lab;
    },
    selectedDayData() {
      if (!this.wData) return [];
      return this.datewiseRecord[
        Object.keys(this.datewiseRecord)[this.sliderTime]
      ];
    },
    imgLink() {
      if (!this.wData) return null;
      return `http://openweathermap.org/img/wn/${this.selectedDayData[0].weather[0].icon}@2x.png`;
    }
  },
  data() {
    return {
      daysFull: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      daysMini: ["SU", "MO", "TU", "WED", "TH", "FR", "SA"],
      sliderTime: 0
    };
  }
};
</script>
<style scoped>
.top-margin {
  margin-top: 50px;
  padding: 20px;
}
</style>