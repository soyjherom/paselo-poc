import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const sendNotification = functions.https.onRequest(async (req, res) => {
  try {
    // Se espera que el cuerpo de la petición contenga:
    // {
    //   "toToken": "<TOKEN_DEL_DESTINATARIO>",
    //   "title": "Título de la notificación",
    //   "body": "Mensaje de la notificación",
    //   "data": { ... } // datos adicionales (opcional)
    // }
    const {toToken, title, body, data} = req.body;

    if (!toToken || !title || !body) {
      res.status(400).send("Missing params: toToken, title o body.");
      return;
    }

    const message: admin.messaging.Message = {
      token: toToken,
      notification: {
        title,
        body,
      },
      data: data || {},
    };

    const response = await admin.messaging().send(message);
    console.log("Notification sent:", response);
    res.status(200).send(`Notification sent: ${response}`);
  } catch (error) {
    console.error("Error enviando notificación:", error);
    res.status(500).send("Error enviando notificación");
  }
});
