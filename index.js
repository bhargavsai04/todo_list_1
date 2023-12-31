const expressApp = require("./app");
const serverPort = process.env.PORT || 3000;

expressApp.listen(serverPort, () => {
  console.log(`Server is listening at port - ${serverPort}`);
});
