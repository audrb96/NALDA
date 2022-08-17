import {
  listMeal,
  inputMeal,
  endMeals,
  confirmMeal,
  listInput,
  detailMeal,
  allergyMeal,
  selectMeal,
  choiceMeal,
  getSeatMeal,
} from '@/api/meal'

export const state = () => ({
  meals: [],
  flightMeals: [],
  selectedMeal: null,
  details: [],
  allergies: [],
  choiceMeal: [],
  seatMealList: [],
  validMsg: null,
})

export const mutations = {
  updateSelected(state, select) {
    let selectCnt = 0
    state.flightMeals.forEach((flightMeal) => {
      flightMeal.choice && selectCnt++
    })
    if (selectCnt === 0) {
      state.flightMeals[select].choice = !state.flightMeals[select].choice
      document.getElementsByClassName('mx-auto my-12')[select].style.filter =
        'brightness(50%)'
    } else if (selectCnt === 1 && state.flightMeals[select].choice === true) {
      state.flightMeals[select].choice = false
      selectCnt = 0
      document.getElementsByClassName('mx-auto my-12')[select].style.filter =
        null
    } else {
      for (let i = 0; i < state.flightMeals.length; i++) {
        if (state.flightMeals[i].choice) {
          state.flightMeals[i].choice = false
          document.getElementsByClassName('mx-auto my-12')[i].style.filter =
            null
        }
      }
      state.flightMeals[select].choice = true
      document.getElementsByClassName('mx-auto my-12')[select].style.filter =
        'brightness(50%)'
    }
  },
  updateCheck(state, check) {
    for (let i = 0; i < state.flightMeals.length; i++) {
      if (state.flightMeals[i].menu === check.menu) {
        if (check.check === false) {
          check.check = true
        } else {
          check.check = false
        }
      }
    }
  },
  SET_MEAL_LIST(state, meals) {
    state.meals.push(meals)
  },
  SET_FLIGHTMEAL_LIST(state, flightMeals) {
    state.flightMeals.push(flightMeals)
  },
  SET_SELECTED_MEAL(state, selectedMeal) {
    state.selectedMeal = selectedMeal
  },
  SET_DETAIL_MEAL(state, data) {
    for (let i = 0; i < state.flightMeals.length; i++) {
      if (state.flightMeals[i].id === data[1].id) {
        state.flightMeals[i].details = data[0]
      }
    }
  },
  SET_ALLERGY_MEAL(state, data) {
    // state.allergies = allergies
    for (let i = 0; i < state.flightMeals.length; i++) {
      if (state.flightMeals[i].id === data[1].id) {
        state.flightMeals[i].allergies = data[0]
      }
    }
  },
  SET_CHOICE_MEAL(state, choiceMeal) {
    state.choiceMeal = choiceMeal
  },
  SET_SEATMEAL_LIST(state, seatMealList) {
    state.seatMealList = seatMealList
  },
  SET_VALID_MSG(state, validMsg) {
    state.validMsg = validMsg
  },

  CLEAR_MEAL_LIST(state) {
    state.meals = [{ menu: null, image: null }]
  },
  CLEAR_FLIGHTMEAL_LIST(state) {
    state.flightMeals = []
  },
  CLEAR_SELECTED_MEAL(state) {
    state.selectedMeal = {}
  },
  CLEAR_DETAIL_MEAL(state) {
    state.details = []
  },
  CLEAR_ALLERGY_MEAL(state) {
    state.allergies = []
  },
  CLEAR_CHOICE_MEAL(state) {
    state.choiceMeal = []
  },
  CLEAR_SEATMEAL_LIST(state) {
    state.seatMealList = []
  },
  CLEAR_VALID_MSG(state) {
    state.validMeal = null
  },
}
export const getters = {}

// console.log eslint rule수정 충돌방지
export const actions = {
  getMeal({ commit }) {
    listMeal(
      ({ data }) => {
        commit('SET_MEAL_LIST', data)
      },
      (error) => {
        console.log(error)
      }
    )
  },
  registFlightMeal({ commit }, info) {
    inputMeal(
      info,
      ({ data }) => {
        if (data.length > 0) {
          commit('SET_FLIGHTMEAL_LIST', data)
        }
      },
      (error) => {
        console.log(error)
      }
    )
  },
  async validMeal({ commit }, seatNum) {
    await confirmMeal(
      seatNum,
      ({ data }) => {
        commit('SET_VALID_MSG', data.msg)
      },
      (error) => {
        console.log(error)
      }
    )
  },
  endMeal({ commit }, flightNum) {
    commit('CLEAR_MEAL_LIST')
    commit('CLEAR_FLIGHTMEAL_LIST')
    commit('CLEAR_SELECTED_MEAL')
    commit('CLEAR_DETAIL_MEAL')
    commit('CLEAR_ALLERGY_MEAL')
    commit('CLEAR_CHOICE_MEAL')
    commit('CLEAR_SEATMEAL_LIST')
    commit('CLEAR_VALID_MSG')

    endMeals(
      flightNum,
      ({ data }) => {
        console.log(data.msg)
      },
      (error) => {
        console.log(error)
      }
    )
  },
  async getFlightMeal({ commit }, flightNum) {
    commit('CLEAR_FLIGHTMEAL_LIST')
    await listInput(
      flightNum,
      ({ data }) => {
        if (data.meal.length > 0) {
          data.meal.forEach((meal) => {
            commit('SET_FLIGHTMEAL_LIST', {
              id: meal.mealId,
              menu: meal.mealMenu,
              content: meal.content,
              image: meal.bytesdata,
              check: false,
              details: null,
              allergies: null,
              choice: false,
            })
          })
        }
      },
      (error) => {
        console.log(error)
      }
    )
  },
  getSelectedMeal({ commit }, mealId) {
    // commit('CLEAR_SELECTED_MEAL')
    selectMeal(
      mealId,
      ({ data }) => {
        commit('SET_SELECTED_MEAL', data.mealInfo)
      },
      (error) => {
        console.log(error)
      }
    )
  },
  getDetail({ commit }, flightMeals) {
    commit('CLEAR_DETAIL_MEAL')
    for (let i = 0; i < flightMeals.length; i++) {
      detailMeal(
        flightMeals[i].id,
        ({ data }) => {
          if (data.mealDetail.length > 0) {
            const datas = [data.mealDetail, flightMeals[i]]
            commit('SET_DETAIL_MEAL', datas)
          }
        },
        (error) => {
          console.log(error)
        }
      )
    }
  },
  getAllergy({ commit }, flightMeals) {
    commit('CLEAR_ALLERGY_MEAL')
    for (let i = 0; i < flightMeals.length; i++) {
      allergyMeal(
        flightMeals[i].id,
        ({ data }) => {
          if (data.mealAllergy.length > 0) {
            const datas = [data.mealAllergy, flightMeals[i]]
            commit('SET_ALLERGY_MEAL', datas)
          }
        },
        (error) => {
          console.log(error)
        }
      )
    }
  },
  getChoiceMeal({ commit }) {
    commit('CLEAR_CHOICE_MEAL')
    choiceMeal(
      ({ data }) => {
        if (data.length > 0) {
          commit('SET_CHOICE_MEAL', data)
        }
      },
      (error) => {
        console.log(error)
      }
    )
  },
  async getMealList({ commit }, flightNum) {
    commit('CLEAR_SEATMEAL_LIST')
    await getSeatMeal(
      flightNum,
      ({ data }) => {
        if (data.seatMeal.length > 0) {
          commit('SET_SEATMEAL_LIST', data.seatMeal)
        }
      },
      (error) => {
        console.log(error)
      }
    )
  },
}
