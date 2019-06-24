const admin = require('firebase-admin');
const functions = require('firebase-functions');

const fetch = require('cross-fetch');

const app = admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

exports.trackPetition = functions.https.onRequest((request, response) => {
    let responseCode = 500;

    return fetch(`https://petition.parliament.uk/petitions/${request.query.id}.json`)
        .then(response => {
            responseCode = response.status;
            if(response.status === 200) {
                return response.json();
            } else throw new Error(`Received ${response.status} for petition #${request.query.id}`);
        })
        .then(json =>
            db.collection('petitions').doc(request.query.id).set({
                title: json.data.attributes.action,
                summary: json.data.attributes.background,
                description: json.data.attributes.additional_details,
                author: json.data.attributes.creator_name || "Anonymous",
                created: new Date(json.data.attributes.created_at),
                state: json.data.attributes.state,
                debated: json.data.attributes.debate !== null,
                responded: json.data.attributes.government_response !== null
            }).catch(reason => {
                console.log(reason);
                responseCode = 500;
            })
        )
        .catch(reason => console.log(reason))
        .finally(() => {
            response.status(responseCode).end();
            return true;
        });
});

exports.snapshotPetitions = functions.pubsub.schedule('every 5 minutes synchronised').onRun((context) => {
    db.collection('petitions').where("state", "==", "open").get()
        .then(docs => docs.forEach(petition =>
            fetch(`https://petition.parliament.uk/petitions/${petition.id}.json`)
                .then(response => response.json())
                .then(json => Promise.all([
                    petition.ref.update({signatures: json.data.attributes.signature_count}),
                    petition.collection('snapshots').doc().set({
                        x: new Date().getTime().toString(),
                        y: json.data.attributes.signature_count
                    })
                ]))
                .catch(reason => console.log(reason))
        ))
        .catch(reason => console.log(reason));
});