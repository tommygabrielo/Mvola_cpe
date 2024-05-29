const request = require("request");

//Génération Access Token
// const mvolaGetAccessToken = async () => {
//   const auth =
//     "Basic " +
//     Buffer.from(
//       `yL9MV4MW6J7oUaELxus7fasryNga:D8GOO6rDXRlMCkvCgePWW5hcfuwa`
//     ).toString("base64");
//   const header = {
//     Authorization: auth,
//     "Content-type": "application/x-www-form-urlencoded",
//     "Cache-Control": "no-cache",
//   };
//   const body = {
//     grant_type: "client_credentials",
//     scope: "EXT_INT_MVOLA_SCOPE",
//   };
//   return new Promise((resolve, reject) => {
//     request(
//       {
//         uri: 'https://api.mvola.mg/token',
//         method: "POST",
//         headers: header,
//         form: body,
//       },
//       (err, res, body) => {
//         if (!err) {
//           const data = JSON.parse(res.body);
//           console.log("Token Yes!: ", data.access_token);
//           const accessToken = data.access_token;
//           resolve(accessToken);
//         } else {
//           console.error("Token No :" + err);
//           reject(err);
//         }
//       }
//     );
//   });
// };

//Get transaction status
const getTransactionStatus = async (serverCorrelationId, accessToken) => {
  // const accessToken = await mvolaGetAccessToken();
  const header = {
    Version: "1.0",
    "X-CorrelationID": "CPE",
    UserLanguage: "MG",
    UserAccountIdentifier: "msisdn;0348156073",
    partnerName: "AkataGoavana",
    "Content-type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "Cache-Control": "no-cache",
  };
  return new Promise((resolve, reject) => {
    request(
      {
        uri: `https://api.mvola.mg/mvola/mm/transactions/type/merchantpay/1.0.0/status/${serverCorrelationId}`,
        method: "GET",
        headers: header,
        json: "",
      },
      (err, res, body) => {
        if (!err) {
          const data = JSON.parse(res.body);
          console.log(data);
          resolve(data);
        } else {
          reject("Get Transaction status error : " + err);
        }
      }
    );
  });
};


exports.mvolaPayment = async (req, response) => {
try {
  // recuperer access token
  const accessToken = await mvolaGetAccessToken();
  const nowTime = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 100000
  ).toISOString();

  // creer header
  let header = {
    Version: "1.0",
    "X-CorrelationID": "AkataChatBot1",
    UserLanguage: "MG",
    UserAccountIdentifier: "msisdn;0348156073",
    partnerName: "AkataGoavana",
    "Content-type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "X-Callback-URL": `http://localhost:23000/shopping`,
    "Cache-Control": "no-cache",
  };

  // creer body
  let body = {
    amount: `${req.body.montant}`,
    currency: "Ar",
    descriptionText: "MVola Payment",
    requestingOrganisationTransactionReference: "11",
    requestDate: `${nowTime}`,
    originalTransactionReference: "01",
    debitParty: [
      {
        key: "msisdn",
        value: "0346018997",
      },
    ],
    creditParty: [
      {
        key: "msisdn",
        value: "0348156073",
      },
    ],
    metadata: [
      {
        key: "partnerName",
        value: "CPE",
      },
      {
        key: "fc",
        value: "USD",
      },
      {
        key: "amountFc",
        value: "1",
      },
    ],
  };
  request(
    {
      uri: 'https://api.mvola.mg/mvola/mm/transactions/type/merchantpay/1.0.0/',
      method: "POST",
      headers: header,
      json: body,
    },
    async (err, res, body) => {
      console.log("errr: ", err);
      const serverCorrelationId = res.body.serverCorrelationId;
      console.log("serverCorrelationId: ", res.body);
      if (!err) {
        let i = 0;
        const transactionStatusListener = setInterval(async () => {
          const transactionStatus = await getTransactionStatus(
            serverCorrelationId,
            accessToken
          );
          if (transactionStatus.status == "completed") {
            clearInterval(transactionStatusListener);
            response.status(200).json({
              data: transactionStatus,
            });
          } else if (transactionStatus.status == "failed") {
            clearInterval(transactionStatusListener);
            console.log(transactionStatus);
            response.status(200).json({
              data: transactionStatus,
            });
          } else if (i === 5) {
            clearInterval(transactionStatusListener);
            response.status(200).json({
              data: transactionStatus,
            });
          }
          i++;
        }, 10000);
      } 
      // else {
      //   response.status(500).json({
      //     message: "ERROR",
      //   });
      // }
    }
  );
} catch (error) {
  response.status(500).json({
    message: "Error getting access token",
    error: error.toString(),
  });
}

};
