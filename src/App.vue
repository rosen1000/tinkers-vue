<template>
  <img draggable="false" alt="Vue logo" src="./assets/logo.png" />
  <div style="display: flex">
    <Container
      group-name="items"
      @drop="onDrop"
      drag-class="drag-ghost"
      drop-class="drag-ghost-drop"
      :drop-placeholder="options"
      behaviour="copy"
      :get-child-payload="getPayload"
    >
      <Draggable v-for="item in items" :key="item.id">
        <div class="draggable-item">
          <Item :material="item.data" :part="item.part"></Item>
        </div>
      </Draggable>
    </Container>

    <Container
      group-name="items"
      @drop="replaceOnDrop"
      drag-class="drag-ghost"
      drop-class="drag-ghost-drop"
      :drop-placeholder="options"
      behaviour="drop-zone"
    >
      <Draggable v-if="items2.length == 1">
        <div class="draggable-item">
          <Item :material="items2[0].data" :part="items2[0].part" />
        </div>
      </Draggable>
    </Container>

    <button @click="btnClick">click me</button>

    <!-- <item-container></item-container> -->
  </div>
</template>

<script>
import Item from '@/components/Item';
import ItemContainer from '@/components/ItemContainer';
import { Container, Draggable } from 'vue3-smooth-dnd';

export default {
  name: 'App',
  components: {
    Item,
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
      items2: [],
      options: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true,
      },
    };
  },
  methods: {
    onDrop({ removedIndex, addedIndex, payload }) {
      let temp = this.items[removedIndex];
      // this.items.forEach(console.log)
      console.log(removedIndex, addedIndex, payload);
      this.items.splice(removedIndex, 1);
      this.items.splice(addedIndex, 0, temp);
      // console.log(dropResult);
    },
    replaceOnDrop({ payload }) {
      this.items2 = [payload];
    },
    getPayload(index) {
      return this.items[index];
    },
    btnClick() {
      fetch('http://127.0.0.1:8080/new-tool', {method: 'POST', body: JSON.stringify({type: "asd", "parts": [{"material": "wood"}]})})
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
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
}
.draggable-item span {
  height: 100%;
}
.smooth-dnd-container {
  background: #b44;
  width: 165px;
  min-height: 200px;
  display: block;
  margin: auto;
}
.smooth-dnd-drop-preview-default-class {
  border: none;
}
</style>
