const admin = require('firebase-admin');
// const serviceAccount = require('./');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


const oldDocPath = '/questions/kakie-tehniki-pomogut-uglubit-i-uluchshit-kommunikativnye-navyki';
const newDocPath = 'questions/what-techniques-will-help-deepen-and-improve-communication-skills';


db.doc(oldDocPath).get().then((doc) => {
  if (doc.exists) {
    return db.doc(newDocPath).set(doc.data());
  } else {
    console.error("Старый документ не существует!");
    return null;
  }
}).then(() => {
  return db.doc(oldDocPath).delete();
}).then(() => {
  console.log("Документ успешно переименован!");
}).catch((error) => {
  console.error("Ошибка:", error);
});
// node renameDocumentFirebase.js