const seeder = require("mongoose-seed");
const seedData = require("../constants/seedData");

seeder.connect(process.env.MONGO_URI, () => {
  seeder.loadModels([
    "../models/booking.model.js",
    "../models/user.model.js",
    "../models/review.model.js",
    "../models/conversation.model.js",
    "../models/message.model.js",
  ]);

  seeder.clearModels(
    ["Booking", "User", "Review", "Conversation", "Message"],
    () => {
      seeder.populateModels(seedData, () => {
        seeder.disconnect();
      });
    }
  );
});
