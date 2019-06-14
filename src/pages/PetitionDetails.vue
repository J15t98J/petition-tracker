<template>
    <div>
        Hello!
    </div>
</template>

<script>
    import * as firebase from "firebase";
    let db = null;
    fetch('/__/firebase/init.json').then(async response => {
        db = firebase.initializeApp(await response.json()).firestore();
    });

    export default {
        name: "PetitionDetails",
        props: ['id'],
        data() {
            return {
                petition: null,
            }
        },
        watch: {
            id: {
                immediate: true,
                handler(id) {
                    this.$bind('petition', db.collection('petitions').doc(id));
                }
            }
        }
    }
</script>

<style scoped>

</style>