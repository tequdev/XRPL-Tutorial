import { Editor, OnChange } from '@monaco-editor/react'
import { Button, Grid, Loading } from '@nextui-org/react'
import { track } from '@vercel/analytics/react'
import { useCallback, useEffect, useState } from 'react'
import { Transaction, TransactionMetadata, TxResponse, ValidationError, XrplError } from 'xrpl'

import { useDarkMode } from '@/hooks/useColorMode'
import { useTransactionAutofill } from '@/hooks/useTransactionAutofill'
import { useTransactionSign } from '@/hooks/useTransactionSign'
import { useTransactionSubmit } from '@/hooks/useTransactionSubmit'
import { useTransactionValidation } from '@/hooks/useTransactionValidation'

export type OnSubmitProps<T extends Transaction = Transaction> = Omit<TxResponse<T>['result'], 'meta'> & {
  meta?: TransactionMetadata
}

export type OnSubmitReturnType = { success: true } | { success: false; message: string }

type Props<T extends Transaction = Transaction> = {
  validTransactionType: Transaction['TransactionType']
  json?: Transaction
  onSubmit: (tx: OnSubmitProps<T>) => Promise<OnSubmitReturnType>
  showResult?: boolean
}

type CheckStatus = 'initial' | 'validated' | 'autofilled' | 'success'
type LoadingStatus = 'none' | 'autofill' | 'submit'

export const TransactionCodeEditor = <T extends Transaction = Transaction>(props: Props<T>) => {
  const isDark = useDarkMode()
  const [status, setStatus] = useState<CheckStatus>('initial')
  const [txjson, setTxjson] = useState<Record<string, unknown>>({})
  const validateTransaction = useTransactionValidation()
  const autofillTransaction = useTransactionAutofill()
  const signTransaction = useTransactionSign()
  const submitTransaction = useTransactionSubmit()
  const [loading, setLoading] = useState<LoadingStatus>('none')
  const [errorMsg, setErrorMsg] = useState<string>()
  const [responseTx, setResponseTx] = useState<Record<string, any>>()

  const resetJson = useCallback(() => {
    setTxjson({
      TransactionType: '',
      Account: '',
      ...props.json,
    })
    setResponseTx(undefined)
    setStatus('initial')
  }, [props.json])

  useEffect(() => {
    resetJson()
  }, [resetJson])

  const onChange: OnChange = (value) => {
    if (!value) return
    setTxjson(JSON.parse(value))
    setStatus('initial')
  }

  const isValidated = status !== 'initial'
  const isAutofilled = status === 'autofilled' || status === 'success'
  const isSuccessed = status === 'success'

  const validate = () => {
    setResponseTx(undefined)
    setErrorMsg(undefined)
    setStatus('initial')
    if (!txjson.TransactionType) {
      setErrorMsg('missing field TransactionType')
      return
    }
    if (txjson.TransactionType !== props.validTransactionType) {
      setErrorMsg('Invalid TransactionType')
      return
    }
    try {
      validateTransaction(txjson)
      track('transaction/validate', { TransactionType: txjson.TransactionType as string })
      setStatus('validated')
    } catch (e) {
      console.error(e)
      setErrorMsg((e as ValidationError).message)
    }
  }

  const autofill = async () => {
    setResponseTx(undefined)
    setErrorMsg(undefined)
    try {
      setLoading('autofill')
      const tx = await autofillTransaction(txjson)
      track('transaction/autofill', { TransactionType: txjson.TransactionType as string })
      setLoading('none')
      setTxjson(tx as unknown as Record<string, unknown>)
      setStatus('autofilled')
    } catch (e) {
      setLoading('none')
      console.error(e)
      setErrorMsg((e as ValidationError).message)
    }
  }

  const submit = async () => {
    setResponseTx(undefined)
    setErrorMsg(undefined)
    try {
      setLoading('submit')
      const txBlob = signTransaction(txjson)
      const result = await submitTransaction(txBlob)
      track('transaction/submit', { TransactionType: txjson.TransactionType as string })
      setLoading('none')
      setResponseTx(result)
      setStatus('success')
      const checkResult = await props.onSubmit(result as any)
      if (checkResult.success) {
        // OK
      } else {
        // NG
        setErrorMsg(checkResult.message)
      }
    } catch (e) {
      setLoading('none')
      setErrorMsg((e as XrplError).message)
      setStatus('initial')
    }
  }

  const reset = () => {
    resetJson()
  }

  return (
    <div className='m-4'>
      <Editor
        className='border p-1'
        height={200}
        defaultLanguage='json'
        theme={isDark ? 'vs-dark' : 'light'}
        value={JSON.stringify(txjson, null, '  ')}
        onChange={onChange}
        options={{ minimap: { enabled: false }, scrollBeyondLastLine: false }}
      />
      <Grid.Container gap={1}>
        <Grid>
          <Button size='sm' onPress={validate} disabled={isValidated}>
            {!isValidated ? 'Validate' : 'Validated'}
          </Button>
        </Grid>
        <Grid>
          <Button size='sm' onPress={autofill} disabled={isAutofilled}>
            {loading !== 'autofill' ? (
              !isAutofilled ? (
                'Autofill'
              ) : (
                'Autofilled'
              )
            ) : (
              <Loading className='absolute bottom-0 left-0' type='points-opacity' color='white' />
            )}
          </Button>
        </Grid>
        <Grid>
          <Button size='sm' onPress={submit} disabled={isSuccessed}>
            {loading !== 'submit' ? (
              'Submit'
            ) : (
              <Loading className='absolute bottom-0 left-0' type='points-opacity' color='white' />
            )}
          </Button>
        </Grid>
        {isSuccessed && (
          <Grid>
            <Button size='sm' onPress={reset}>
              Reset
            </Button>
          </Grid>
        )}
      </Grid.Container>
      <div className='font-bold text-red-500'>{errorMsg}</div>
      {props.showResult === false ? null : (
        <pre className='border p-4'>
          Transaction Result:
          <code className='dark:text-gray-100'>{JSON.stringify(responseTx, null, 2)}</code>
        </pre>
      )}
    </div>
  )
}
