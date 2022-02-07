<template>
  {{ json }}
</template>

<script>
export default {
    props: ['json'],
    updated() {
      if (!json.completed) return;
      console.log(true);
    }
};
</script>

<style>
</style>
