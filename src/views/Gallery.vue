<template>
  <select class="select-tool-type" name="type" v-model="toolType">
    <template v-for="type of toolTypes" :key="type">
      <option :value="type">{{ formatString(type) }}</option>
    </template>
  </select>
  <div v-if="items.length > 0">
    <div v-for="(item, index) of items" :key="index" class="item-line">
      <item-render class="img" :size="160" :renderData="item.tool.parts" :toolType="item.tool.type" />
      <item-stats :json="json(item.tool.type, item.tool.parts)" />
      <div>
        <h3>{{ item.tool.name }}</h3>
        <div>"{{ item.tool.description }}"</div>
        <div>by {{ item.owner }}</div>
        <!-- {{item}} -->
      </div>
    </div>
  </div>
  <div class="pages">
    <div class="page" @click="previous">&lt;</div>
    <div v-for="page of pages" :key="page" class="page" :class="page == currPage ? 'selected' : ''" @click="view(page)">
      {{ page }}
    </div>
    <div class="page" @click="next">&gt;</div>
  </div>
</template>

<script>
import axios from 'axios';
import { getApi, getPartsData } from '../utils';
import ItemRender from '@/components/ItemRender';
import ItemStats from '@/components/ItemStats';

export default {
  components: { ItemRender, ItemStats },
  data() {
    let partsData = getPartsData();
    let toolTypes = ['all']
    toolTypes.push(...Object.keys(partsData.toolTypes));
    return {
      items: [],
      currPage: 1,
      pages: 1,
      toolTypes,
      toolType: 'all',
    };
  },
  mounted() {
    this.refreshMeta()
    this.refresh();
  },
  methods: {
    json(toolType, parts) {
      let tool = {};
      tool.type = toolType;
      tool.parts = JSON.parse(JSON.stringify(parts));
      tool.completed = true;
      return tool;
    },
    view(page) {
      if (page > this.pages || page < 1) return;
      this.currPage = page;
      this.refresh();
    },
    previous() {
      if (this.currPage <= 1) return;
      this.currPage--;
      this.refresh();
    },
    next() {
      if (this.currPage >= this.pages) return;
      this.currPage++;
      this.refresh();
    },
    refreshMeta() {
      this.currPage = 1
      axios
        .get(getApi(`tool-meta${this.toolType == 'all' ? '' : `?type=${this.toolType}`}`))
        .then((res) => res.data)
        .then((data) => (this.pages = data.pages));
    },
    refresh() {
      axios
        .get(getApi(`tool?page=${this.currPage}${this.toolType == 'all' ? '' : `&type=${this.toolType}`}`))
        .then((res) => res.data)
        .then((data) => (this.items = data));
    },
    formatString(text) {
      return (text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()).split('_').join(' ');
    },
  },
  watch: {
    toolType() {
      this.refreshMeta()
      this.refresh();
    },
  },
};
</script>

<style lang="scss" scoped>
h3 {
  margin: 4px 0;
}

.select-tool-type {
  font-family: 'Minecraft';
  border: none;
  padding: 2px;
}

.item-line {
  display: flex;
  align-items: center;
  justify-content: space-around;

  border: black solid;
  border-width: 1px 0;
  padding: 4px;
  max-width: 950px;
  margin: auto;

  &:first-child {
    border-width: 0 0 1px;
  }

  &:last-child {
    border-width: 1px 0 0;
  }

  &:only-child {
    border: none;
  }

  .img {
    width: 160px !important;
    margin: 0 4.5%;
  }

  > div {
    width: 25%;
  }
}

.pages {
  display: flex;
  justify-content: center;

  .page {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 26px;
    height: 26px;
    background: gray;
    margin: 8px 16px;
    box-shadow: 3px 0 gray, 0 3px gray, -3px 0 gray, 0 -3px gray;
  }

  .selected {
    cursor: default;
    opacity: 80%;
  }
}
</style>