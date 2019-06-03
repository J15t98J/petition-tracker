<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import PetitionCards from "@/pages/PetitionCards";
    import NotFound from "@/pages/NotFound";

    export default {
        name: 'app',
        components: {
            PetitionCards,
            NotFound
        }
    }
</script>

<style>
    [v-cloak] {
        display: none;
    }

    i.material-icons {
        vertical-align: bottom;
    }
</style>
