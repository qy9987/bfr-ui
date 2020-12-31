<template>
  <div id="app" class="is-component">
    <main-header />
    <div class="main-cnt">
      <router-view />
    </div>
    <main-footer />
  </div>
</template>

<script>

export default {
  name: 'App',
};
</script>
