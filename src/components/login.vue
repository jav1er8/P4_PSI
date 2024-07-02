<template>
	<form @submit.prevent="logIn"> 
		<div class="container-padre">
			<div class="container">
				<h1>
					My Chess LogIn Page
				</h1>
				<p>
					Do not have an account? <router-link to="/sign-up">Sign Up</router-link>
				</p>
				<!--Email-->
				<input 
					placeholder="Email"
					v-model="email"
					type="email"
					data-cy="username"
					required
				> 
				<!--Password-->
				<input
					placeholder="Password"
					v-model="password"
					type="password"
					data-cy="password"
					required
				>
				<!--Botón de LogIn-->
				<button type="submit" value="LogIn" data-cy="login-button">Log In</button>
				<!--Mensaje de error-->
				<div data-cy="error-message">{{ errorMessage }}</div>
				<p>
					Welcome to our chess page. If you want to kwnow what led us to create yet another chess site, then read on... <router-link to="/here">here</router-link>
				</p>
			</div>
			<aside>
				<img src="/images/chess_image.jpg" alt="">
			</aside>
		</div>

	</form>
</template>

<script>
	import { ref } from 'vue';
	import { useCounterStore } from '../stores/counter.js';
	import { useRouter } from 'vue-router';

	export default {
		// Nombre del componente 
		name: 'login-vue', 

		setup() {
			const email = ref(''); 
			const password = ref('');
			const router = useRouter();
			// Manejo del error al hacer login 
			const errorMessage = ref(''); 
			//const baseUrl = 'http://127.0.0.1:8000/api/v1'
			// 'https://practica3-psi.onrender.com/api/v1/mytokenlogin/'
			const baseUrl = import.meta.env.VITE_DJANGOURL; 

			const logIn = async () => { 
				// Llamo a la api para loguearme y aquí me devuelve el token
				const api_call_login = await fetch(baseUrl + '/mytokenlogin/', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ username: email.value, password: password.value })
				}); 

				// Guardo el token en pinia 
				if (api_call_login.ok) {
					const responseText = await api_call_login.text();
					if (responseText) {
						const response = JSON.parse(responseText);
						const token = response.auth_token;
						const playerId = response.user_id; 

						// Usamos Pinia para guardar el token 
						const store = useCounterStore();
						store.setToken(token);
						store.setPlayerId(playerId);

						console.log(store.token, store.playerId)

						// Le dirigimos a la pagina de create game 
						router.push('/creategame'); // Redirige al usuario a la pantalla de inicio de sesión
					} else {
						errorMessage.value = 'Error: Invalid response from server'; 
					}
				} else {
					errorMessage.value = 'Error: Invalid username or password'; 
				}
			}

			return {
				email, 
				password, 
				errorMessage, 
				logIn, 
			}
		}, 
	}; 

	
</script>

<style scoped>
	@import url('../assets/input.css');
	@import url('../assets/login_signup.css'); 
</style>