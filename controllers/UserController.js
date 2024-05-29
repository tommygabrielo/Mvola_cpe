
const axios = require('axios');
const usermodel = require("../models/User");
const { json } = require('body-parser');


//select classe de troisieme
module.exports.selectclasse3eme = (req, res) => {
  usermodel.selectclasse3eme((err, resp) => {
    if (!err) {
      res.send(resp)
    } else {
      res.send(err)
    }
  })
}

//select classe de terminale
module.exports.selectclasseterminale = (req, res) => {
  usermodel.selectclasseterminale((err, resp) => {
    if (!err) {
      res.send(resp)
    } else {
      res.send(err)
    }
  })
}


// ajout eleve
module.exports.addnewuser = (req, res) => {
  var NOM = req.body.NOM;
  var PRENOM = req.body.PRENOM;
  var DATENAISSANCE = req.body.DATENAISSANCE;
  var LIEUNAISSANCE = req.body.LIEUNAISSANCE;
  var ADRESSEELEVE = req.body.ADRESSEELEVE;
  var CONTACT = req.body.CONTACT;
  var MOTPASSE = req.body.MOTPASSE;
  var SEXE = req.body.SEXE;
  var IDCLASSE = req.body.IDCLASSE;

  usermodel.addnewuser(NOM, PRENOM, DATENAISSANCE, LIEUNAISSANCE, ADRESSEELEVE, IDCLASSE, CONTACT, MOTPASSE, SEXE, (err, resp) => {
    if (!err) {
      res.send(resp)
    }
    else {
      res.send(err)
    }
  })
}
//  login
module.exports.loginUser = (req, res) => {
  const CONTACT = req.body.CONTACT;
  const MOTPASSE = req.body.MOTPASSE;
  console.log(MOTPASSE + '  ' + CONTACT)
  usermodel.loginUser(CONTACT, MOTPASSE, (err, resp) => {
    if (!err) {
      res.send({ user: resp });
    } else {
      res.send(err, null);
    }
  });
};


//recevoir classe et numero
module.exports.recevoirClasse = (req, res) => {
  const NUMMATRICULE = req.params.NUMMATRICULE;
  usermodel.recevoirClasse(NUMMATRICULE, (err, resp) => {
    if (!err) {
      res.send({ resp });
    } else {
      res.send(err, null);
    }
  });
};

//affiche carte ecolage
module.exports.afficheCarte = (req, res) => {
  const NUMMATRICULE = req.params.NUMMATRICULE;

  usermodel.afficheCarte(NUMMATRICULE, (err, resp) => {
    if (!err) {
      res.send({ resp });
    } else {
      res.send(err, null);
    }
  });
};

//select Etudiant
module.exports.selectEtudiant = (req, res) => {
  const NUMMATRICULE = req.params.NUMMATRICULE;
  console.log(NUMMATRICULE);
  usermodel.selectEtudiant(NUMMATRICULE, (err, resp) => {
    if (!err) {
      res.send({ resp });
    } else {
      res.send(err, null)
    }
  })
}

//select Etudiant
module.exports.historique = (req, res) => {
  const NUMMATRICULE = req.params.NUMMATRICULE;

  usermodel.historique(NUMMATRICULE, (err, resp) => {
    if (!err) {
      res.send({ resp });
    } else {
      res.send(err, null)
    }
  })
}

//select motif
module.exports.selectMotif = (req, res) => {

  usermodel.selectMotif((err, resp) => {
    if (!err) {
      res.send({ resp });
    } else {
      res.send(err, null);
    }
  });
};

//  AJOUT PAYEMENT
module.exports.ajouterLigne = (req, res) => {
  var CODEMOTIF = req.body.selectedValue;
  var IDCLASSE = req.body.idclasse;
  var NUMMATRICULE = req.body.numMatricule;
  var MONTANT = req.body.MONTANT;
  var NUMERO = req.body.numero;

  usermodel.ajouterLigne(CODEMOTIF, IDCLASSE, NUMMATRICULE, MONTANT, NUMERO, (err, resp) => {
    if (!err) {
      res.send(resp);
    } else {
      res.send(err);
    }
  });
};

// A ffichez ligne
module.exports.afficheLigne = (req, res) => {
  usermodel.afficheLigne((err, resp) => {
    if (!err) {
      res.send(resp);
    } else {
      res.send(err);
    }
  });
};

//Supprimer Ligne
module.exports.supprimerLigne = (req, res) => {
  const TEMPIDLIGNERECU = req.params.TEMPIDLIGNERECU
  console.log(TEMPIDLIGNERECU);
  usermodel.supprimerLigne(TEMPIDLIGNERECU, (err, resp) => {
    if (!err) {
      res.send(resp);
    } else {
      res.send(err);
    }
  });
};




// VOIR PAIEMENT
module.exports.voirPaiements = (req, res) => {
  const NUMMATRICULE = req.query.nummatricule;

  usermodel.voirPaiements(NUMMATRICULE, (err, resp) => {
    if (!err) {
      if (resp.length > 0) {
        res.send({ success: true, paiement: resp });
      } else {
        res.send({ success: false, message: 'Aucun paiement trouvé pour ce numéro de matricule' });
      }
    } else {
      res.send({ success: false, message: err });
    }
  }
  );
};




// ANNULER PAYEMENT
module.exports.annulerPaiements = (req, res) => {

  usermodel.annulerPaiements((err, resp) => {
    if (!err) {
      res.send("supprimé")
    }
    else {
      res.send(err)
    }
  })
}


// modifier eleve
module.exports.updateUser = (req, res) => {
  var NUMMATRICULE = req.params.NUMMATRICULE;
  var NOM = req.body.NOM;
  var PRENOM = req.body.PRENOM;
  var LIEUNAISSANCE = req.body.LIEUNAISSANCE;
  var ADRESSEELEVE = req.body.ADRESSEELEVE;
  var CONTACT = req.body.CONTACT;
  var NOMPERE = req.body.NOMPERE;
  var PREOFESSIONPERE = req.body.PREOFESSIONPERE;
  var NOMMERE = req.body.NOMMERE;
  var PROFESSIONMERE = req.body.PROFESSIONMERE;
  var NOMTUTEUR = req.body.NOMTUTEUR;
  var PROFESSIONTUTEUR = req.body.PROFESSIONTUTEUR;



  usermodel.updateUser(NOM, PRENOM, LIEUNAISSANCE, ADRESSEELEVE, CONTACT, NOMPERE, PREOFESSIONPERE, NOMMERE, PROFESSIONMERE, NOMTUTEUR, PROFESSIONTUTEUR, NUMMATRICULE, (err, resp) => {
    if (!err) {
      res.send(resp)
    }
    else {
      res.send(err)
    }
  })
}

// Fonction pour la récupération de l'access token
const mvolaGetAccessToken = async () => {
  const auth =
    'Basic ' +
    Buffer.from(
      'yL9MV4MW6J7oUaELxus7fasryNga:D8GOO6rDXRlMCkvCgePWW5hcfuwa'
    ).toString('base64');
  const header = {
    Authorization: auth,
    'Content-type': 'application/x-www-form-urlencoded',
    'Cache-Control': 'no-cache',
  };
  const body = {
    grant_type: 'client_credentials',
    scope: 'EXT_INT_MVOLA_SCOPE',
  };

  try {
    const response = await axios.post('https://api.mvola.mg/token', body, {
      headers: header,
    });
    const data = response.data;
    console.log('token azo: ', data.access_token);
    return data.access_token;
  } catch (error) {
    throw new Error('Error getting access token: ' + error.message);
  }
};

// Fonction pour récupérer le statut de la transaction
const getTransactionStatus = async (serverCorrelationId, accessToken) => {
  const header = {
    Version: '1.0',
    'X-CorrelationID': '123e4567-e89b-12d3-a456-426614174111',
    UserLanguage: 'MG',
    UserAccountIdentifier: 'msisdn;0343500004',
    partnerName: 'CPE',
    'Content-type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'Cache-Control': 'no-cache',
  };

  try {
    const response = await axios.get(
      `https://api.mvola.mg/mvola/mm/transactions/type/merchantpay/1.0.0/status/${serverCorrelationId}`,
      { headers: header },
    );
    console.log('Status after getting status:', response.data);
    return response.data;
  } catch (error) {
    throw new Error('Get Transaction status error: ' + error.message);
  }
};

exports.validerCommande = async (req, response) => {
  try {
        const MONTANT = req.body.montant;
        const CLIENT = req.body.client;
        const IDANNEE = req.body.anne;
        const NUMDEBIT = req.body.numDebit;
        usermodel.validerCommande(MONTANT, CLIENT, IDANNEE, (err, result) => {
          if (err) {
            return response.status(500).json({ error: err.message });
          } else {
            return response.status(200).json({ data: result });
          }
        });
    
  } catch (error) {
    console.error('Error during MVola payment:', error);
    response.status(500).json({ message: 'Error during MVola payment' });
  }
};
