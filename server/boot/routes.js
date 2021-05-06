const request = require("request-promise");
const moment = require("moment");

module.exports = function (app) {
  app.get("/", function (req, res) {
    res.render("home");
  });

  app.get("/register", function (req, res, next) {
    res.render("register", { email: req.query.email });
  });

  app.post("/register", async (req, res, next) => {
    try {
      const pincode = req.body.pincode;
      const inputDate = req.body.date;
      const date = inputDate
        ? moment(inputDate).format("DD-MM-YYYY")
        : moment().format("DD-MM-YYYY");

      const options = {
        method: "GET",
        url:
          "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin",
        headers: {
          accept: "application/json",
          "Accept-Language": "hi_IN",
        },
        qs: {
          pincode,
          date,
        },
        json: true,
      };
      let response = {};
      try {
        response = await request(options);
      } catch (err) {
        console.log(err);
        response.sessions = [];
      }
      const arrayOfSessions = response.sessions;
      const items = arrayOfSessions.map(
        ({
          name,
          address,
          fee_type: feeType,
          fee: feeAmount,
          min_age_limit: minAgeLimit,
          slots,
          available_capacity: availableCapacity,
          vaccine,
        }) => ({
          name,
          address,
          feeType,
          feeAmount,
          minAgeLimit,
          slots,
          availableCapacity,
          vaccine,
        })
      );
      res.render("table", {
        items,
      });
    } catch (error) {
      console.log(error);
      res.send(`<h1>Error !!!, Please try again after some time </h1>`);
    }
  });
};
