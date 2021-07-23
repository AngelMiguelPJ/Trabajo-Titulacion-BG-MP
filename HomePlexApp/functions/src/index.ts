import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const firestore = admin.firestore();
const uidAdmin = "8lS1eF1scoMozfxxqJUwb2vAa952";
const cors = require("cors")({origin: true});

exports.newUsers = functions.firestore
    .document("users/{Uid}")
    .onCreate( async (event) => {
      //    const idUsuario = eventContext.params.Uid;
      const message = event.data();
      console.log("notificacion mensaje ejecutado" + message);

      const path = "/users/" + uidAdmin;
      const docInfo = await firestore.doc(path).get();
      const dataUser = docInfo.data() as any;
      const token = dataUser.token;
      const registrationTokens = [token];

      const dataFCM = {
        enlace: "/chats",
      };

      const notifications : INotification = {
        data: dataFCM,
        tokens: registrationTokens,
        notification: {
          title: "Se ha creado un nuevo usuario",
          body: "revisar" + dataUser.Name,
        },
      };

      return sendNotification(notifications);
    });

exports.newMessage = functions.firestore
    .document("chats/{Uid}/{Ouid}/{Cid}")
    .onCreate( async (event) => {
      //    const idUsuario = eventContext.params.Uid;
      const message = event.data();
      console.log("notificacion mensaje ejecutado" + message);

      const path = "/users/" + uidAdmin;
      const docInfo = await firestore.doc(path).get();
      const dataUser = docInfo.data() as any;
      const token = dataUser.token;
      const registrationTokens = [token];

      const dataFCM = {
        enlace: "/chats",
      };

      const notifications : INotification = {
        data: dataFCM,
        tokens: registrationTokens,
        notification: {
          title: "Se ha creado un nuevo usuario",
          body: "revisar" + dataUser.Name,
        },
      };

      return sendNotification(notifications);
    });

export const notificationRecolection =
functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    if (request.body.data) {
      const notification = request.body.data as INotification;
      await sendNotification(notification);
      const res = {
        respuesta: "success",
      };
      response.status(200).send(res);
    } else {
      const res = {
        respuesta: "error",
      };
      response.status(200).send(res);
    }
  });
});

const sendNotification = (notifications: INotification) => {
  return new Promise((resolve) => {
    const message: admin.messaging.MulticastMessage = {
      data: notifications.data,
      tokens: notifications.tokens,
      notification: notifications.notification,
      android: {
        notification: {
          icon: "ic_stat_name",
          color: "#EB9234",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: {
              critical: true,
              name: "default",
              volume: 1,
            },
          },
        },
      },
    };
    console.log("list of tokens send", notifications.tokens);

    admin.messaging().sendMulticast(message).then((response) => {
      if (response.failureCount > 0) {
        const failedTokens: any[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(notifications.tokens[idx]);
          }
        });
        console.log("List of tokens that cause failures: " + failedTokens);
      } else {
        console.log("Send notifications succesfully ->");
      }
      resolve(true);
      return;
    }).catch((error) => {
      console.log("Send FCM failure -> ", error);
      resolve(false);
      return;
    });
  });
};


interface INotification {
    data: any;
    tokens: string[];
    notification: admin.messaging.Notification;
}
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
