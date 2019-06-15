<template>
    <div>
        <nav class="navbar navbar-dark flex-nowrap sticky-top px-4 shadow-sm" style="background-color: #080; min-height: 59px">
            <a class="navbar-brand" href="/"><i class="material-icons" style="font-size: 2rem; vertical-align: top">trending_up</i> Petition Tracker</a>
        </nav>

        <div class="m-4" style="display: flex; flex-flow: column nowrap">
            <h1 class="display-4" style="font-size: 2.8rem">{{petition.title}} <small class="text-muted">#{{petition.id}}</small></h1>
            <h2 class="text-muted" style="font-weight: 300">{{petition.author}} - {{$prettydate.format(this.petition.created.toDate())}}</h2>

            <h4>
                <span class="badge badge-warning" v-if="petition.signatures >= 10000 && !petition.debated">Awaiting debate</span>
                <span class="badge badge-primary" v-if="petition.debated != null">Debated</span>
                <span class="badge badge-warning" v-if="petition.signatures >= 100000 && !petition.responded">Awaiting response</span>
                <span class="badge badge-info"    v-if="petition.responded">Responded</span>
            </h4>

            <div class="row" style="flex-grow: 1">
                <div class="col-3">
                    <div class="rounded m-5" style="display: flex; flex-flow: column nowrap; justify-content: flex-end; width: 20%; height: 300px; background-color: #004800">
                        <div id="popup">172</div>
                        <div id="meter" class="rounded-bottom" style="width: 100%; height: 20%; background-color: #008800; border-top: 1px solid #006700"></div>
                    </div>
                </div>
                
                <div class="col-9" id="graph">
                    I am a graph
                </div>
            </div>
        </div>
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
                petition: null
            }
        },
        watch: {
            id: {
                immediate: true,
                handler(id) {
                    this.$bind('petition', db.collection('petitions').doc(id));
                    this.$bind('test', db.collection('petitions').doc(id).collection('snapshots'));
                }
            }
        }
    }
</script>

<style scoped>
    .badge {
        margin-right: .5em;
    }
</style>