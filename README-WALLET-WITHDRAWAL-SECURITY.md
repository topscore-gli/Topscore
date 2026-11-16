# TopScore wallet and withdrawal security update

## What changed

- Referral rewards now increment both the withdrawable wallet and a lifetime `referralEarnedNgn` counter in the same Firestore transaction as payment fulfillment.
- Referral total earned is no longer presented as the current wallet balance. The account page shows lifetime earned separately from available and pending balances.
- Withdrawal requests require an integer NGN amount of at least ₦1,000 and a bank account previously resolved and saved through the server.
- Requesting a withdrawal moves funds from available balance to pending balance. Funds remain pending until Paystack confirms the transfer.
- Admin approval first claims a withdrawal transactionally (`initiating`) and sends a deterministic Paystack transfer reference: `TSWD-<withdrawal-document-id>`.
- A second admin approval cannot initiate a second transfer while the request is `initiating` or `processing`.
- Signed Paystack `transfer.success` events mark the request `paid` and release the pending balance.
- Signed `transfer.failed` and `transfer.reversed` events return funds to the student's available balance and reduce pending balance. Webhook settlement is idempotent.
- If the Paystack request outcome is uncertain, the withdrawal remains locked rather than being reset to pending. This avoids an unsafe retry that could pay twice.
- Admin queue shows pending, initiating and processing withdrawals. Only pending requests expose the Initiate/Reject actions.
- Students can see available funds, pending funds and recent wallet ledger activity in their account page.

## Required deployment/configuration

1. Confirm the Paystack secret `PAYSTACK_SECRET_KEY` is configured for the deployed Functions.
2. Configure the Paystack webhook URL to the deployed `paystackWebhook` HTTPS function.
3. Ensure Paystack webhook events are enabled for `charge.success`, `transfer.success`, `transfer.failed` and `transfer.reversed` where supported by the Paystack account/API configuration.
4. Deploy Cloud Functions and the updated static site together. The frontend relies on the new `getWallet` and `getReferralInfo` response fields and the updated admin withdrawal statuses.
5. Test with Paystack test mode and a Firebase emulator/staging project before live transfers.

## Manual reconciliation

A withdrawal left in `initiating` after a network/API error is intentionally locked. An administrator must look up the exact `transferReference` in the Paystack dashboard/API and confirm whether the transfer exists and its final status before any manual database repair. Do not set it back to `pending` merely because the browser showed an error. If Paystack accepted the transfer but the response was lost, retrying could cause duplicate payment.

## Verification limits

Source-level JavaScript syntax checks are run for `functions/index.js`, `admin.html`, and `account.html`. No Firebase emulator test, Paystack test transfer, webhook delivery test, or production deployment is implied by this source update.
