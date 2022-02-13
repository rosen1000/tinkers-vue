<template>
  <!-- <img draggable="false" alt="Vue logo" src="../assets/logo.png" /> -->
  <div class="view">
    <div>
      <h3>Resources</h3>
      <Container group-name="items" behaviour="copy" :get-child-payload="getPayload">
        <Draggable v-for="item in items" :key="item.id">
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
          <Container group-name="items" @drop="replaceOnDrop($event, type)" behaviour="drop-zone">
            <span>{{ formatString(type) }}</span>
            <Draggable>
              <div class="draggable-item">
                <Item :toolType="toolType" :material="parts[type].data" :part="type" />
              </div>
            </Draggable>
          </Container>
        </template>
      </template>
      <template v-else> Select tool type </template>
    </div>

    <div>
      <h3>Built tool</h3>
      <item-stats v-model:json="json" v-show="json.completed"></item-stats>
      <span v-show="!json.completed">
        Select parts to<br />
        show stats
      </span>
    </div>

    <div>
      <h3>Tool type</h3>
      <select class="selectToolType" name="type" v-model="toolType">
        <template v-for="type of toolTypes" :key="type">
          <option :value="type">{{ formatString(type) }}</option>
        </template>
      </select>
    </div>

    <!-- <button @click="btnClick">click me</button> -->

    <!-- <item-container></item-container> -->
  </div>

  <small class="disclaimer">* Calculations are not guaranteed to be correct</small>
</template>

<script>
import Item from '@/components/Item';
import ItemStats from '@/components/ItemStats';
import ItemContainer from '@/components/ItemContainer';
import { Container, Draggable } from 'vue3-smooth-dnd';
import { getPartsData, getToolLength } from '../utils';

export default {
  name: 'Builder',
  components: {
    Item,
    ItemStats,
    ItemContainer,
    Container,
    Draggable,
  },
  data() {
    return {
      items: [
        {
          id: 1,
          data: 'wood',
          part: 'tool_handle',
        },
        {
          id: 2,
          data: 'stone',
          part: 'tool_binding',
        },
        {
          id: 3,
          data: 'bone',
          part: 'small_blade',
        },
      ],
      parts: {},
      types: ['small_blade', 'tool_handle', 'tool_binding'],
      toolType: 'sword',
      partsData: getPartsData(),
    };
  },
  methods: {
    onDrop({ removedIndex, addedIndex, payload }) {
      let temp = this.items[removedIndex];
      // this.items.forEach(console.log)
      // console.log(removedIndex, addedIndex, payload);
      this.items.splice(removedIndex, 1);
      this.items.splice(addedIndex, 0, temp);
      // console.log(dropResult);
    },
    replaceOnDrop({ addedIndex, payload }, type) {
      if (addedIndex == null) return;
      this.parts[type] = payload;
    },
    getPayload(index) {
      return this.items[index];
    },
    btnClick() {
      fetch('http://127.0.0.1:8080/new-tool', {
        method: 'POST',
        body: JSON.stringify({ type: 'asd', parts: [{ material: 'wood' }] }),
      });
    },
    formatString(text) {
      return (text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()).split('_').join(' ');
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
  margin: 0 0 64px;
}

.item {
  height: 20px;
  background: red;
}

.draggable-item {
  height: 64px;
  width: 150px;
  margin: 8px;
  background: #777;
  text-align: center;
  vertical-align: center;
  margin: 0 auto;
  border: solid black 2px;
}

.smooth-dnd-draggable-wrapper + .smooth-dnd-draggable-wrapper {
  margin-top: 4px;
}

.draggable-item span {
  height: 100%;
}

.smooth-dnd-container {
  background: #b44;
  width: 165px;
  min-height: 64px;
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
</style>
