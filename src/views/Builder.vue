<template>
  <div class="view">
    <div class="border column">
      <h3>Resources</h3>
      <Container style="" class="resources-zone" group-name="items" behaviour="copy" :get-child-payload="getPayload">
        <Draggable v-for="item in items" :key="item.id">
          <span class="item-name">{{ formatString(item.data) }}</span>
          <div class="draggable-item">
            <Item :material="item.data" :part="item.part"></Item>
          </div>
        </Draggable>
      </Container>
    </div>

    <div class="border parts column">
      <h3>Parts</h3>
      <template v-if="toolType">
        <template v-for="type of partsData.toolTypes[toolType].parts" :key="type">
          <Container class="parts-zone" group-name="items" @drop="replaceOnDrop($event, type)" behaviour="drop-zone">
            <span>{{ formatString(type) }}</span>
            <Draggable v-if="parts[type]">
              <span class="item-name">{{ formatString(parts[type].data) }}</span>
              <div class="draggable-item">
                <Item :toolType="toolType" :material="parts[type].data" :part="type" />
              </div>
            </Draggable>
          </Container>
        </template>
        <button @click="parts = {}">clear</button>
      </template>
      <template v-else> Select tool type </template>
    </div>

    <div class="border column">
      <h3>Built tool</h3>
      <select class="select-tool-type" name="type" v-model="toolType">
        <template v-for="type of toolTypes" :key="type">
          <option :value="type">{{ formatString(type) }}</option>
        </template>
      </select>
      <item-stats style="margin: 8px 0" v-model:json="json" v-show="json.completed"></item-stats>
      <span v-show="!json.completed">
        <span style="display: block"
          >Select parts <br />
          to show stats</span
        >
      </span>
      <item-render :toolType="toolType" :renderData="renderData" v-show="json.completed" />
    </div>
  </div>
  <div class="footer">
    <button v-if="logged" class="save" @click="showModalFn">save</button>
    <div v-else>You need an account to save</div>
    <span>{{ message }}</span>
    <span class="error">{{ error }}</span>
    <small class="disclaimer">* Calculations are not guaranteed to be correct</small>
  </div>
  <modal v-if="showModal">
    <h2>Save current tool</h2>
    <div style="display: grid; margin: 8px 0">
      <label for="tool-name">Name</label>
      <input autocomplete="false" name="tool-name" id="tool-name" type="text" v-model="toolName" required />
    </div>
    <label for="tool-description">Description</label>
    <textarea name="description" id="tool-description" cols="30" rows="10" v-model="toolDescription"></textarea>
    <div class="button-array">
      <button @click="showModal = false">Cancel</button>
      <button @click="save">Save</button>
    </div>
  </modal>
  {{ item }}
</template>

<script>
import Item from '@/components/Item';
import ItemStats from '@/components/ItemStats';
import ItemRender from '@/components/ItemRender';
import Modal from '@/components/Modal';
import { Container, Draggable } from 'vue3-smooth-dnd';
import { getApi, getPartsData, getToken, getToolLength } from '../utils';
import axios from 'axios';

export default {
  name: 'Builder',
  props: ['item'],
  components: {
    Item,
    ItemStats,
    ItemRender,
    Modal,
    Container,
    Draggable,
  },
  data() {
    let partsData = getPartsData();
    let items = [];
    let i = 1;
    Object.keys(partsData.head).forEach((mat) => items.push({ id: i++, data: mat, part: 'small_blade' }));

    return {
      items,
      partsData,
      parts: {},
      toolType: 'sword',
      error: '',
      message: '',
      showModal: false,
      toolName: '',
      toolDescription: '',
    };
  },
  async mounted() {
    let id = this.$route.params.id;
    if (id) {
      let res = await axios.get(getApi('tool', { id }));
      let data = res.data[0];
      if (!data) return this.$router.push('/builder');
      this.toolName = data.tool.name;
      this.toolDescription = data.tool.description;
      this.toolType = data.tool.type;
      this.parts = data.tool.parts;
    }
  },
  methods: {
    onDrop({ removedIndex, addedIndex }) {
      let temp = this.items[removedIndex];
      this.items.splice(removedIndex, 1);
      this.items.splice(addedIndex, 0, temp);
    },
    replaceOnDrop({ addedIndex, payload }, type) {
      if (addedIndex == null) return;
      if (payload) this.parts[type] = payload;
    },
    getPayload(index) {
      return this.items[index];
    },
    btnClick() {
      axios.post(getApi('tool'), { type: 'asd', parts: [{ material: 'wood' }] });
    },
    formatString(text) {
      return (text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()).split('_').join(' ');
    },
    showModalFn() {
      if (!this.json.completed) return (this.error = 'Build the whole tool');
      this.error = '';
      this.showModal = true;
    },
    async save() {
      let response = await axios[this.$route.params.id ? 'patch' : 'post'](getApi('tool'), {
        ...this.json,
        name: this.toolName,
        description: this.toolDescription,
        id: this.$route.params.id || undefined
      });
      if (response.status == 401) return this.error = '401 Unauthorized';
      if (response.data.error) return this.error = response.data.error;
      this.error = '';
      this.message = response.data.message;
      this.showModal = false;
      this.toolName = '';
      this.toolDescription = '';
      this.parts = {};
      if (this.$route.params.id) this.$route.push('/builder');
    },
  },
  computed: {
    toolTypes() {
      return Object.keys(this.partsData.toolTypes);
    },
    json() {
      let tool = {};
      tool.type = this.toolType;
      tool.parts = JSON.parse(JSON.stringify(this.parts));
      tool.completed = Object.keys(tool.parts).length == getToolLength(this.toolType);
      return tool;
    },
    renderData() {
      return JSON.parse(JSON.stringify(this.parts));
    },
    logged() {
      return !!getToken();
    },
  },
  watch: {
    toolType() {
      this.parts = {};
    },
  },
};
</script>

<style lang="scss" scoped>
#tool-description,
#tool-name {
  display: block;
  resize: none;
  font-family: 'Minecraft', Avenir, Helvetica, Arial, sans-serif;
}

.column {
  background: white;
  margin: 16px 0 0;
  padding: 0 8px;
}

.parts {
  padding: 0 16px 8px;
}

.button-array {
  display: flex;
  margin: 16px 0 -8px;
  justify-content: space-evenly;
}

.view {
  display: flex;
  justify-content: space-around;
  margin: 0 0 32px;
}

.item {
  height: 20px;
  background: red;
}

.draggable-item {
  height: 64px;
  width: 64px;
  margin: 8px;
  background: #777;
  text-align: center;
  vertical-align: center;
  margin: 0 auto;
  border: solid black 2px;
}

// .smooth-dnd-container {
//     box-shadow: 8px 0 0 0 #777, 0 8px 0 0 #777, 4px 4px 0 0 #777, -8px 0 0 0 #e8e8e8, 0 -8px 0 0 #e8e8e8,
//     -4px -4px 0 0 #e8e8e8, 0 0 0 4px #b5b4b5, 4px 8px 0 0 #555, 8px 4px 0 0 #555, -4px -8px 0 0 #e8e8e8,
//     -8px -4px 0 0 #e8e8e8, 8px -4px 0 0 #000, 4px -8px 0 0 #000, -8px 4px 0 0 #000, -4px 8px 0 0 #000,
//     -8px -8px 0 0 #000, 8px 8px 0 0 #000, -12px 0 0 0 #000, -12px -4px 0 0 #000, 12px 0 0 0 #000, 12px 4px 0 0 #000,
//     0 -12px 0 0 #000, -4px -12px 0 0 #000, 0 12px 0 0 #000, 4px 12px 0 0 #000;
// }

.smooth-dnd-draggable-wrapper {
  color: black;
  width: 68px;
  margin: 4px auto 0;
}

.smooth-dnd-draggable-wrapper + .smooth-dnd-draggable-wrapper {
  margin-top: 4px;
}

.draggable-item span {
  height: 100%;
}

.resources-zone {
  display: flex;
  // justify-content: center;
  flex-wrap: wrap;
  align-items: flex-end;
  // background: #42b983;
  // width: 540px;
  min-height: 64px;
  max-width: 540px;
  margin: 4px 32px;
  padding: 6px 0;
}

.item-name {
  width: 72px;
  font-size: 14px;
}

.parts-zone {
  // background: #42b983;
  color: black;
  width: 128px;
  min-height: 87px;
  display: block;
  margin: 20px 0;
  padding: 6px 0;
}

.smooth-dnd-drop-preview-default-class {
  border: none;
}

.select-tool-type {
  font-family: 'Minecraft';
  border: none;
  padding: 2px;
}

.error {
  color: red;
}

.disclaimer {
  color: #0004;
}

.footer {
  display: flex;
  flex-direction: column;
  align-items: center;

  .save {
    margin: 8px;
  }
}
</style>
