<template>
  <v-container class="home">
    <div class="cards">
      <div class="card blueg">
        <v-container class="card-btn">
          <v-icon>mdi-account</v-icon>
          <h3>Моя страница</h3>
        </v-container>
      </div>
      <div class="card blueg">
        <v-container class="card-btn">
          <v-icon>mdi-message</v-icon>
          <h3>Сообщения</h3>
        </v-container>
      </div>
      <div class="card blueg">
        <v-container class="card-btn">
          <v-icon>mdi-group</v-icon>
          <h3>Группы</h3>
        </v-container>
      </div>
      <div class="card blueg">
        <v-container class="card-btn">
          <v-icon>mdi-account</v-icon>
          <h3>Моя страница</h3>
        </v-container>
      </div>
    </div>
    <div class="chat"></div>
  </v-container>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style>
.home {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.cards {
  width: 35%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 25px;
  background-image: linear-gradient(
    135deg,
    rgba(197, 108, 214, 0.8) 0%,
    rgba(52, 37, 175, 0.8) 100%
  );
  box-shadow: 3px 5px 5px black;
}

.card {
  position: relative;
  width: 80%;
  height: 10%;
  border-radius: 25px;
  margin-top: 20px;
  transition: 0.3s ease all;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 5px 3px 3px #212121;
  display: flex;
  align-items: center;
}


.card > .card-btn {
  display: flex;
  flex-direction: row;
  margin-left: 30px;
}

.card > .card-btn > h3{
  margin-left: 10px;
}

.card:hover {
  transform: translate(10%, -5%);
}

/* Hover state - trigger effect */

.card:hover:after {
  opacity: 1;
  top: -30%;
  left: -30%;
  transition-property: left, top, opacity;
  transition-duration: 0.5s, 0.5s, 0.7s;
  transition-timing-function: ease;
}

/* Active state */

.card:active:after {
  opacity: 0;
}

.card:after {
  content: "";
  position: absolute;
  top: -110%;
  left: -210%;
  width: 200%;
  height: 200%;
  opacity: 0;
  transform: rotate(30deg);

  background: rgba(255, 255, 255, 0.13);
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.16) 0%,
    rgba(255, 255, 255, 0.16) 77%,
    rgba(255, 255, 255, 0.10) 92%,
    rgba(255, 255, 255, 0) 100%
  );
}

.orangeg {
  background-image: linear-gradient(135deg, #f2d50f 0%, #da0641 80%);
}

.blueg {
  background-image: linear-gradient(135deg, #13f1fc 0%, #0470dc 100%);
}

.purpleg {
  background-image: linear-gradient(135deg, #ff57b9 0%, #a704fd 100%);
}

.greeng {
  background: linear-gradient(135deg, #42e695 0%, #3bb2b8 100%);
}

.chat {
  width: 60%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: black;
  border-radius: 25px;
  background-image: linear-gradient(
    135deg,
    rgba(197, 108, 214, 0.8) 0%,
    rgba(52, 37, 175, 0.8) 100%
  );
  box-shadow: 3px 5px 5px black;
}
</style>
