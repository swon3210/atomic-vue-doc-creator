<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="red lighten-2"
          dark
          v-on="on"
        >
          Click Me
        </v-btn>
      </template>

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Privacy Policy
        </v-card-title>

        <v-card-text>
          <v-textarea
            v-model="fileContent" 
            solo
            name="input-7-4"
            label="Solo textarea"
            class="codeArea"
          ></v-textarea>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="open_dialog"
          >
            Dialog
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const { app, BrowserWinodw, dialog } = require("electron").remote;
const fs = require("fs");

export default {
  data () {
    return {
      dialog: false,
      fileContent: ""
    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.codeArea {
  
}
</style>
