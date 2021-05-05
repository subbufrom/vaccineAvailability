"use strict";

module.exports = function (SlotNotification) {
  SlotNotification.notify = async (req, res) => {
    const { email, pincode, age } = req.body;
    const agePreferrence = 18;
    try {
      const foundUser = await user.findOne({ where: { email } });
      if (!foundUser) {
        throw Error("UserNot found");
      }

      const foundSlot = await SlotNotification.findOne({
        where: {
          userId: foundUser.id,
          pincode,
          agePreferrence,
        },
      });

      if (foundSlot) return res.render("success");

      await SlotNotification.create({
        userId: foundUser.id,
        pincode,
        notifiedCount: 0,
        agePreferrence,
        createdAt: new Date(),
      });

      res.render("success");
    } catch (error) {
      console.log(error);
      res.render("home");
    }
  };

  SlotNotification.notifyUsers = () => {

  };


  SlotNotification.remoteMethod("notify", {
    accepts: [
      {
        arg: "req",
        required: true,
        type: "object",
        http: {
          source: "req",
        },
      },
      { arg: "res", type: "object", http: { source: "res" } },
    ],
    returns: {
      root: true,
      type: "object",
    },
    http: {
      path: "/notify",
      verb: "post",
    },
  });
};
