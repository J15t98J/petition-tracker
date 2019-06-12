const admin = require('firebase-admin');
const functions = require('firebase-functions');

const fetch = require('cross-fetch');

const app = admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

exports.trackPetition = functions.https.onRequest((request, response) => {
    fetch(`https://petition.parliament.uk/petitions/${request.query.id}.json`)
        .then(response => {
            if(response.status === 200) {
                return response.json()
            } else throw new Error("Bad response")
        })
        .then(json => {
            db.collection('petitions').doc(request.query.id).set({
                title: json.data.attributes.action,
                summary: json.data.attributes.background,
                description: json.data.attributes.additional_details,
                author: json.data.attributes.creator_name || "Anonymous",
                created: new Date(json.data.attributes.created_at),
                state: json.data.attributes.state,
                debated: json.data.attributes.debate != null,
                responded: json.data.attributes.government_response != null
            }).catch(reason => console.log(reason));
        });
});
