const sanityClient = require("@sanity/client");
const fs = require("fs");
const parse = require("csv-parse");

const client = sanityClient({
  projectId: "prx82rd7",
  dataset: "production",
  // a token with write access
  token:
    "skaytMQCRUUAFu1vPNa2kb7JhDSFPjZolOncPYGeOUcWCf2ttPzRHg3RYbmSFpns2rPqxp5XBsePGTp4OQbD6L673r2cs718Pu6aBjXOe9kRLEYNUuzpje413aZKpRAj61iZ3b8VpNo0vWCaK553879A9Z4lgSoaUGRt0oqldecGgV235VEM",
  useCdn: false,
  apiVersion: "2021-06-07",
});

const dataFile = "data.csv";

var csvData = [];
fs.createReadStream(dataFile)
  .pipe(parse.parse({ delimiter: "||**||" }))
  .on("data", function (csvrow) {
    // console.log(csvrow);
    //do something with csvrow
    csvData.push(csvrow);
  })
  .on("end", function () {
    //do something with csvData
    handleData(csvData);
  });

function handleData(data) {
  function objectifyAList(lst) {
    newObject = lst.reduce(
      (prev, current, index) => ({
        ...prev,
        [sanitizeName(data[1][index])]: current,
      }),
      {}
    );
    newObject._type = data[0][1];
    return newObject;
  }

  myObjects = csvData.slice(2).map((item) => objectifyAList(item));
  // console.log(myObjects)
  Promise.all(myObjects.map((object) => client.createOrReplace(object))).then(
    (msg) => console.log(msg)
  );
}

function sanitizeName(name) {
  return name;
}
