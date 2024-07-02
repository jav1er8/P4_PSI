<template>
    <TheChessboard
        :board-config="boardConfig"
        :player-color="playerColor"
        @board-created="(api) => (boardAPI = api)"
        @checkmate="handleCheckmate"
        @move="handleMove"
        @stalemate="handleStalemate"
        @draw="handleDraw"
        @promotion="handlePromotion"
        >
    </TheChessboard>
    <table class="tabla" data-cy="moveTable">
        <tr v-for="(move, index) in moves" :key="index">
            <td>{{ move.white}}</td>
            <td>{{ move.black }}</td>
        </tr>
    </table>
    <div>
        <button @click="boardConfig.coordinates = !boardConfig.coordinates">
            Toggle coordinates
        </button>
        <button @click="boardConfig.viewOnly = !boardConfig.viewOnly">
            Toggle view only
        </button>
        <button
            @click="boardConfig.animation.enabled = !boardConfig.animation.enabled"
        >
            Toggle animations
        </button>
        <button
            @click="boardConfig.draggable.enabled = !boardConfig.draggable.enabled"
        >
            Toggle draggable
        </button>
        <p>Game ID: {{ gameID }}</p>
        </div>
    <div
        v-if="checkmated && mated==='white'"
        data-cy="winMsg"
        class="alert alert-success"
        role="alert"
    >
        Black Wins
    <button @click="router.push('/creategame')" data-cy=createGame-button-in-play>PLAY NEW GAME</button>
    </div>
    <div
        v-if="checkmated && mated==='black'"
        data-cy="winMsg"
        class="alert alert-success"
        role="alert"
    >
        White Wins
    <button @click="router.push('/creategame')" data-cy=createGame-button-in-play>PLAY NEW GAME</button>
    </div>
    <div
        v-if="draw"
        data-cy="winMsg"
        class="alert alert-success"
        role="alert"
    >
        Draw
    <button @click="router.push('/creategame')" data-cy=createGame-button-in-play>PLAY NEW GAME</button>
    </div>
    <div
        v-if="stalemate"
        data-cy="winMsg"
        class="alert alert-success"
        role="alert"
    >
        Stalemate
    <button @click="router.push('/creategame')" data-cy=createGame-button-in-play>PLAY NEW GAME</button>
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted } from 'vue';
    import { TheChessboard } from 'vue3-chessboard';
    import 'vue3-chessboard/style.css';
	import { useCounterStore } from '../stores/counter.js';

    // Componentes del juego
    const moves = ref([]);
    const store = useCounterStore();
    const gameID = store.gameID;
    const playerColor = store.color;
    // Eventos
    const checkmated = ref(false);
    const mated = ref('');
    const draw = ref(false);
    const stalemate = ref(false);
    // Socket 
    //const url = 'wss://127.0.0.1:8000/ws/play/' + store.gameId + '/?' + store.token;
    const baseUrl = import.meta.env.VITE_DJANGOURL_PLAY; 
    const url = baseUrl + store.gameId + '/?' + store.token; 
    console.log('URL:', url);
    const socket = new WebSocket(url);
    let boardAPI;

    // Configuración del tablero
    const boardConfig = reactive({
        coordinates: true,
        viewOnly: false,
        animation: { enabled: true },
        draggable: { enabled: true },
        fen: store.board_state,
        orientation: playerColor,
        events: {
            move: (from, to) => {
                console.log("Move event received:", from, to);
            },
        },
        trustAllEvents: true,
    });

    function handleCheckmate(isMated) {
        checkmated.value = true;
        mated.value = isMated;
    }

    function handleStalemate () {
        stalemate.value = true;
        alert('Stalemate');
    }
    
    function handleDraw() {
        draw.value = true;
        alert('Draw');
    }

    function handlePromotion () {
        alert('Promotion');
    }

    function handleMove(move) {
        let color;
        if (store.color === 'black') {
            color = 'b';
        } else if (store.color === 'white') {
            color = 'w';
        }
        // Sólo mando el mensaje si soy el jugador logueado 
        if(move.color === color) {
            moves.value.push({
                white: move.color === 'w' ? move.from + move.to : '',
                black: move.color === 'b' ? move.from + move.to : ''
            });

            // Si está abierto el WebSocket, envío el movimiento
            if (socket.readyState === WebSocket.OPEN) {
                const promotion = move.promotion ? move.promotion : "";
                socket.send(JSON.stringify({
                'type': 'move',
                'from': move.from,
                'to': move.to,
                'playerID': store.playerID,
                'promotion': promotion,
                }));
            } else {
                console.error('WebSocket cerrado:', socket.readyState);
            }
        }
    }

    function connectToWebSocket() {
        socket.onopen = () => {
            console.log('WebSocket Conectado');
        };

        // Función que se ejecuta cada vez que recibo un mensaje del socket 
        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if (data.type === 'game') {
                console.log("Game:", data);
            } else if (data.type === 'move') {
                console.log("Move:", data);
                const uci_move = data.from + data.to + (data.promotion ? data.promotion : "");
                if (store.playerID !== data.playerID && boardAPI) {
                boardAPI.move(uci_move);
                moves.value.push({
                    white: store.color === 'white' ? data.from + data.to : '',
                    black: store.color === 'black' ? data.from + data.to : '',
                });
                }
            } else if (data.type === 'error') {
                console.log('Error message received:', data.message);
            }
        };
    }

    // Conexion al WebSocket 
    onMounted(() => {
        connectToWebSocket();
    });
</script>


<style scoped>

</style>