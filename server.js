
Problème identifié

Do I know what the issue is? Oui.

Le blocage actuel est clair :
- `src/pages/VidForge.tsx` attend une réponse contenant `data.videoUrl`.
- Le replay montre que l’upload du packshot fonctionne.
- Les requêtes réseau montrent :
  - `GET /health` → `200` OK
  - `POST /render` → `200` avec seulement `{"success":true}`
- Donc la génération est probablement acceptée côté serveur, mais l’UI n’a ni `videoUrl`, ni `taskId`, ni endpoint de statut à interroger.
- Résultat : le front déclenche l’erreur “Aucune URL vidéo n'a été renvoyée par le serveur”, donc aucune vidéo ne peut s’afficher.

Plan de correction

1. Corriger le contrat API de génération
- Faire en sorte que `/render` retourne un format exploitable :
  - soit synchrone : `{ ok: true, videoUrl }`
  - soit asynchrone : `{ ok: true, taskId, status: "processing" }`
- Ajouter ou confirmer un endpoint de statut du type `/status/:taskId` qui renvoie :
  - `{ ok, status, videoUrl, message }`
- Si le serveur Railway ne peut pas être modifié directement, créer une fonction backend intermédiaire dans Lovable Cloud qui :
  - appelle Railway,
  - normalise la réponse,
  - et expose un contrat stable au front.

2. Mettre à jour `src/pages/VidForge.tsx`
- Remplacer la logique actuelle “POST puis `videoUrl` immédiat” par une vraie machine d’état :
  - `idle`
  - `starting`
  - `polling`
  - `completed`
  - `failed`
- Accepter les 2 cas :
  - URL immédiate
  - tâche asynchrone avec polling
- Si `taskId` existe :
  - lancer un polling toutes les 3–5 secondes,
  - arrêter au succès, à l’échec ou au timeout.
- Conserver l’upload Storage actuel tel quel.
- Afficher un vrai état utilisateur :
  - “Préparation du rendu”
  - “Rendu en cours”
  - compteur de temps
  - message d’erreur utile si échec.

3. Améliorer la robustesse des erreurs
- Afficher `message` / `code` renvoyés par le backend au lieu d’un message générique.
- Si le backend renvoie seulement `{ success: true }` sans autre donnée, traiter cela comme une erreur de contrat API, pas comme un succès.
- Empêcher l’état “succès” tant qu’aucune URL finale n’est récupérée.

4. Validation fonctionnelle
- Tester avec un packshot réel.
- Vérifier la séquence réseau attendue :
  - upload image
  - health check
  - `POST /render`
  - polling statut
  - récupération `videoUrl`
- Vérifier que :
  - le lecteur vidéo s’affiche,
  - le lien de téléchargement fonctionne,
  - un timeout propre apparaît si le rendu prend trop longtemps.

Fichiers / zones concernées
- `src/pages/VidForge.tsx`
- serveur Railway externe de rendu Remotion (hors repo actuel), ou nouvelle fonction backend proxy
- aucun changement DB nécessaire pour la version simple

Détail technique utile
- Il existe déjà un bon modèle de polling dans `src/pages/VideoProductGenerator.tsx` avec `pollRunwayStatus()`. Le même principe peut être repris pour PixelProd.
- La fonction `supabase/functions/render-remotion-video/index.ts` actuelle est seulement un placeholder ; elle ne gère pas encore un vrai rendu récupérable par l’interface.
- Le vrai point bloquant n’est pas l’upload ni le design UI : c’est l’absence de contrat de retour exploitable entre `VidForge.tsx` et le serveur Railway.

Conclusion d’implémentation
- Ce bug ne peut pas être réglé uniquement par un petit ajustement visuel dans le front.
- La correction consiste à réaligner le front et le backend sur un flux de rendu asynchrone propre.
- Le chemin recommandé est :
  1. rendre l’API Railway pollable,
  2. adapter `VidForge.tsx` au polling,
  3. afficher la vidéo seulement quand l’URL finale est réellement disponible.
