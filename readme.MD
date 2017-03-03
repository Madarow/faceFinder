app utilisant l'API face++

plugins cordova :
  camera
  file

plugins ionic :
  localStorage

fonctionnalité :
que fait l'app :
  révolution dans la généalogie visuel, vous compare a vos proche et vous donne un score de ressemblance
  
par vue :
  1) lors de l'initialisation de l'application créée une bibliotheque des images déja presentes dans le téléphone

  2)
     vue 1)
      posibilité d'enregistré une image utilisateur par default pour les comparaisons

     vue 2)
      possibilité d'ajout d'images a la bibliotheque via l'identification de visages de l'API

     vue 3)
      posibilité de comparé les protraits de la bibliotheque et l'image par default(image modifiable)

     vue 4)
      gestion des donné de l'application(option, choix de l'emplacement du stockage des nouveau portrait , ect )

  par fonction :
      1 ) détection et découpage des visages identifier sur une photo de groupe
      2 ) comparaison image par image et retour des scores de ressemblance

  + ? )

  3 ) modification des image via filtre (façon snapchat)
