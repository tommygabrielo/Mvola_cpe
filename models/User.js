const { json } = require("body-parser")
const db = require("../config/db")

let utilisateur = function (utilisateur) {
  this.NOM = utilisateur.NOM
  this.PRENOM = utilisateur.PRENOM
  this.DATENAISSANCE = utilisateur.DATENAISSANCE
  this.ADRESSEELEVE = utilisateur.ADRESSEELEVE
  this.NIVEAUETUDE = utilisateur.NIVEAUETUDE
  this.CONTACT = utilisateur.CONTACT
  this.MOTPASSE = utilisateur.MOTPASSE
  this.SEXE = utilisateur.SEXE
  this.NUMMATRICULE = utilisateur.NUMMATRICULE
}

//select classe de troisieme
utilisateur.selectclasse3eme = (result) => {
  //
  db.query("SELECT c.*, COUNT(e.NUMMATRICULE) AS Effectif FROM classe c LEFT JOIN ance a ON c.IDCLASSE = a.IDCLASSE LEFT JOIN eleve e ON a.NUMMATRICULE = e.NUMMATRICULE WHERE c.IDNIVEAU = 2 GROUP BY c.IDCLASSE HAVING Effectif < c.NBREMAX",
    (err, res) => {
      if (err) {

        result(err, null)
      } else {
        result(null, res)

      }
    })
}

//select classe de terminale 

utilisateur.selectclasseterminale= (result) => {
  db.query("SELECT c.*, COUNT(e.NUMMATRICULE) AS Effectif FROM classe c LEFT JOIN ance a ON c.IDCLASSE = a.IDCLASSE LEFT JOIN eleve e ON a.NUMMATRICULE = e.NUMMATRICULE WHERE c.IDNIVEAU = 1 GROUP BY c.IDCLASSE HAVING Effectif < c.NBREMAX",
    (err, res) => {
      if (err) {
        result(err, null)
      } else {
        result(null, res)
      }
    })
}

// AJOUT ELEVE
utilisateur.addnewuser = (NOM, PRENOM, DATENAISSANCE, LIEUNAISSANCE, ADRESSEELEVE, IDCLASSE, CONTACT, MOTPASSE, SEXE, result) => {
  // Sélectionner l'IDANNEE avec ENCORE = 1 dans la table annee
   // const donnee = `Nom:${NOM}\nPRENOM:${PRENOM}\nDate:${DATENAISSANCE}\nLieu:${LIEUNAISSANCE}\nAdresse:${ADRESSEELEVE}\nContact:${CONTACT}\nsexe:${SEXE}\nmotpass:${MOTPASSE}\nclasse:${IDCLASSE}`;
  // console.log(donnee);

  db.query(
    "SELECT IDANNEE FROM annee WHERE ENCOURS = 1",
    (err, res) => {
      if (err) {
        result(err, null);
      } else {
        const IDANNEE = res[0].IDANNEE || null; // Récupération de l'IDANNEE
        if (IDANNEE) {
          // Insertion de l'élève dans la table "eleve"
          db.query(
            "INSERT INTO eleve (NOM, PRENOM, DATENAISSANCE, LIEUNAISSANCE, ADRESSEELEVE, MOTPASSE, CONTACT, SEXE) VALUES (?,?,?,?,?,?,?,?)",
            [NOM, PRENOM, DATENAISSANCE, LIEUNAISSANCE, ADRESSEELEVE, MOTPASSE, CONTACT, SEXE],
            (err, res) => {
              if (err) {
                result(err, null);
              } else {
                // Après l'insertion réussie dans la table "eleve"
                // Trouver le dernier NUMERO pour la classe spécifiée par IDCLASSE
                const lastInsertId= res.insertId;
                db.query(
                  "SELECT MAX(NUMERO) AS DernierNumero FROM ance WHERE IDCLASSE = ?",
                  [IDCLASSE],
                  (err, res) => {
                    if (err) {
                      result(err, null);
                    } else {
                      const DernierNumero = res[0].DernierNumero || 0; // Récupération du dernier NUMERO ou 0 s'il est null
                      // Insérer une nouvelle entrée dans la table "ance" avec un NUMERO supérieur
                      db.query(
                        "INSERT INTO ance (NUMMATRICULE, IDANNEE, IDCLASSE, NUMERO, AQUITTE) VALUES (?,?, ?, ?,0)",
                        [lastInsertId, IDANNEE, IDCLASSE, DernierNumero + 1],
                        (err, res) => {
                          if (err) {
                            result(err, null);
                          } else {
                            result(null, NOM);
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        } else {
          result("Aucune année avec ENCORE = 1 trouvée", null);
        }
      }
    }
  );
};

//recevoir Classe et Numero de l'eleve
utilisateur.recevoirClasse = (NUMMATRICULE, result) => {
  db.query("SELECT * from ance, classe WHERE ance.IDCLASSE= classe.IDCLASSE AND ance.NUMMATRICULE= ? ", [NUMMATRICULE], (err, res) => {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
      console.log(res)
    }
  })
}

//affiche carte d'ecolage
utilisateur.afficheCarte = (NUMMATRICULE, result) => {
  db.query("SELECT * FROM lignerecu WHERE NUMMATRICULE = ? ", [NUMMATRICULE], (err, res) => {
    if (err) {
      result(err, null);
    } else {
      result(null, res)
    }
  })
}

//Affichage des liste de motif sur input select
utilisateur.selectMotif = (result) => {
  db.query("SELECT * FROM motif ", (err, res) => {
    if (err) {
      result(err, null);
    } else {
      result(null, res)
    }
  })
}

// LOGIN
utilisateur.loginUser = (CONTACT, MOTPASSE, result) => {
  db.query("SELECT * FROM eleve WHERE CONTACT=? AND MOTPASSE=? ", [CONTACT, MOTPASSE], (err, res) => {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// ajouter ligne 
utilisateur.ajouterLigne = (CODEMOTIF, IDCLASSE, NUMMATRICULE, MONTANT, NUMERO, result) => {
  db.query("INSERT INTO templignerecu (CODEMOTIF,IDCLASSE, NUMMATRICULE, MONTANT, NUMERO) VALUE (?,?,?,?,?)", [CODEMOTIF, IDCLASSE, NUMMATRICULE, MONTANT, NUMERO], (err, res) => {
    if (err) {
      result(err, null)
    } else {
      result(null, res)
    }
  })
}

//Affiche ligne
utilisateur.afficheLigne = (result) => {
  db.query("SELECT *,DESIGNMOTIF FROM templignerecu,motif WHERE templignerecu.CODEMOTIF=motif.CODEMOTIF ", (err, res) => {
    if (err) {
      result(err, null)
    } else {
      result(null, res)
    }
  })
}

//Suppr ligne
utilisateur.supprimerLigne = (TEMPIDLIGNERECU, result) => {
  db.query("DELETE FROM templignerecu WHERE TEMPIDLIGNERECU = ? ", [TEMPIDLIGNERECU], (err, res) => {
    if (err) {
      result(err, null)
    } else {
      result(null, res)
    }
  })
}

//selectionner infromation de l'etiduant
utilisateur.selectEtudiant = (NUMMATRICULE, result) => {
  db.query("SELECT * FROM eleve WHERE NUMMATRICULE = ? ", [NUMMATRICULE], (err,res) => {
    if(err){
      result(err, null)
    } else {
      result(null, res)
    }
  })
}

// AJOUT PAIEMENT
utilisateur.addpaiement = (CODEMOTIF, NUMMATRICULE, MONTANT, result) => {
  db.query("SELECT * FROM templignerecu WHERE CODEMOTIF = ?  AND NUMMATRICULE = ?  AND MONTANT = ?", [CODEMOTIF, NUMMATRICULE, MONTANT], (err, res) => {
    if (err) {
      result(err, null);
    } else {
      // Si aucun enregistrement correspondant n'a été trouvé
      if (res.length === 0) {

      }
      // temp = data.length;
      // for (i = 0; i < temp; i++) 
      console.log(CODEMOTIF);
      db.query("INSERT INTO templignerecu (CODEMOTIF, NUMMATRICULE, MONTANT) VALUES (?, ?, ?)", [CODEMOTIF, NUMMATRICULE, MONTANT], (err, res) => {
        if (err) {
          console.log("METY");
          result(err, null);
        } else {
          result(null, { message: `Paiement ajouté avec succès` });
        }
      });
    }
  });
};


// VALIDER PAIEMENT
utilisateur.validerCommande = (MONTANT, CLIENT, IDANNEE, result) => {
  console.log(`montant:${MONTANT}\nclient:${CLIENT}\nANNEE:${IDANNEE}`)
  db.query("insert into recu(MONTANT,DATERECU,CLIENT,IDANNEE) values(?,now(),?,?)", [MONTANT, CLIENT, IDANNEE], (err, res) => {
    if (err) {
      result(err, null);
    }
    db.query("select * from templignerecu", function (err, data) {
        if (err) {
            result(err);
            return;
        }
        temp = data.length;
        for (i = 0; i < temp; i++) {
            db.query("insert into lignerecu(NUMRECU,CODEMOTIF,IDCLASSE,NUMMATRICULE,MONTANT,NUMERO,IDANNEE) values(?,?,?,?,?,?,?)", [res.insertId, data[i].CODEMOTIF,data[i].IDCLASSE, data[i].NUMMATRICULE, data[i].MONTANT, data[i].NUMERO,IDANNEE], function (err, valiny) {
                if (err) {
                    result(err);
                    return;
                }
            })
        }
        db.query("DELETE FROM templignerecu ", function (err, resa) {
            if (err) {
                result(err, null);
                //return;
            } else {
                result(null, resa)
            }
        })
    })
  })
}


//update eleve
utilisateur.updateUser = (NOM,PRENOM,LIEUNAISSANCE,ADRESSEELEVE,CONTACT,NOMPERE,PREOFESSIONPERE,NOMMERE,PROFESSIONMERE,NOMTUTEUR,PROFESSIONTUTEUR,NUMMATRICULE,result) => {
  const donnee = `Nom:${NOM}\nPRENOM:${PRENOM}\nLieu:${LIEUNAISSANCE}\nAdresse:${ADRESSEELEVE}\nContact:${CONTACT}\nNOMPERE:${NOMPERE}\nprofession:${PREOFESSIONPERE}\nNOMMERE:${NOMMERE}\nPROFESSION:${PROFESSIONMERE}\nNOMTUTEUR:${NOMTUTEUR}\nPROFESSION:${PROFESSIONTUTEUR}\n${NUMMATRICULE}`;
  console.log(donnee);
  db.query(` update  eleve set NOM=? ,PRENOM=?, LIEUNAISSANCE=?, ADRESSEELEVE=?,CONTACT=? ,NOMPERE=?,PROFESSIONPERE=?,NOMMERE=?,PROFESSIONMERE=?,NOMTUTEUR=?,PROFESSIONTUTEUR=? where NUMMATRICULE=? `
  ,                            [NOM,PRENOM,LIEUNAISSANCE,ADRESSEELEVE,CONTACT,NOMPERE,PREOFESSIONPERE,NOMMERE,PROFESSIONMERE,NOMTUTEUR,PROFESSIONTUTEUR,NUMMATRICULE], (err, res) => {
    if (err) {
        result(err, null)
    } else {
        result(null, { message: `Modification avec succes` })
    }
})
}

//affiche historique
utilisateur.historique = (NUMMATRICULE, result) => {
  db.query("SELECT r.NUMRECU, r.DATERECU, r.MONTANT AS TOTAL, GROUP_CONCAT(l.CODEMOTIF) AS CODEMOTIFS, GROUP_CONCAT(l.MONTANT) AS MONTANTS FROM recu r INNER JOIN lignerecu l ON r.NUMRECU = l.NUMRECU WHERE l.NUMMATRICULE = ? GROUP BY r.NUMRECU, r.DATERECU, r.MONTANT ORDER BY DATERECU DESC", [NUMMATRICULE], (err, res) => {
    if (err) {
      result(err, null);
    } else {
      result(null, res)
    }
  })
}


module.exports = utilisateur;