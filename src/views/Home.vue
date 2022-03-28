<template>
  <div class="home">
    <img src="../assets/tic.png" alt="Tinkers Contruct" width="600">
    <h1 class="title">Tinkers' Construct Tool Builder</h1>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-flow: column;
  align-items: center;

  .title {
    margin: 24px 0 16px;
  }
}
</style>