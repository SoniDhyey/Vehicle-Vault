const routes = require("express").Router();
const transactionController = require("../controllers/TransactionController")
routes.post("/createTransaction",transactionController.createTransaction)
routes.get("/getAllTransaction",transactionController.getAllTransaction)
routes.put("/updatetransaction/:id", transactionController.updateTransaction)

routes.delete("/deletetransaction/:id", transactionController.deleteTransaction)

module.exports = routes