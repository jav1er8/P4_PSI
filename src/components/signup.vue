<template>
	<form @submit.prevent="signUp"> 
		<div class="container-padre">
			<div class="container">
				<h1>
					My Chess SignUp Page
				</h1>
				<!--Email-->
				<input 
					placeholder="Email"
					v-model="user.email"
					type="email"
					data-cy="username"
					required
				> 
				<!--Password-->
				<input
					placeholder="Password"
					v-model="user.password"
					type="password"
					data-cy="password1"
					required
				>
				<!--Confirm Password-->
				<input
					placeholder="Confirm Password"
					v-model="user.confirmPassword"
					type="password"
					data-cy="password2"
					required
				>
				<!--Botón de envío-->
				<button type="submit" value="SignUp" data-cy="signup-button">Sign Up</button> 
			</div>
			<aside>
				<img src="/images/chess_image.jpg" alt="">
			</aside>
		</div>

	</form>
</template>
 
<script>
	import { ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { useCounterStore } from '../stores/counter.js';
	
	export default {
		//Nombre del componente
		name: "signup-vue",  
 
		setup() {
			const user = ref({
				email: '',
				password: '',
				confirmPassword: '',
			})

			const router = useRouter();
			const baseUrl = import.meta.env.VITE_DJANGOURL; 

			// 'https://practica3-psi.onrender.com/api/v1/users/'
			const signUp = async () => {
				// Comprobamos que las contraseñas coincidan
				if (user.value.password !== user.value.confirmPassword) {
					alert('Las contraseñas no coinciden'); 
					return;
				}

				// Llamo a la Api para registrarme 
				const api_call = await fetch(baseUrl + '/users/', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: user.value.email, username: user.value.email, password: user.value.password })
				}); 
				
				if (api_call.ok) {
					// Obtenemos el email del usuario registrado para guardarlo en pinia
					const response = await api_call.json();
					const email = response.email;
					
					// Usamos Pinia para guardar el email 
					const store = useCounterStore(); 
					store.setEmail(email);
				}

				alert('Usuario registrado con éxito')
				router.push('/log-in'); // Redirige al usuario a la pantalla de inicio de sesión
			}; 

			return { 
				user, 
				signUp, 
			}
		}, 
	}; 
</script>

<style scoped>
	@import url('../assets/input.css');
	@import url('../assets/login_signup.css'); 
</style>
