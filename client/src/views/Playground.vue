<template>
  <div>
    <h1>Playground</h1>
    Sugoi woi woi!!<br><br>
    <Files />
    <br><br>
    <input
      v-model="something"
      type="text"
    >
    <button @click="sendMessage(something)"> Clicky!</button>
    <br><br>
    <button @click="startDownload">Download!</button><br>
    <progress
      v-bind:value="percentage"
      max="100"
    ></progress>
  </div>
</template>

<script>
import Files from "@/components/Files.vue";

export default {
  name: "playground",
  components: {
    Files
  },
  mounted() {},
  data() {
    return {
      percentage: 0,
      something: "strange"
    };
  },
  sockets: {
    downloadPer: function(per) {
      this.percentage = per;
    },

    finished: function() {
      this.$swal({
        title: "Download Finished!",
        type: "success",
        toast: true,
        position: "top-start",
        timer: 4000,
        showConfirmButton: false
      });
      this.percentage = 0;
    },

    messages: function(data) {
      console.log("Recieved!: ", data);
    }
  },
  methods: {
    sendMessage: function(msg) {
      console.log("Sent!: ", msg);
      this.$socket.emit("newMessage", msg);
    },

    startDownload: function() {
      this.$socket.emit("startDownload");
    }
  }
};
</script>

<style lang="scss">
.table-wrap {
  width: 60%;
  margin: 0 auto;
  text-align: center;
}
table th,
table tr {
  text-align: left;
}
table thead {
  background: #f2f2f2;
}
table tr td {
  padding: 10px;
}
table tr:nth-child(odd) {
  background: #f2f2f2;
}
table tr:nth-child(1) {
  background: #4d7ef7;
  color: #fff;
}
a {
  color: #4d7ef7;
  text-decoration: none;
}
a.button {
  display: block;
  color: #f2f2f2;
  background-color: #4d7ef7;
  border-radius: 3px;
  width: 90px;
  margin: 10px auto 0;
  padding: 5px 0;
}
a.add_post_link {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
}
input {
  padding: 4px;
  margin-bottom: 5px;
}
</style>
