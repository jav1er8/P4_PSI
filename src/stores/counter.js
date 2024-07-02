import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const token = ref('')
  const playerId = ref('')
  const email = ref('')
  const gameId = ref('')
  const color = ref('')
  const board_state = ref('')

  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  function setToken(value) {
    token.value = value
  }
  function setPlayerId(value) {
    playerId.value = value
  }
  function setEmail(value) {
    email.value = value
  }
  function setGameId(value) {
    gameId.value = value
  }

  function getGameId() {
    return gameId.value
  }

  function getToken() {
    return token.value
  }

  function getColor() {
    return color.value
  }

  function setColor(value) {
    color.value = value
  }

  function setBoardState(value) {
    board_state.value = value
  }

  function getBoardState() {
    return board_state.value
  }

  return { count, doubleCount, increment , setToken, getToken, 
    setPlayerId, token, playerId, setEmail, email, gameId, setGameId, getGameId, 
    color, setColor, getColor, board_state, setBoardState, getBoardState}
})