import { apiInstance } from '.'

const api = apiInstance()

// 서비스 part

async function listSnack(success, fail) {
  await api.get(`/orders/SNACK`).then(success).catch(fail)
}
async function listAlcohols(success, fail) {
  await api.get(`/orders/ALCOHOLS`).then(success).catch(fail)
}
async function listNonAlcohols(success, fail) {
  await api.get(`/orders/NON-ALCOHOLS`).then(success).catch(fail)
}
async function inputOrders(orders, success, fail) {
  await api
    .post(`/orders/submit`, JSON.stringify(orders))
    .then(success)
    .catch(fail)
}
async function listServiceCnt(flightNum, success, fail) {
  await api.get(`orders/count/${flightNum}`).then(success).catch(fail)
}
async function listOrderCnt(flightNum, success, fail) {
  await api.get(`orders/total/${flightNum}`).then(success).catch(fail)
}

export {
  listSnack,
  listAlcohols,
  listNonAlcohols,
  inputOrders,
  listServiceCnt,
  listOrderCnt,
}
