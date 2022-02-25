const rawData = [
  {
    "a": 8,
    "campaignid": "210a0e48ec0aea780bb747fe56a72d92",
    "userid": "16d798b3ae9d72408a91a8737bedb661",
    "camp_cpc": 0.271,
    "date": "2016-02-29T10:00:06",
    "frienddomainid": "9a8799e6ac57db61203d74b98d78e2ee",
    "freeclick": true,
    "network": "b",
    "PlistaProduct": "Product 8"
  },
  {
    "a": 14,
    "campaignid": "9e7c0cd2c7a4f38f96085debffa70d9d",
    "userid": "e327be674a00de52245d6700078f37f0",
    "camp_cpc": 0.275,
    "date": "2016-01-29T12:00:12",
    "frienddomainid": "c677ec07c9679c2445e251ca89702d8f",
    "freeclick": false,
    "network": "a",
    "PlistaProduct": "Product 1"
  },
  {
    "a": 15,
    "campaignid": "0f9f901474b82d051c6b6ca0a181ed2b",
    "userid": "c724b02cf291a2403b002182579ed36d",
    "camp_cpc": 0.165,
    "date": "2016-01-29T12:00:15",
    "frienddomainid": "c84f1f1c3914a66236542d1166b01780",
    "freeclick": false,
    "network": "a",
    "PlistaProduct": "Product 1"
  }
]

// ======= Drop attributes that you do not need ======= //
export const raw = rawData;
const dropUnusedAttributes = rawData.map(
  ({ a, campaignid, userid, frienddomainid, ...keepRest }) => keepRest
);

// ================= Date parsing ===================== //
const moment = require("moment");

// Create time(HH:mm) date(DD.MM.YYYY) attributes with required format
// manual test that parsing was successful
const dataWithTimeDate = dropUnusedAttributes.map(obj => {
  obj.time = moment(obj.date).format("HH:mm");
  obj.germanDate = moment(obj.date).format("DD.MM.YYYY");
  return obj;
});
// delete the previous ISO date attribute and rename the "germanDate" attribute to "date"
const dataWithTimeDateClean = dataWithTimeDate
  .map(({ date, ...keepRest }) => keepRest)
  .map(({ germanDate: date, ...keepRest }) => ({ date, ...keepRest }));

// ======= Convert boolean(freeclick) to string YES/NO ========== //
const mutateDataWithTimeDateClean = dataWithTimeDateClean.map(x => {
  x.freeclick = x.freeclick ? "true" : "false";
  return x;
});
// ======= Add primary key ========== //
const cleanDataWithRowId = dataWithTimeDateClean.map((obj, index) => {
  obj.key = index;
  return obj;
});

// ======= Export data after preprocess ========== //
export const plCleanData = cleanDataWithRowId;

// ========================================================= //
// ========================================================= //
// ========================================================= //
// ========================================================= //
// ======= BONUS: make everything with 1 function ========== //
export const cleanTheData = data => {
  const clean = data
    .map(({ a, campaignid, userid, frienddomainid, ...keepRest }) => keepRest)
    .map(obj => {
      obj.time = moment(obj.date).format("HH:mm");
      obj.germanDate = moment(obj.date).format("DD.MM.YYYY");
      return obj;
    })
    .map(({ date, ...keepRest }) => keepRest)
    .map(({ germanDate: date, ...keepRest }) => ({ date, ...keepRest }))
    .map((obj, index) => {
      obj.key = index;
      return obj;
    })
    .map(x => {
      x.freeclickString = x.freeclick ? "true" : "false";
      return x;
    })
    .map(({ freeclick, ...keepRest }) => keepRest)
    .map(({ freeclickString: freeclick, ...keepRest }) => ({
      freeclick,
      ...keepRest
    }));
  // .map(x => {
  //   x.camp_cpc = `€ ${x.camp_cpc}`;
  //   return x;
  // });

  return clean;
};

// ======= BONUS: Define PlistaProduct value range ========== //
// parse product numbers
const plistaProductNumbers = dataWithTimeDateClean.map(obj =>
  parseInt(obj.PlistaProduct.match(/\d+/)[0], 10)
);
// find max product number (10)
const maxProductNumber = Math.max(
  ...dataWithTimeDateClean.map(obj => obj.PlistaProduct.match(/\d+/)[0])
);
// Product Range to use 1-10
