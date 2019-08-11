<template>
	<div class="app-employee-layout">
		<transition name="fade" mode="out-in">
			<router-view />
		</transition>
	</div>
</template>
<style lang="scss" scoped>
	.app-loading{
		height: 100vh;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: $purple;
	}
</style>
