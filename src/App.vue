<!-- App.vue -->
<template>
  <nav>
		<router-link to="/">Home</router-link>
		<router-link to="/sign-up">Sign Up</router-link>
		<router-link to="/log-out" data-cy="logOutLink">Log Out</router-link>
	</nav>
  <router-view/>
</template>


<script>
export default {
  name: 'App', 

}
</script> 


