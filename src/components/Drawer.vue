<template>
  <v-layout
    column
    align-stretch
  >
    <v-navigation-drawer
      :value="drawer"
      :color="color"
      :expand-on-hover="expandOnHover"
      :mini-variant="miniVariant"
      absolute
      dark
    >
      <v-list
        dense
        nav
        class="py-0"
      >
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/men/81.jpg">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Application</v-list-item-title>
            <v-list-item-subtitle>Subtext</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data () {
    return {
      items: [
        { title: '메뉴', icon: 'mdi-view-dashboard' },
        { title: 'Photos', icon: 'mdi-view-dashboard' },
        { title: 'About', icon: 'mdi-view-dashboard' },
      ],
      color: 'primary',
      colors: [
        'primary',
        'blue',
        'success',
        'red',
        'teal',
      ],
      miniVariant: false,
      expandOnHover: false,
      background: true,
    }
  },
  computed: {
    ...mapState({
      drawer: state => state.views.drawer
    })
  },
}
</script>