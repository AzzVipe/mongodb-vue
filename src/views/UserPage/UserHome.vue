<template>
	<h1>User Home</h1>
</template>

<script>

export default {
	name: 'UserHome',

	created() {
		this.$toast.add({severity:'success', summary: 'Success Message', detail:'Submitted', life: 3000});	
	}
};

</script>