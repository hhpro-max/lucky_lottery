const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

/**
 * @swagger
 * components:
 *   schemas:
 *     Wallet:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         balance:
 *           type: number
 *           format: float
 *           example: 1250.75
 *         currency_code:
 *           type: string
 *           example: "USD"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             email:
 *               type: string
 *               example: "user@example.com"
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         type:
 *           type: string
 *           enum: [debit, credit]
 *           example: "credit"
 *         amount:
 *           type: number
 *           format: float
 *           example: 100.00
 *         reference:
 *           type: string
 *           example: "Deposit via credit_card"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         wallet:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             currency_code:
 *               type: string
 *               example: "USD"
 *     DepositRequest:
 *       type: object
 *       required:
 *         - amount
 *         - payment_method
 *       properties:
 *         amount:
 *           type: number
 *           format: float
 *           minimum: 0.01
 *           example: 100.00
 *           description: Amount to deposit
 *         payment_method:
 *           type: string
 *           example: "credit_card"
 *           description: Payment method used (e.g., credit_card, bank_transfer, paypal)
 *         reference:
 *           type: string
 *           example: "Monthly deposit"
 *           description: Optional reference for the transaction
 *     WithdrawRequest:
 *       type: object
 *       required:
 *         - amount
 *         - withdrawal_method
 *       properties:
 *         amount:
 *           type: number
 *           format: float
 *           minimum: 0.01
 *           example: 50.00
 *           description: Amount to withdraw
 *         withdrawal_method:
 *           type: string
 *           example: "bank_transfer"
 *           description: Withdrawal method (e.g., bank_transfer, paypal, crypto)
 *         reference:
 *           type: string
 *           example: "Emergency withdrawal"
 *           description: Optional reference for the transaction
 *     TransactionResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Deposit successful"
 *         transaction:
 *           $ref: '#/components/schemas/Transaction'
 *         new_balance:
 *           type: number
 *           format: float
 *           example: 1350.75
 *     TransactionListResponse:
 *       type: object
 *       properties:
 *         transactions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Transaction'
 *         pagination:
 *           type: object
 *           properties:
 *             current_page:
 *               type: integer
 *               example: 1
 *             total_pages:
 *               type: integer
 *               example: 5
 *             total_items:
 *               type: integer
 *               example: 100
 *             items_per_page:
 *               type: integer
 *               example: 20
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Invalid amount"
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Validation failed"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "amount"
 *               message:
 *                 type: string
 *                 example: "Amount must be greater than 0"
 */

/**
 * @swagger
 * /wallet:
 *   get:
 *     summary: Get user's wallet information
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 balance:
 *                   type: number
 *                   format: float
 *                 currency_code:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/Wallet/properties/user'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Wallet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', auth, walletController.getWallet);

/**
 * @swagger
 * /wallet/deposit:
 *   post:
 *     summary: Deposit money into wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DepositRequest'
 *     responses:
 *       201:
 *         description: Deposit successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 *       400:
 *         description: Invalid amount
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Wallet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/deposit', auth, validate, walletController.deposit);

/**
 * @swagger
 * /wallet/withdraw:
 *   post:
 *     summary: Withdraw money from wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WithdrawRequest'
 *     responses:
 *       201:
 *         description: Withdrawal successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 *       400:
 *         description: Invalid amount or insufficient balance
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Wallet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/withdraw', auth, validate, walletController.withdraw);

/**
 * @swagger
 * /wallet/transactions:
 *   get:
 *     summary: Get user's transaction history
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [debit, credit]
 *         description: Filter by transaction type
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter transactions from this date (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter transactions until this date (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of transactions per page
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionListResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 */
router.get('/transactions', auth, walletController.getTransactions);



module.exports = router; 