import axios from 'axios'

export const state = () => ({
  // item: 물품 하나 선택하면 모달창에 띄우는 아이템
  item: [{ download_url: null, author: null, num: null }],
  // items: 전체 메뉴 가져옴.
  items: [],
  // selected_foods 장바구니에 담기.
  selected_foods: [],
  check_foods: [],
})

export const mutations = {
  SET_ITEM(state, select) {
    state.item.push(select)
  },
  SET_MENU_ITEMS(state, snacks) {
    snacks.service.forEach((snack) => {
      snack.num = '1'
      state.items.push(snack)
    })
  },
  SET_CHOICE_FOODS(state, choice) {
    if (!state.check_foods.includes(choice[0].serviceName)) {
      state.selected_foods.push(choice[0])
      state.check_foods.push(choice[0].serviceName)
    }
    const modal = document.getElementsByClassName('service-modal')[0]
    modal.style.display = 'none'
  },
  DELETE_CHOICE_FOODS(state, choice) {
    for (let i = 0; i < state.selected_foods.length; i++) {
      if (state.selected_foods[i].author === choice.author) {
        state.selected_foods.splice(i, 1)
        state.check_foods.splice(i, 1)
      }
    }
    choice.num = '1'
  },
  PLUS_CHOICE_FOODS(state, choice) {
    choice.num = parseInt(choice.num) + 1
    // for (let i = 0; i < state.selected_foods.length; i++) {
    //   if (
    //     state.selected_foods[i].name === choice &&
    //     state.selected_foods[i].num > 1
    //   ) {
    //     state.selected_foods[i].num += 1
    //   }
    // }
  },
  MINUS_CHOICE_FOODS(state, choice) {
    if (choice.num > 1) {
      choice.num = parseInt(choice.num) - 1
    }
    // for (let i = 0; i < state.selected_foods.length; i++) {
    //   if (
    //     state.selected_foods[i].name === choice &&
    //     state.selected_foods[i].num > 1
    //   ) {
    //     state.selected_foods[i].num -= 1
    //   }
    // }
  },
  CLEAR_ITEM(state) {
    state.item = []
  },
  CLEAR_ITEMS(state) {
    state.items = []
  },
  CLEAR_CHOICE_FOODS(state) {
    state.selected_foods = []
  },
}

export const getters = {}

export const actions = {
  getsnack({ commit }) {
    axios
      // 서버켰을때 조정
      .get('http://localhost:8080/orders/SNACK')
      // 실험할때
      // .get('https://picsum.photos/v2/list?page=2&limit=6')
      .then(function (response) {
        commit('SET_MENU_ITEMS', response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  getalcohol({ commit }) {
    axios
      // 서버켰을때 조정
      .get('http://localhost:8080/orders/ALCOHOLS')
      // 실험할때
      // .get('https://picsum.photos/v2/list?page=2&limit=2')
      .then(function (response) {
        commit('SET_MENU_ITEMS', response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  getnonalcohol({ commit }) {
    axios
      // 서버켰을때 조정
      .get('http://localhost:8080/orders/NON-ALCOHOLS')
      // 실험할때
      // .get('https://picsum.photos/v2/list?page=2&limit=3')
      .then(function (response) {
        commit('SET_MENU_ITEMS', response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  },
}
