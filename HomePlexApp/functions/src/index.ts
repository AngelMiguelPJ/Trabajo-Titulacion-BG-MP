import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const firestore = admin.firestore();
//const uidAdmin = 'xxx';
//const cors = require('cors')({
//    origin: true,
//});

exports.comunicateChat = functions.firestore
    .document('chats/{Uid}/{Uid}')
    .onCreate( async (event) => {
        const Uid = 'dN1FgPb8QTaBvHbWoJfnQu:APA91bFBJ9txnxpfY0YRGRwHXUDAONmh6oFX0vaAq0VetqwSHZMRG849xiy3xenZp2aA-KCwugXiulRqKkSY-y3RODyYqtFChwIWW1Emj5wZEv96ETqG44uT2Kso3ac_lrn69FTiSkhi';
        const message = event.data();
        console.log('notificacion mensaje ejecutado');

        const path = '/chats/' +  Uid;
        const docInfo = await firestore.doc(path).get();
        const dataUser = docInfo.data() as any;
        const token = dataUser.token;
        const registrationTokens = [token];

        const dataFCM = {
            enlace : '/chats',
        }
    });

interface INotification {
    data: any;
    tokens: String[];
    notification: admin.messaging.Notification;
}
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
