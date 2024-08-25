<template>
  <Card>
    <template #title>Page not Found!</template>
    <template #content>
      <p class="m-0">
        The page you are looking for does not exist.
      </p>
    </template>
  </Card>
</template>

<script>
import Card from 'primevue/card';

export default {
  name: 'NotFound',
  components: {
    Card
  }
}
</script>