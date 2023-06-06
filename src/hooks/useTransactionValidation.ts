import { isValidClassicAddress } from 'ripple-address-codec'
import { Transaction, ValidationError } from 'xrpl'
import { validate as validateTransavtion } from 'xrpl/dist/npm/models/transactions'
import { validateNFTokenAcceptOffer } from 'xrpl/dist/npm/models/transactions/NFTokenAcceptOffer'
import { validateNFTokenBurn } from 'xrpl/dist/npm/models/transactions/NFTokenBurn'
import { validateNFTokenCancelOffer } from 'xrpl/dist/npm/models/transactions/NFTokenCancelOffer'
import { validateNFTokenCreateOffer } from 'xrpl/dist/npm/models/transactions/NFTokenCreateOffer'
import { validateNFTokenMint } from 'xrpl/dist/npm/models/transactions/NFTokenMint'
import { validateAccountDelete } from 'xrpl/dist/npm/models/transactions/accountDelete'
import { validateAccountSet } from 'xrpl/dist/npm/models/transactions/accountSet'
import { validateCheckCancel } from 'xrpl/dist/npm/models/transactions/checkCancel'
import { validateCheckCash } from 'xrpl/dist/npm/models/transactions/checkCash'
import { validateCheckCreate } from 'xrpl/dist/npm/models/transactions/checkCreate'
import { validateDepositPreauth } from 'xrpl/dist/npm/models/transactions/depositPreauth'
import { validateEscrowCancel } from 'xrpl/dist/npm/models/transactions/escrowCancel'
import { validateEscrowCreate } from 'xrpl/dist/npm/models/transactions/escrowCreate'
import { validateEscrowFinish } from 'xrpl/dist/npm/models/transactions/escrowFinish'
import { validateOfferCancel } from 'xrpl/dist/npm/models/transactions/offerCancel'
import { validateOfferCreate } from 'xrpl/dist/npm/models/transactions/offerCreate'
import { validatePayment } from 'xrpl/dist/npm/models/transactions/payment'
import { validatePaymentChannelClaim } from 'xrpl/dist/npm/models/transactions/paymentChannelClaim'
import { validatePaymentChannelCreate } from 'xrpl/dist/npm/models/transactions/paymentChannelCreate'
import { validatePaymentChannelFund } from 'xrpl/dist/npm/models/transactions/paymentChannelFund'
import { validateSetRegularKey } from 'xrpl/dist/npm/models/transactions/setRegularKey'
import { validateSignerListSet } from 'xrpl/dist/npm/models/transactions/signerListSet'
import { validateTicketCreate } from 'xrpl/dist/npm/models/transactions/ticketCreate'
import { validateTrustSet } from 'xrpl/dist/npm/models/transactions/trustSet'

export const useTransactionValidation = () => {
  const validate = (txjson: Record<string, unknown>) => {
    validateAccount(txjson)
    const TransactionType = txjson.TransactionType as Transaction['TransactionType']
    if (TransactionType === 'AccountDelete') {
      validateAccountDelete(txjson)
    } else if (TransactionType === 'AccountSet') {
      validateAccountSet(txjson)
    } else if (TransactionType === 'CheckCancel') {
      validateCheckCancel(txjson)
    } else if (TransactionType === 'CheckCash') {
      validateCheckCash(txjson)
    } else if (TransactionType === 'CheckCreate') {
      validateCheckCreate(txjson)
    } else if (TransactionType === 'DepositPreauth') {
      validateDepositPreauth(txjson)
    } else if (TransactionType === 'EscrowCancel') {
      validateEscrowCancel(txjson)
    } else if (TransactionType === 'EscrowCreate') {
      validateEscrowCreate(txjson)
    } else if (TransactionType === 'EscrowFinish') {
      validateEscrowFinish(txjson)
    } else if (TransactionType === 'NFTokenAcceptOffer') {
      validateNFTokenAcceptOffer(txjson)
    } else if (TransactionType === 'NFTokenBurn') {
      validateNFTokenBurn(txjson)
    } else if (TransactionType === 'NFTokenCancelOffer') {
      validateNFTokenCancelOffer(txjson)
    } else if (TransactionType === 'NFTokenCreateOffer') {
      validateNFTokenCreateOffer(txjson)
    } else if (TransactionType === 'NFTokenMint') {
      validateNFTokenMint(txjson)
    } else if (TransactionType === 'OfferCancel') {
      validateOfferCancel(txjson)
    } else if (TransactionType === 'OfferCreate') {
      validateOfferCreate(txjson)
    } else if (TransactionType === 'Payment') {
      validateDestination(txjson)
      validatePayment(txjson)
    } else if (TransactionType === 'PaymentChannelClaim') {
      validatePaymentChannelClaim(txjson)
    } else if (TransactionType === 'PaymentChannelCreate') {
      validatePaymentChannelCreate(txjson)
    } else if (TransactionType === 'PaymentChannelFund') {
      validatePaymentChannelFund(txjson)
    } else if (TransactionType === 'SetRegularKey') {
      validateSetRegularKey(txjson)
    } else if (TransactionType === 'SignerListSet') {
      validateSignerListSet(txjson)
    } else if (TransactionType === 'TicketCreate') {
      validateTicketCreate(txjson)
    } else if (TransactionType === 'TrustSet') {
      validateTrustSet(txjson)
    } else {
      throw new Error('Invalid TransactionType')
    }
    validateTransavtion(txjson)
  }

  const validateAccount = (txjson: Record<string, unknown>) => {
    if (!txjson.Account) {
      throw new ValidationError('missing field Account')
    }
    if (typeof txjson.Account !== 'string' || !isValidClassicAddress(txjson.Account)) {
      throw new ValidationError('invalid Account')
    }
  }
  const validateDestination = (txjson: Record<string, unknown>) => {
    if (!txjson.Destination) {
      throw new ValidationError('missing field Destination')
    }
    if (typeof txjson.Destination !== 'string' || !isValidClassicAddress(txjson.Destination)) {
      throw new ValidationError('invalid Destination')
    }
  }
  return validate
}
