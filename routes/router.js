const express = require('express');
const UserController = require('../controllers/UserController');
const mvola = require('../controllers/mvola');
const router = express.Router();

// Ajouter la route pour la fonction addnewuser
router.get('/selectclasse3eme', UserController.selectclasse3eme);
router.get('/selectclasseterminale', UserController.selectclasseterminale);
router.post('/adduser', UserController.addnewuser);
router.get('/recevoirClasse/:NUMMATRICULE', UserController.recevoirClasse);
router.get('/afficheCarte/:NUMMATRICULE', UserController.afficheCarte);
router.get('/selectMotif', UserController.selectMotif);
router.post('/ajouterLigne',UserController.ajouterLigne);
router.get('/afficheLigne',UserController.afficheLigne);
router.post('/supprimerLigne/:TEMPIDLIGNERECU',UserController.supprimerLigne);
router.post('/validerCommande', UserController.validerCommande);
router.get('/selectEtudiant/:NUMMATRICULE', UserController.selectEtudiant);
router.post('/updateUser/:NUMMATRICULE', UserController.updateUser);
router.get('/historique/:NUMMATRICULE', UserController.historique);


router.post('/mvola', mvola.mvolaPayment);

// Ajouter la route pour la fonction loginUser
router.post('/login', UserController.loginUser);




// AFFICFER PAYEMENT DEJA FAIT
router.post('/voirPaiements/:nummatriculeModal', UserController.voirPaiements);
 
// SUPRIMER PAYEMENT
router.post('/annulerPaiements', UserController.annulerPaiements);


module.exports = router;