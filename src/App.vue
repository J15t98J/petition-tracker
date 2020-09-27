<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app'
    }
</script>

<style>
    [v-cloak] {
        display: none;
    }

    /* INLINED FROM https://fonts.googleapis.com/icon?family=Material+Icons 04/06/19 */
    @font-face {
        font-family: 'Material Icons';
        font-style: normal;
        font-weight: 400;
        src: url(https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2) format('woff2');
    }

    .material-icons {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        -webkit-font-feature-settings: 'liga';
        -webkit-font-smoothing: antialiased;
    }

    i.material-icons {
        vertical-align: bottom;
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --bg: #242424;
            --nav-bg: #040;
            --card-bg: #333;
            --card-footer-bg: #393939;
            --search-border: #444;
            --text: white;
            --text-muted: #919BA5;
            --external-link: white;

            --badge-blue: #0060C6;
            --badge-turq: #138799;
            --badge-yell: #E2AB06;
        }
    }

    @media (prefers-color-scheme: light) {
        :root {
            --bg: white;
            --nav-bg: #080;
            --card-bg: white;
            --card-footer-bg: rgba(0,0,0,.03);
            --search-border: #CED4DA;
            --text: black;
            --text-muted: #6C757D;
            --external-link: #007BFF;

            --badge-blue: #007BFF;
            --badge-turq: #17A2B8;
            --badge-yell: #FFC107;
        }
    }

    body, .form-control, .form-control:focus {
        background-color: var(--bg);
        color: var(--text);
    }

    .form-control {
        border-color: var(--search-border);
    }

    .form-control::placeholder {
        color: var(--text-muted);
    }

    .navbar {
        background-color: var(--nav-bg);
        min-height: 59px;
    }

    .card {
        background-color: var(--card-bg);
    }

    .card-footer {
        background-color: var(--card-footer-bg);
    }

    .text-muted {
        color: var(--text-muted) !important;
    }

    .badge-primary {
        background-color: var(--badge-blue);
    }

    .badge-info {
        background-color: var(--badge-turq);
    }

    .badge-warning {
        background-color: var(--badge-yell);
    }

    .card-footer a {
        color: var(--external-link);
    }
</style>
