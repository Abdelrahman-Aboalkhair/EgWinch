const testDB = require("./config/testDB.config");

beforeAll(async () => {
  await testDB.connect();
});

afterEach(async () => {
  await testDB.clear();
});

afterAll(async () => {
  await testDB.disconnect();
});
