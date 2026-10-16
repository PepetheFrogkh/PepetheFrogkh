<?php
// Modèle des secrets de l'API PHP (formulaire de contact, simulateur).
// Sur Hostinger : copier ce fichier en
//   ~/domains/kuiperstudio.com/kuiper-secrets.php
// c'est-à-dire UN CRAN AU-DESSUS de public_html, jamais dedans : il n'est pas servi
// par le web et le déploiement Git ne l'écrase pas. Puis remplir les valeurs.
// Ce fichier modèle n'est pas déployé (il n'est pas dans out/).
return [
    'TELEGRAM_BOT_TOKEN'   => '',  // token du bot @Kuiperstudiobot
    'TELEGRAM_CHAT_ID'     => '',  // id du chat / canal qui reçoit les alertes
    'HUBSPOT_ACCESS_TOKEN' => '',  // access token d'une Private App (scopes contacts + deals)
    // 'HUBSPOT_PIPELINE'  => 'default',
    // 'HUBSPOT_DEALSTAGE' => 'appointmentscheduled',
];
