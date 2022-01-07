<template>
  <ItemRender></ItemRender>
</template>

<script>
import Item from '@/components/Item';
import ItemRender from '@/components/ItemRender';
import { Container, Draggable } from "vue3-smooth-dnd";

export default {
  name: "ItemContainer",
  components: {
    Item,
    ItemRender,
    Container,
    Draggable
  },
  props: [''],
  methods: {
  },
  data() {
    return {
    };
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
