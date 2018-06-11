const app = require("../src/app");

test("Test that app is an express app with listen property", () => {
	expect(app).toHaveProperty("listen");
});