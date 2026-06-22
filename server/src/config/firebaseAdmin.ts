import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import fs from 'fs';
import path from 'path';

let serviceAccountConfig: ServiceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccountConfig = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
  ) as ServiceAccount;
} else {
  const localKeyPath = path.resolve('./serviceAccountKey.json');
  serviceAccountConfig = JSON.parse(
    fs.readFileSync(localKeyPath, 'utf8')
  ) as ServiceAccount;
}

initializeApp({
  credential: cert(serviceAccountConfig),
});
