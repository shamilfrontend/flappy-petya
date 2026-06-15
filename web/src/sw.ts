/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

interface ServiceWorkerWithManifest extends ServiceWorkerGlobalScope {
  __WB_MANIFEST: Array<{
    revision: string | null;
    url: string;
  }>;
}

const workboxManifest = (
  self as unknown as ServiceWorkerWithManifest
).__WB_MANIFEST;

precacheAndRoute(workboxManifest);

registerRoute(
  ({ url }) =>
    /^https:\/\/(firestore|identitytoolkit|securetoken)\.googleapis\.com\//.test(
      url.href,
    ),
  new NetworkOnly(),
);

registerRoute(
  ({ url }) => /^https:\/\/.*\.firebaseapp\.com\//.test(url.href),
  new NetworkOnly(),
);
