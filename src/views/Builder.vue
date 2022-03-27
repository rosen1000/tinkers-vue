<template>
  <div class="view">
    <div>
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

    <div>
      <h3>Parts</h3>
      <template v-if="toolType">
        <template v-for="type of partsData.toolTypes[toolType].parts" :key="type">
          <Container class="parts-zone" group-name="items" @drop="replaceOnDrop($event, type)" behaviour="drop-zone">
            <span>{{ formatString(type) }}</span>
            <Draggable>
              <span class="item-name">{{ formatString(parts[type].data) }}</span>
              <div class="draggable-item">
                <Item :toolType="toolType" :material="parts[type].data" :part="type" />
              </div>
            </Draggable>
          </Container>
        </template>
        <button>clear</button>
      </template>
      <template v-else> Select tool type </template>
    </div>

    <div>
      <h3>Built tool</h3>
      <select class="selectToolType" name="type" v-model="toolType">
        <template v-for="type of toolTypes" :key="type">
          <option :value="type">{{ formatString(type) }}</option>
        </template>
      </select>
      <item-stats style="margin: 8px 0;" v-model:json="json" v-show="json.completed"></item-stats>
      <span v-show="!json.completed">
        <span style="display: block;">Select parts <br> to show stats</span>
      </span>
      <item-render :toolType="toolType" :renderData="renderData" />
    </div>

  </div>
  <div class="footer">
    <button class="save" @click="save">save</button>
    <span>{{ message }}</span>
    <span class="error">{{ error }}</span>
    <small class="disclaimer">* Calculations are not guaranteed to be correct</small>
  </div>
</template>

<script>
import Item from '@/components/Item';
import ItemStats from '@/components/ItemStats';
import ItemRender from '@/components/ItemRender';
import { Container, Draggable } from 'vue3-smooth-dnd';
import { getApi, getPartsData, getToolLength } from '../utils';
import axios from 'axios';

export default {
  name: 'Builder',
  components: {
    Item,
    ItemStats,
    ItemRender,
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
      parts: {},
      // types: ['small_blade', 'tool_handle', 'tool_binding'],
      toolType: 'sword',
      partsData,
      error: '',
      message: '',
    };
  },
  methods: {
    onDrop({ removedIndex, addedIndex, payload }) {
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
    async save() {
      let response = await axios.post(getApi('tool'), { ...this.json });
      if (response.status == 401) this.error = '401 Unauthorized';
      if (response.data.error) this.error = response.data.error;
      this.error = '';
      this.message = response.data.message;
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
  },
  watch: {
    toolType() {
      this.parts = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.view {
  display: flex;
  justify-content: space-evenly;
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
  background: #42b983;
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
  background: #42b983;
  color: black;
  width: 128px;
  min-height: 87px;
  display: block;
  margin: 4px 0;
  padding: 6px 0;
}

.smooth-dnd-drop-preview-default-class {
  border: none;
}

.selectToolType {
  font-family: 'Minecraft';
  border: none;
  padding: 2px;
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
