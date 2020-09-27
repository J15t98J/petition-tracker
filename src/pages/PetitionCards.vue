<template>
    <div>
        <nav class="navbar navbar-dark flex-nowrap sticky-top px-4 shadow-sm">
            <a class="navbar-brand" href="./index.html"><i class="material-icons" style="font-size: 2rem; vertical-align: top">trending_up</i> Petition Tracker</a>

            <form class="form-inline" id="search-box" action="javascript:$('#search-box input').blur()" style="flex-grow: 1; justify-content: flex-end">
                <input class="form-inline form-control" style="max-width: 200px" type="search" placeholder="Search"
                       aria-label="Search" v-model="query" @focus="expandSearchBox" @blur="collapseSearchBox" />
            </form>
        </nav>

        <div class="position-fixed" style="top: 50%; left: 50%; margin-top: 29px; transform: translate(-50%, -50%);">
            <div class="spinner-border" role="status" v-if="petitions.length === 0" style="width: 6rem; height: 6rem; color: #080"></div>
        </div>

        <div class="card-columns px-4 pt-4" style="columns: 22rem auto" v-cloak>
            <div class="card shadow-sm" v-for="petition in petitions" v-bind:key="petition.id">
                <a :href="petition.id" class="text-reset text-decoration-none"><div class="card-body">
                    <h4 class="card-title">
                        <span class="badge badge-success"   v-if="petition.attributes.state == 'open'">Open</span>
                        <span class="badge badge-secondary" v-if="petition.attributes.state == 'closed'">Closed</span>
                        <span class="badge badge-danger"    v-if="petition.attributes.state == 'rejected'">Rejected</span>
                        {{petition.attributes.action}} <small class="text-muted">#{{petition.id}}</small>
                    </h4>

                    <div>
                        <span class="badge badge-warning" v-if="petition.attributes.debate == null && petition.attributes.debate_threshold_reached_at != null">Awaiting debate</span>
                        <span class="badge badge-primary" v-if="petition.attributes.debate != null">Debated</span>
                        <span class="badge badge-warning" v-if="petition.attributes.government_response == null && petition.attributes.response_threshold_reached_at != null">Awaiting response</span>
                        <span class="badge badge-info"    v-if="petition.attributes.government_response != null">Responded</span>
                    </div>
                    <br v-if="petition.attributes.response_threshold_reached_at != null" />

                    <div style="text-align: justify">{{petition.attributes.background}}</div>
                </div></a>

                <div class="card-footer text-muted" style="display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: center">
                    <span>
                        <span style="margin-right: .7em; white-space: pre"><i class="material-icons">schedule</i>{{pretty(new Date(Date.parse(petition.attributes.created_at)))}}</span>
                        <span style="white-space: pre"><i class="material-icons">how_to_vote</i>{{new Intl.NumberFormat().format(petition.attributes.signature_count)}}</span>
                    </span>
                    <a class="float-right" v-bind:href="'https://petition.parliament.uk/petitions/' + petition.id" target="_blank" rel="noopener"><i class="material-icons">open_in_new</i></a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';
    import {format as pretty} from 'pretty-date';
    import _ from 'lodash';

    export default {
        name: "PetitionCards",
        watch: {
            query: function () {
                this.slowUpdate();
            }
        },
        data() {
            return {
                petitions: [],
                query: ""
            }
        },
        created() {
            this.slowUpdate = _.debounce(this.updatePetitions, 500);
            this.updatePetitions();
        },
        methods: {
            updatePetitions() {
                fetch("https://petition.parliament.uk/petitions.json" + (this.query !== ""? "?q=" + this.query : ""))
                    .then(response => response.json())
                    .then(json => {
                        this.petitions = json.data
                    })
            },
            expandSearchBox() {
                if($('#search-box').outerWidth() < 200) {
                    $('.navbar-brand').hide();
                    $('#search-box input').css({'max-width': ''})
                }
            },
            collapseSearchBox() {
                $('.navbar-brand').show();
                $('#search-box input').css({'max-width': '200px'})
            },
            pretty
        }
    }
</script>

<style scoped>
    .card-footer span i {
        margin-right: .15em;
    }

    div > .badge {
        margin-right: .5em;
    }
</style>