<template>
	<h1 data-cy="logoutPage">Log Out</h1>
	<button @click="logOut">LogOut</button>
</template>

<script>
	import { useRouter } from 'vue-router';
	import { useCounterStore } from '../stores/counter.js';

	export default {
		name: 'logout-vue',

		setup() {
			const router = useRouter(); 
			const store = useCounterStore();
			// 'https://practica3-psi.onrender.com/api/v1/token/logout/'
			// const baseUrl = 'http://127.0.0.1:8000/api/v1'
			const baseUrl = import.meta.env.VITE_DJANGOURL; 
			// Tengo que pasarle el token en la consulta para cerrar sesión 
			const logOut = async () => {
				console.log(store.token);
				const api_call = await fetch(baseUrl + '/token/logout/', {
					method: 'POST',
					headers: { 
						'Content-Type': 'application/json',
						'Authorization': `token ${store.token}` // Aquí se envía el token en el encabezado
					},
				}); 

				if (api_call.ok) {
					store.token = null; // Borra el token de la tienda
					router.push('/log-in');
				} 
			}; 

			return {
				logOut, 
			}
		}
	}
</script>

<style>
	@import url('../assets/login_signup.css'); 
	h1 {
		text-align: center;
	}
</style>