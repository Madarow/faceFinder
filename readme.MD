App utilisant l'API face++

plugins cordova :
  camera
  file

plugins ionic :
  localStorage

Présentation en une phrase :
  gère et compare des portraits


Que fait l'app ?

  Révolution dans la généalogie visuelle, vous compare à vos proches et vous donne un score de ressemblance,
  permet la creation et la gestion d'une bibliothèque de portrait.

  Parcours utilisateur :

  * créé ta bibliothèque de portrait en les ajoutant un à un ou avec une photo de groupe(5max)
  * puis compare les portaits de ta bibliothèque
  * ajout de nouveaux portraits ou une photo de groupe
  * une fois les/le nouveau(x) portrait(s) enregistré(s) tu peux les comparer à foison

par vue :
  1. lors de l'initialisation de l'application une bibliothèque est créée
     des images déjà présentes dans le téléphone(action load screen non visible)

  2. Vues
     ..* vue 1)
      posibilité d'enregistré une image utilisateur par default pour les comparaisons

     ..* vue 2)
      possibilité d'ajouter des images à la bibliothèque via l'identification de visages de l'API

     ..* vue 3)
      posibilité de comparer les portraits de la bibliothèque et l'image par défaut (image modifiable)

     ..* vue 4)
      gestion des données de l'application (option, choix de l'emplacement du stockage des nouveau portrait , ect)

  par fonction :
      1 ) détection et découpage des visages identifiés sur une photo de groupe
      2 ) comparaison image par image et retour des scores de ressemblance

  + ? )

  3. modification des images via filtre (façon snapchat)
