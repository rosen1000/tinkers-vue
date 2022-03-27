<template>
  <div v-if="items.length > 0">
    <div v-for="(item, index) of items" :key="index" class="item-line">
      <item-render :renderData="item.tool.parts" :toolType="item.tool.type"></item-render>
      <item-stats :json="json(item.tool.type, item.tool.parts)"></item-stats>
      <!-- {{item}} -->
      <div>
        <div>by {{ item.owner }}</div>
        <div>"{{ item.description }}"</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getApi } from '../utils';
import ItemRender from '@/components/ItemRender';
import ItemStats from '@/components/ItemStats';

export default {
  components: { ItemRender, ItemStats },
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    axios
      .get(getApi('tool'))
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        this.items = data;
      });
  },
  methods: {
    json(toolType, parts) {
      let tool = {};
      tool.type = toolType;
      tool.parts = JSON.parse(JSON.stringify(parts));
      tool.completed = true//Object.keys(tool.parts).length == getToolLength(toolType);
      console.log(tool);
      return tool;
    },
  },
};
</script>

<style lang="scss" scoped>
.item-line {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>