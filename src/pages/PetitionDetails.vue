<template>
    <div>
        <nav class="navbar navbar-dark flex-nowrap sticky-top px-4 shadow-sm" style="background-color: #080; min-height: 59px">
            <a class="navbar-brand" href="/"><i class="material-icons" style="font-size: 2rem; vertical-align: top">trending_up</i> Petition Tracker</a>
        </nav>

        <div class="m-4" style="display: flex; flex-flow: column nowrap">
            <h1 class="display-4" style="font-size: 2.8rem">{{petition.title}} <small class="text-muted">#{{$route.path.substr(1)}}</small></h1>
            <h2 v-if="petition.created" class="text-muted" style="font-weight: 300">{{petition.author}} - {{$prettydate.format(petition.created.toDate())}}</h2>

            <h4>
                <span class="badge badge-warning" v-if="petition.signatures >= 10000 && !petition.debated">Awaiting debate</span>
                <span class="badge badge-primary" v-if="petition.debated">Debated</span>
                <span class="badge badge-warning" v-if="petition.signatures >= 100000 && !petition.responded">Awaiting response</span>
                <span class="badge badge-info"    v-if="petition.responded">Responded</span>
            </h4>

            <div class="row p-5" style="flex-grow: 1">
                <div class="col-3">
                    <div id="meter" class="rounded" style="display: flex; flex-flow: column nowrap; justify-content: flex-end; width: 20%; height: 300px; background-color: #004800">
                        <div id="label" class="bg-dark text-light rounded px-2 ml-2" role="tooltip"><div class="bg-dark" x-arrow></div>{{new Intl.NumberFormat("en-GB", {maximumFractionDigits: 0}).format(signatures)}}</div>
                        <div id="fill" class="rounded-bottom" v-bind:style="{height: fillHeight}" style="width: 100%; background-color: #008800; border-top: 1px solid #006700"></div>
                    </div>
                </div>

                <div class="col-9" id="graph" style="height: 600px"></div>
            </div>
        </div>

        <div id="footer" class="d-inline-flex flex-row align-items-center fixed-bottom display-4 m-4">
            <i class="material-icons mr-3" style="font-size: 62px">sync_disabled</i>
            <div>
                <div style="font-size: 2rem"> No need to refresh...</div>
                <div class="text-muted" style="font-size: 1.3rem">The page updates automatically as new data becomes available</div>
            </div>
            <i v-if="congested" class="material-icons ml-auto" style="font-size: 62px; color: #FB8C00" data-toggle="tooltip" data-placement="left" title="High traffic volumes on the parliament website are making it difficult to fetch data">warning</i>
        </div>
    </div>
</template>

<script>
    import * as firebase from "firebase/app";
    import "firebase/firestore";
    import Popper from "popper.js";
    import $ from "jquery";
    import * as Highcharts from "highcharts"
    import {TweenLite as tween, Power3} from "gsap"

    let db = null;
    fetch('/__/firebase/init.json').then(async response => {
        db = firebase.initializeApp(await response.json()).firestore();
    });

    let chart = null;

    export default {
        name: "PetitionDetails",
        props: ['id'],
        data() {
            return {
                petition: {
                    signatures: null
                },
                snapshots: [],
                signatures: 0,
                congested: false
            }
        },
        watch: {
            id: {
                immediate: true,
                handler(id) {
                    this.$bind('petition', db.collection('petitions').doc(id))
                        .then(() => {
                            // if the petition doesn't exist, switch to the 404 page
                            if(this.$data.petition.created === undefined && this.$props.id != 'notfound') {
                                this.$props.id = 'notfound';
                            }
                            return true;
                        });
                    this.$bind('snapshots', db.collection('petitions').doc(id).collection('snapshots'));
                }
            },
            snapshots: {
                deep: true,
                handler(snapshots) {
                    chart.series[0].setData(snapshots);
                }
            },
            'petition.signatures': function(newValue) {
                tween.to(this.$data, 2, {signatures: newValue, ease: Power3.easeInOut})
            }
        },
        computed: {
            fillHeight: function() {
                return (300 * this.signatures/10000) + "px";
            }
        },
        updated() {
            // nasty hack for only doing it once on load (since mounted() doesn't seem to work for this use case)
            if(chart == null) {
                $(function () {
                    $('[data-toggle="tooltip"]').tooltip()
                });

                chart = Highcharts.chart('graph', {
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: ''
                    },
                    legend : {
                        enabled: false
                    },
                    xAxis: {
                        title: {
                            text: 'Time'
                        },
                        type: 'datetime'
                    },
                    yAxis: {
                        title: {
                            text: 'Signatures'
                        },
                        id: 'y'
                    },
                    series: [
                        {
                            name: 'Signatures',
                            color: '#008800',
                            marker: {
                                enabled: false
                            }
                        },
                        {
                            visible: false,
                            color: '#008800',
                            marker: {
                                enabled: false
                            },
                            data: [3000, 3600, 3800, 3917, 3980, 4000, 3980, 3917, 3800, 3600, 3000, null, null, null, null, 3000, 3600, 3800, 3917, 3980, 4000, 3980, 3917, 3800, 3600, 3000]
                        },
                        {
                            visible: false,
                            color: '#008800',
                            marker: {
                                enabled: false
                            },
                            data: [3000, 2400, 2200, 2083, 2020, 2000, 2020, 2083, 2200, 2400, 3000, null, null, null, null, 3000, 2400, 2200, 2083, 2020, 2000, 2020, 2083, 2200, 2400, 3000]
                        },
                        {
                            visible: false,
                            color: '#008800',
                            marker: {
                              enabled: false
                            },
                            data: [0, 241, 460, 684, 841, 1006, 1140, 1260, 1361, 1440, 1500, 1540, 1560, 1560, 1540, 1500, 1440, 1361, 1260, 1140, 1006, 841, 684, 460, 241, 0]
                        }
                    ]
                });

                if(!this.$data.petition || this.$props.id == 'notfound') {
                    chart.series.forEach(s => s.setVisible(true));
                    chart.get('y').setExtremes(null, 4000);
                }

                let popper = new Popper($('#fill'), $('#label'), {
                    placement: 'right-start',
                    modifiers: {
                        offset: {
                            offset: '-50%p'
                        },
                        arrow: {
                            enabled: true
                        }
                    }
                });
                // TODO: make popper follow the fill level
                popper.enableEventListeners();
            }
        }
    }
</script>

<style scoped lang="scss">
    .badge {
        margin-right: .5em;
    }

    #label {
        font-weight: 300;
        font-size: 1.8rem;

        // TODO: fix arrow shape
        [x-arrow] {
            position: absolute;
            left: -9px;
            width: 0;
            height: 0;
            border-bottom: 7px solid transparent;
            border-top: 7px solid transparent;
            border-right: 10px solid #343a40;
        }
    }
</style>