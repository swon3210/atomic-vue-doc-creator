<template>
  <v-app>
    <v-app-bar app flat>
      
      <v-btn
        text
        @click="toggle_drawer"
        class="ml-2"
      >
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="file://D:\development\Javascript\Personal Project\ElectronVue\atomic-vue-creator\src\vuepress\.vuepress\dist\index.html"
        target="_blank"
      >
        <span class="mr-2">문서 보러 가기</span>
      </v-btn>
     
    </v-app-bar>

    <v-content
    >
      <Drawer />

      <v-container class="content-container">
        <v-layout column>
          
          <v-btn @click="init_vuepress">초기화</v-btn>
          <v-btn @click="open_dialog('read')">파일 가져오기</v-btn>
          <v-btn @click="open_dialog('save_md')">마크다운 파일 내보내기</v-btn>
          <v-btn @click="open_dialog('save_vue')">컴포넌트 파일 내보내기</v-btn>
          <v-btn @click="register">뷰프레스에 등록하기</v-btn>
          <v-btn @click="build_vuepress">뷰프레스 빌드하기</v-btn>

          <Display 
            :type="'HTML'"
            :name="'Template'"
            :text="template"
          />
          <Display 
            :type="'Vue'"
            :name="'Script'"
            :text="script"
          />
          <Display 
            :type="'SCSS'"
            :name="'Style'"
            :text="style"
          />

          
        </v-layout>
    
      </v-container>

    </v-content>
  </v-app>
</template>

<script>
import Drawer from './components/Drawer';
import Dialog from './components/Dialog';
import Display from './components/Display';
import { dirname } from 'path';

const fs = require("fs");
const is = require("electron-is");
const exec = require('child_process').exec;
const path = require('path')
const url = require('url')

const { app, BrowserWinodw, dialog, protocol } = require("electron").remote;

export default {
  name: 'App',
  components: {
    Drawer,
    Dialog,
    Display
  },
  data: () => ({
    template: "",
    script: "",
    style: "",
    mdContent: "",
    vueContent: "",
    explanation: "설명",
    title: "",
    window: null
  }),
  methods: {
    toggle_drawer () {
      this.$store.commit("toggle_drawer")
    },
    open_dialog (mode) {
      if (mode === "read") {
        dialog.showOpenDialog({
          buttonLabel: "불러오기",
          defaultPath: app.getPath("desktop"),
          properties: ['createDirectory', 'openFile']
        }, filepath => {
          this.read_file(filepath[0]);
        })
      } else if (mode === "save_md" || "save_vue") {
        dialog.showSaveDialog({
          buttonLabel: "저장하기",
          defaultPath: app.getPath("desktop")
        }, filename => {
          this.save_file(filename, mode);
        })
      }
      
    },
    read_file (filePath) {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          alert(err);
          return
        }

        let template = data.match(/<template>((.|\n|\r)*)<\/template>/)[0];
        let script = data.match(/<script>((.|\n|\r)*)<\/script>/)[0];
        let style = data.match(/<style (lang="scss")? (scoped)?>((.|\n|\r)*)<\/style>/)[0];

        this.template = template;
        this.script = script;
        this.style = style;

        let title = filePath.split('\\');
        title = title[title.length -1];
        title = title.replace(/.vue|.md/, "");

        let codeArea = "##코드 \r\r```HTML\r" + template + "\r```" + "\r\r```javascript\r" + script + "\r```" + "\r\r```SCSS\r" + style + "\r```"

        let mdContent = `#${title}\r\r${this.explanation}\r` + codeArea; 

        this.mdContent = mdContent;
        this.title = title;

        template = template.replace(/<template>/, "");
        template = template.replace(/<\/template>/, "");
        
        script = script.replace(/<script>/, "");
        script = script.replace(/<\/script>/, "");

        script = script.replace(/default \{/, `default {
          mixins: [vueContent], 
        `);

        // 아 스코프드 같은거도 처리해야지

        style = style.replace(/<style (lang="scss")? (scoped)?>/, "");
        style = style.replace(/<\/style>/, "");

        // 믹스인으로 할 수 있는건 믹스인으로 하자
        this.vueContent = `<template>
          <div>
            <!-- 컴포넌트 넣는 곳 -->
            <div class="component-container">
            <!---->
              ${template}
            </div>
            <div class="controller-container">
              <div
                v-for="(value, key) in $props"
                v-if="type_check(value)"
                :key="key"
                class="controller"
              >
                <label class="controller-label">\{\{key\}\}<\/label>
                <input
                  class="controller-input"
                  type="text"
                  :value="value"
                  @keyup.enter="change_prop(key, $event)"
                \/>
                <!-- 이 부분은 재귀를 해야겠는데 재귀컴포넌트 만들어서 이 배열을 그쪽에 넘겨서 렌더링해야겠다. 근데 그러면 데이터 변경은 어떻하지...귀찮아지겠는데
                그냥 이 컴포넌트 자체를 설명 컴포넌트로 하고 컴포넌트 이름은 그냥 내려받아서 is로 렌더링하면 되겠네
                완전히 자동화하기는 어렵나 흠
                -->
              <\/div>
            <\/div>

            <div class="code">
              <span class="props"><\{\{fileName\}\}
                <br \/>
                <span
                  class="prop"
                  v-for="(value, key) in $props"
                  v-if="type_check(value)"
                  :key="key"
                >
                  &nbsp; &nbsp;:\{\{key\}\}="{{value | isBoolean}}"
                  <br \/>
                </span>
                \/>
              <\/span>
            <\/div>
            
            
          <\/div>
        <\/template>

        <script>
        import { vueContent } from "mixin/mixin.js"

        ${script}

        <\/script>

        <style lang="scss" scoped>
        @import "scss/atoms.scss";

        ${style}
        // ------ 여기 코드 모듈화해서 임포트 하자

        .controller-container {
          margin-top: 50px;
          display: flex;
          width: 100%;
          flex-flow: column;

          .controller {
            display: flex;
            margin-bottom: 10px;
            justify-content: center;

            .controller-label {
              
              width: 30%;
            }

            .controller-input {
              width: 50%;
            }
          }
        }

        .code {
          margin-top: 50px;
          display: flex;
          width: 100%;
          flex-flow: column;
          padding: 20px;
          background-color: #eee;
          border-radius: 10px;
          .props {
            display: flex;
            flex-flow: column;
            margin-bottom: 10px;

            .prop {

            }
          }
        }

        .component-container {
          border-radius: 10px;
          background-color: #eee;
          padding: 20px;
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }

        <\/style>
        `
      })
    },
    save_file (fileName, mode) {
      if (mode === "save_md") {
        fs.writeFile(fileName+".md", this.mdContent, (err) => {
          if (err) {
            console.log(err);
            alert("File Error!")
          }
        })
      } else if (mode === "save_vue") {
        fs.writeFile(fileName+".vue", this.vueContent, (err) => {
          if (err) {
            console.log(err);
            alert("File Error!")
          }
        })
      }
      
    },
    change_config () {
      fs.readFile("./src/vuepress/.vuepress/config.js", 'utf-8', (err, data) => {
        console.log(data);
        let config = data.replace(/\'\/components\/\'\: \[/, `\'\/components\/\'\: \[\r\'${this.title}\',`)
        console.log(config);
        fs.writeFile("./src/vuepress/.vuepress/config.js", config, (err) => {
          if (err) {
            console.log(err);
            alert("File Error!")
          }
        })
      })
    },
    init_vuepress () {

      fs.mkdir("../vuepress/components", { recursive: true }, (err) => {
        if (err) {
          console.log(err);
        }
      })

      fs.mkdir("../vuepress/.vuepress/components", { recursive: true }, (err) => {
        if (err) {
          console.log(err);
        }
      });

      fs.mkdir("../vuepress/.vuepress/components/mixin", { recursive: true }, (err) => {
        if (err) {
          console.log(err);
        }
        fs.copyFile(__static+"\\mixin.js", "../vuepress/.vuepress/components/mixin/mixin.js", (err) => {
          console.log(err);
        });
      });

      fs.mkdir("../vuepress/.vuepress/components/scss", { recursive: true }, (err) => {
        if (err) {
          console.log(err);
        }
        
        fs.copyFile(__static+"\\atoms.scss", "../vuepress/.vuepress/components/scss/atoms.scss", (err) => {
          if (err) {
            console.log(err);
          }}
        )

        fs.copyFile(__static+"\\animations.scss", "../vuepress/.vuepress/components/scss/animations.scss", (err) => {
          if (err) {
            console.log(err);
          }}
        )

        fs.copyFile(__static+"\\mixins.scss", "../vuepress/.vuepress/components/scss/mixins.scss", (err) => {
          if (err) {
            console.log(err);
          }}
        )

        fs.copyFile(__static+"\\variables.scss", "../vuepress/.vuepress/components/scss/variables.scss", (err) => {
        if (err) {
            console.log(err);
          }}
        )

        fs.copyFile(__static+"\\package.json", "../vuepress/package.json", (err) => {
          if (err) {
            console.log(err);
          }}
        )

        fs.copyFile(__static+"\\config.js", "../vuepress/.vuepress/config.js", (err) => {
          if (err) {
            console.log(err);
          }}
        )
      })

      
      

      // fs.createReadStream(_'test.log').pipe(fs.createWriteStream('newLog.log'));

    },
    register () {
      // md 등록
      this.save_file("../vuepress/components/"+this.title, "save_md");
      // vue 등록
      this.save_file("../vuepress/.vuepress/components/"+this.title, "save_vue");

      // this.change_config();
    },
    build_vuepress () {
      if (is.windows()) {
        exec("cd ../vuepress && npm install && vuepress build", function (err, stdout, stderr) {
          console.log(stdout)
        }) 
      }
      if (is.macOS()) {
        exec("cd ./src/vuepress; ls; npm install; vuepress build", function (err, stdout, stderr) {
          console.log(stdout)
        }) 
      }
      if (is.linux()) {
        exec("cd ./src/vuepress; ls; npm install; vuepress build", function (err, stdout, stderr) {
          console.log(stdout)
        }) 
      }
    },
    // createWindow () {
    //   this.window = new BrowserWinodw({
    //     width: 800, 
    //     height: 600,
    //     webPreferences: {
    //       nodeIntegration: true
    //     },
    //   })

    //   this.window.loadURL(url.format({
    //     pathname: 'index.html',    /* Attention here: origin is path.join(__dirname, 'index.html') */
    //     protocol: 'file',
    //     slashes: true
    //   }))

    //   this.window.on('closed', function () {
    //     this.window = null
    //   })
    // },
    // open_vuepress () {

    //   // console.log('open vuepress site!')

    //   // console.log()

    //   // protocol.interceptFileProtocol('file', (request, callback) => {
    //   //   const url = request.url.substr(7)    /* all urls start with 'file://' */

    //   //   // 아하! 여기를 조정해주면 되는구나
        

    //   //   callback({ path: path.normalize(`./vuepress/.vuepress/dist/${url}`) })
    //   // }, (err) => {
    //   //   if (err) console.error('Failed to register protocol')
    //   // })

    //   this.createWindow()
    // }
  },
};
</script>

<style lang="scss" scoped>
.content-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
