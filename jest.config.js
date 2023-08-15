export default {
  testEnvironment: "node",
  testMatch: ["**/*.test.js"],
};

process.env = Object.assign(process.env, {
  JWT_SECRET: 'jwt',
  VAR_NAME_2: 'varValue2'
});
