<template>
  <div class="service-navbar">
    <div class="service-navbar-home" @click="MoveOrders">
      <div>날다</div>
      <div>Home</div>
    </div>
    <div class="service-navbar-snack" @click="MoveSnack">
      <img src="../static/orders/dessert.png" alt="" />
      <span style="color: white">간식</span>
    </div>
    <div class="service-navbar-alcohol" @click="MoveAlcohol">
      <img src="../static/orders/drink.png" alt="" />
      <span style="color: white">주류</span>
    </div>
    <div class="service-navbar-nonalcohol" @click="MoveNonAlcohol">
      <img src="../static/orders/coffee_cup.png" alt="" />
      <span style="color: white">비주류</span>
    </div>
    <div class="service-navbar-profile">
      <button>뒤로</button>
      <img
        src="../static/main/user_profile_w.png"
        style="width: 15%; height: 60%; margin: 7px"
        alt=""
      />
      <div style="color: white; font-size: 35px">김익명</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ServiceNavbar',
  computed: {
    ...mapState('menu', ['selected_foods']),
  },
  mounted() {
    if (document.location.pathname === '/orders/snack') {
      const target = document.getElementsByClassName('service-navbar-snack')[0]
      target.style.borderBottomStyle = 'solid'
      target.style.borderBottomWidth = '0.5vh'
    } else if (document.location.pathname === '/orders/alcohol') {
      const target = document.getElementsByClassName(
        'service-navbar-alcohol'
      )[0]
      target.style.borderBottomStyle = 'solid'
      target.style.borderBottomWidth = '0.5vh'
    } else {
      const target = document.getElementsByClassName(
        'service-navbar-nonalcohol'
      )[0]
      target.style.borderBottomStyle = 'solid'
      target.style.borderBottomWidth = '0.5vh'
    }
  },
  methods: {
    MoveOrders() {
      this.$router.push('/main/service')
      this.CLEAR_CHOICE_FOODS()
    },
    MoveSnack() {
      this.$router.push('/orders/snack')
    },
    MoveAlcohol() {
      this.$router.push('/orders/alcohol')
    },
    MoveNonAlcohol() {
      this.$router.push('/orders/nonalcohol')
    },
    ...mapMutations('menu', [
      'SET_CHOICE_FOODS',
      'DELETE_CHOICE_FOODS',
      'CLEAR_CHOICE_FOODS',
      'PLUS_CHOICE_FOODS',
      'MINUS_CHOICE_FOODS',
    ]),
  },
}
</script>

<style scoped>
.service-navbar {
  display: flex;
  width: 100%;
  height: 15vh;
  background-color: rgb(69, 169, 200);
}
.service-navbar-home {
  display: flex;
  flex-direction: column;
  color: white;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-size: 30px;
}
.service-navbar-snack {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-size: 20px;
}
.service-navbar-alcohol {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-size: 20px;
}
.service-navbar-nonalcohol {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-size: 20px;
}
.service-navbar-profile {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* 아래 크기 조정해서 오른쪽 여백주기 */
  margin-right: 50px;
  /* 아래 box사이즈 조정해서 크기조절하기 */
  flex-basis: 250px;
}
.service-navbar img {
  width: 50%;
  height: 80%;
}
</style>
