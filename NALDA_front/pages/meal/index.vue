<template>
  <div class="airfood-container">
    <!-- <h1>주 메뉴 선택</h1> -->
    <div style="height: 6vh; font-size: 30px; text-align: center">
      주메뉴선택
    </div>
    <div id="app">
      <v-app id="inspire">
        <div class="wrapper">
          <page-loader :toggle="toggle" />
          <div v-for="(flightMeal, i) in flightMeals" :key="i" class="food-box">
            <v-card
              v-if="flightMeal.cnt > 0"
              class="mx-auto my-12"
              style="margin: 0; height: 100%"
            >
              <v-img
                height="50%"
                width="100%"
                :src="'data:image/jpg;base64,' + flightMeal.image"
                :alt="flightMeal.menu"
              ></v-img>

              <v-card-title
                style="
                  display: flex;
                  justify-content: center;
                  font-size: 25px;
                  height: 15%;
                "
                >{{ flightMeal.menu }}</v-card-title
              >

              <v-card-text style="height: 20%">
                <div style="font-size: 17px">{{ flightMeal.content }}</div>
              </v-card-text>
              <!-- <div v-if="flightMeal">남은수량: 10개</div> -->

              <v-divider style="margin: 10px"></v-divider>

              <v-card-actions style="height: 10%; padding: 0">
                <div>
                  <v-btn
                    text
                    color="teal accent-4"
                    large
                    style="font-size: 20px; margin-left: 10px"
                    @click="updateCheck(flightMeal)"
                    >세부사항</v-btn
                  >
                </div>
                <v-spacer></v-spacer>
                <div>
                  <button
                    class="mr-3"
                    style="width: 80px; height: 100%; font-size: 20px"
                    @click="updateSelected(i)"
                  >
                    선택
                  </button>
                </div>
              </v-card-actions>

              <v-expand-transition>
                <v-card
                  v-if="flightMeal.check === true"
                  class="transition-fast-in-fast-out v-card--reveal"
                  style="height: 100%"
                >
                  <v-card-text class="pb-0" style="padding: 30px; height: 89%">
                    <div class="text--primary" style="font-size: 40px">
                      세부목록
                    </div>
                    <ul style="font-size: 20px; margin-top: 30px">
                      <li
                        v-for="(detail, idx) in flightMeals[i].details"
                        :key="idx"
                        style="height: 35px"
                      >
                        {{ detail['mealName'] }}
                      </li>
                    </ul>
                    <hr />
                    <div class="text--primary" style="font-size: 40px">
                      알레르기
                    </div>
                    <ul style="font-size: 20px; margin-top: 30px">
                      <li>{{ flightMeals[i].allergies[0]['allergyType'] }}</li>
                    </ul>
                    <hr />
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="teal accent-4"
                      style="font-size: 20px"
                      @click="updateCheck(flightMeal)"
                      >닫기</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-expand-transition>
            </v-card>

            <!-- 품절 -->
            <v-card
              v-else-if="flightMeal.cnt <= 0"
              class="mx-auto my-12"
              style="
                margin:0; height:100%
                z-index: 3;
                background-image: url('/orders/out-of-stock.png');
                background-size: 40%;
                background-position: center;
                background-color: rgba(0, 0, 0, 0.5);
              "
            >
              <v-img
                height="50%"
                width="100%"
                :alt="flightMeal.menu"
                style="filter: brightness(50%)"
              ></v-img>

              <v-card-title
                style="
                  display: flex;
                  justify-content: center;
                  font-size: 25px;
                  height: 15%;
                  opacity: 0.3;
                "
                >{{ flightMeal.menu }}</v-card-title
              >

              <v-card-text style="height: 20%">
                <div style="font-size: 17px; opacity: 0.5">
                  {{ flightMeal.content }}
                </div>
              </v-card-text>
              <!-- <div v-if="flightMeal">남은수량: 10개</div> -->

              <v-divider style="margin: 10px"></v-divider>

              <v-card-actions style="height: 10%; padding: 0">
                <div>
                  <v-btn
                    text
                    style="
                      font-size: 20px;
                      width: 80px;
                      height: 100%;
                      margin-left: 10px;
                      opacity: 0.5;
                    "
                    >세부사항</v-btn
                  >
                </div>
                <v-spacer></v-spacer>
                <div>
                  <button
                    class="mr-3"
                    style="
                      width: 80px;
                      height: 100%;
                      font-size: 20px;
                      opacity: 0.5;
                    "
                  >
                    선택
                  </button>
                </div>
              </v-card-actions>
            </v-card>
            <!-- <div>
              <button @click="updateSelected(i)">선택</button>
            </div>-->
          </div>
        </div>
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <v-btn
            class="meal-order-button"
            x-large
            style="background-color: rgb(69, 169, 200); color: white"
            @click="finalChoice"
            >주문하기</v-btn
          >
          <!-- <div class="meal-order-button">주문하기</div> -->
        </div>
      </v-app>
    </div>
    <b-modal id="meal-modal" hide-footer>
      <template #modal-title>알림</template>
      <div class="d-block text-center">
        <h3>이미 주문했습니다.</h3>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('meal-modal')"
        >닫기</b-button
      >
    </b-modal>
    <!-- <button class="choice-button" @click="MoveDetail">선택</button> -->
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import PageLoader from '../../components/PageLoader.vue'
import { choiceMeal } from '@/api/meal'

export default {
  name: 'TestPage2',
  components: {
    PageLoader,
  },
  data() {
    return {
      finalDetail: [],
      info: {
        flightNum: null,
        mealMenu: null,
        username: null,
        seatNum: null,
        status: 'PROGRESS',
      },
      select: {},
      detailOfMeal: [],
      allergiesOfMeal: [],
    }
  },
  computed: {
    ...mapState('meal', [
      'selectedMeal',
      'flightMeals',
      'details',
      'allergies',
      'validMsg',
      'stock',
      'total',
    ]),
    ...mapState('user', ['loginMember', 'flightNum', 'seatInfo']),
    toggle() {
      if (this.flightMeals.length === 0) return true
      else return false
    },
  },
  created() {
    // flightNum받아와서 넣어야함
    const promise = new Promise((resolve, reject) => {
      resolve()
    })
    promise.then(async () => {
      await this.getFlightMeal(this.flightNum)
      this.getDetail(this.flightMeals)
      this.getAllergy(this.flightMeals)
      await this.getMealCnt(this.flightNum)
      await this.getMealOrderCnt(this.flightNum)
      this.calcStock()
    })
  },
  methods: {
    ...mapMutations('meal', ['PASSENGER_CALC_STOCK']),
    ...mapActions('meal', [
      'getFlightMeal',
      'getSelectedMeal',
      'getDetail',
      'getAllergy',
      'getMealCnt',
      'getMealOrderCnt',
    ]),

    updateSelected(e) {
      this.$store.commit('meal/updateSelected', e)
    },

    updateCheck(e) {
      this.$store.commit('meal/updateCheck', e)
    },
    calcStock() {
      this.PASSENGER_CALC_STOCK()
    },
    finalChoice() {
      this.flightMeals.forEach((flightMeal) => {
        if (flightMeal.menu === this.selectedMeal && flightMeal.cnt > 0) {
          this.info.flightNum = this.flightNum
          this.info.username = this.loginMember.username
          this.info.seatNum = this.seatInfo.seatNum
          this.info.mealMenu = this.selectedMeal
          const promise = new Promise((resolve, reject) => {
            resolve()
          })
          promise.then(async () => {
            await this.validMeal(this.info.seatNum)
            if (this.validMsg === '가능') {
              choiceMeal(
                this.info,
                () => {
                  this.$router.push('/meal/result')
                },
                (error) => {
                  console.log(error)
                }
              )
            } else {
              this.$bvModal.show('meal-modal')
            }
          })
        }
      })
    },
    ...mapActions('meal', [
      'getDetail',
      'getAllergy',
      'registSeatMeal',
      'validMeal',
    ]),
  },
}
</script>

<style scoped>
@font-face {
  font-family: 'twayfly';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_tway@1.0/twayfly.woff')
    format('woff');
  font-weight: normal;
  font-style: normal;
}

* {
  font-family: 'twayfly';
}

.airfood-container {
  height: 70vh;
}
.airfood-container > h1 {
  text-align: center;
  vertical-align: middle;
  line-height: 10vh;
  height: 10vh;
}
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5vw;
}
.wrapper img {
  width: 400px;
  height: 300px;
}
.wrapper-choice {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.wrapper-choice > div {
  margin-top: 30px;
}
.choice-button {
  display: flex;
  justify-content: center;
  width: 10vw;
  padding: 12px 25px;
  border: none;
  color: white;
  background-color: rgb(69, 169, 200);
  margin: auto;
  left: 0;
  right: 0;
  bottom: 25vh;
}
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
.food-box {
  width: 35%;
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* gap: 10vw; */
}
.meal-order-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 12vw;
  height: 6vh;
  background-color: rgb(69, 169, 200);
  margin-top: 20px;
  font-size: 25px;
  border-radius: 60px;
}
.v-application .my-12 {
  margin-top: 0px !important;
  margin-bottom: 0px !important;
}
:deep(.v-application--wrap) {
  min-height: fit-content;
}
</style>
