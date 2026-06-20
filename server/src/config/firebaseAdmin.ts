import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import serviceAccount from '../../serviceAccountKey.json' with { type: 'json' };

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});
