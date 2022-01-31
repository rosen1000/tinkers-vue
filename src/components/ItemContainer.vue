<template>
<!-- TODO -->
  <span v-for="i of parts" v-bind:key="i">
  <Container group-name="items">
    <Draggable>
      <div>
        <Item material="wood" :part="i"/>
      </div>
    </Draggable>
  </Container>
  </span>
  <ItemRender :toolType="toolType" :renderData="renderData"></ItemRender>
  <button @click="click"></button>
</template>

<script>
import Item from '@/components/Item';
import ItemRender from '@/components/ItemRender';
import { Container, Draggable } from 'vue3-smooth-dnd';

export default {
  name: 'ItemContainer',
  components: {
    Item,
    ItemRender,
    Container,
    Draggable,
  },
  props: [''],
  methods: {
    click() {
      this.renderData = [['head', 'stone']];
    },
  },
  data() {
    return {
      renderData: [
        ['head', 'bone'],
        ['handle', 'wood'],
        ['binding', 'stone'],
      ],
      toolType: 'pickaxe',
    };
  },
  computed: {
    parts() {
      // TODO: check all required parts again and order
      switch (this.toolType) {
        case 'broad_axe':
          return ['back', 'handle', 'binding'];
        case 'cleaver':
          return ['head', 'shield', 'handle', 'guard'];
        case 'dagger':
          return ['blade', 'crossguard'];
        case 'excavator':
          return ['binding', 'grip', 'handle', 'head'];
        case 'hand_axe':
          return ['binding', 'head'];
        case 'kama':
          return ['binding', 'head'];
        case 'mattock':
          return ['axe', 'pick'];
        case 'pickaxe':
          return ['head', 'handle', 'binding'];
        case 'scythe':
          return ['accessory', 'binding', 'handle', 'head'];
        case 'sledge_hammer':
          return ['back', 'front', 'handle', 'head'];
        case 'sword':
          return ['blade', 'guard', 'handle'];
        case 'vein_hammer':
          return ['back', 'front', 'handle', 'head'];
      }
      return [];
    },
  },
};
</script>

<style scoped>
.item {
  margin: 16px;
  /* width: 16px; */
  height: 20px;
  background: green;
}
</style>
