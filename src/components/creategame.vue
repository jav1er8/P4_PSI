<template> 
  <div class="container" :style="{ backgroundImage: `url(${backgroundImage})` }">
        <div class="wrapper">
            <h1>Create Game</h1>
            <!--Combobox-->
            <select v-model="selectedColor" name="Select a game" id="selectGame">
                <option value="" disabled selected>Select a game</option>
                <option value="game_join_any">Join any game</option>
                <option value="Join specific game (gameID required)">Join specific game (gameID required)</option>
            </select> 
            <!--Si selecciona un juego especifico -> tiene que introducir su game id-->
			<label for="gameID" data-cy="gameID" v-if="selectedColor === 'Join specific game (gameID required)'">Enter gameID</label>
			<input
				v-if="selectedColor === 'Join specific game (gameID required)'"
				type="text"
				placeholder="gameID"
			> 
            <!--Boton de crear juego-->
            <button @click="createGame" data-cy="createGame-button">Create Game</button>
			<!--Mensaje de error-->
			<div data-cy="error-message">{{ errorMessage }}</div>
        </div>
    </div>
</template>

<script>
	import backgroundImage from '/images/pieza-ajedrez-dramatica.jpg'
	import { useCounterStore } from '../stores/counter.js';
	import { useRouter } from 'vue-router';
	import { ref } from 'vue';

	export default {
		// Nombre del componente 
		name: 'create-game', 
		setup() {
			const selectedColor = ref(''); 
			const errorMessage = ref('');
			const store = useCounterStore();
			const router = useRouter();
			// const baseUrl = 'http://127.0.0.1:8000/api/v1'
			// 'https://practica3-psi.onrender.com/api/v1/games/'
			const baseUrl = import.meta.env.VITE_DJANGOURL; 

			// Funcion para crear un juego 
			const createGame = async () => {
				// Join Specific game -> funcionalidad no implementada
				if (selectedColor.value === 'Join specific game (gameID required)') {
					console.log('Creating game...');
				}
				// Join Any Game -> Petición a la api 
				else if (selectedColor.value === 'game_join_any') {
					// Llamada a la api 
					const api_call_create_game = await fetch (baseUrl + '/games/', {
						method: 'POST',
						headers: { 
							'Content-Type': 'application/json',
							'Authorization': 'token ' + store.token // Aquí se envía el token en el encabezado
						},
					}); 

					if (api_call_create_game.ok) {
						const response = await api_call_create_game.json();
						const gameId = response.id;
						console.log('Response:', response);
						store.setGameId(gameId);
						console.log('playerId:', store.playerId);
						console.log('whitePlayer:', response.whitePlayer);
						console.log('blackPlayer:', response.blackPlayer);
						// Asignar el color al jugador 
						if (response.whitePlayer === store.playerId) {
							store.color = 'white';
						} if (response.blackPlayer === store.playerId){
							store.color = 'black';
						}
						console.log('Color:', store.color);
						// Guardar el tablero en pinia
						store.board_state = response.board_state; 

						// Redirigir a la página de juego
						router.push('/play')
					} else {
						// Alerta diciendo que el juego está activo
						const response = await api_call_create_game.json(); 
						console.log(store.gameId);
						// El token lo coge bien 
						console.log(store.token);
						if (response.detail === 'Create Error: Game is already active') {
							alert('You have an active game. Please finish it before creating a new one.')
							router.push('/play')
						}
						errorMessage.value = "Error: Cannot create game"
					}
				}
			}; 

			return {
				selectedColor, 
				backgroundImage, 
				errorMessage, 
				createGame, 
			}
		}
	}
</script>

<style scoped>
  .container {
		display: flex;
		align-items: center;
		height: 100vh;
		background-size: cover; 
		background-position: center; 
		border-radius: 10px;
  }
	.wrapper {
		display: flex;
		flex-direction: column; 
		background-color: rgba(187, 186, 186, 0.5);
		padding: 20px;
		margin-top: 70px; 
		box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
		border-radius: 10px;
    transition: box-shadow 0.35s ease; 
	}
	.wrapper h1 {
		color: white;
		font-size: 2.2em; 
	}
	select {
		margin: 10px;
		padding: 10px;
		border-radius: 10px;
		border: 1px solid black;
		box-shadow: 5px 5px 5px rgb(70, 60, 60); 
		width: 500px; 
	}
	.wrapper:hover {
		box-shadow: 5px 5px 5px rgba(255, 255, 255, 0.5); 
	}

</style>