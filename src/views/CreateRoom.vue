<template>
  <div>
    <button @click="create">Create Room</button>
  </div>
</template>

<script>
import { v1 as uuid } from "uuid";
export default {
  name: "CreateRoom",
  methods: {
    create() {
      const id = uuid();
      this.$router.push({ path: `/room/${id}` });
    },
  },
};
</script>
