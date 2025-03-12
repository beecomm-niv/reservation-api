import { config } from 'aws-sdk';
import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';

config.update({
  region: 'il-central-1',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
  }),
  databaseURL: 'https://beecommhostess-default-rtdb.europe-west1.firebasedatabase.app',
});
