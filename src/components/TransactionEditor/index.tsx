import { Editor, OnChange } from '@monaco-editor/react'
import { Button, Grid, Loading } from '@nextui-org/react'
import { useCallback, useEffect, useState } from 'react'
import { Transaction, TransactionMetadata, TxResponse, ValidationError, XrplError } from 'xrpl'

import { useTransactionAutofill } from '@/hooks/useTransactionAutofill'
import { useTransactionSign } from '@/hooks/useTransactionSign'
import { useTransactionSubmit } from '@/hooks/useTransactionSubmit'
import { useTransactionValidation } from '@/hooks/useTransactionValidation'

export type OnSubmitProps = Omit<TxResponse['result'], 'meta'> & {
  meta?: TransactionMetadata
}

type Props = {
  validTransactionType: Transaction['TransactionType']
  json?: object
  onSubmit: (tx: OnSubmitProps) => void
}

type CheckStatus = 'initial' | 'validated' | 'autofilled' | 'success'
type LoadingStatus = 'none' | 'autofill' | 'submit'

export const TransactionCodeEditor = (props: Props) => {
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
      setLoading('none')
      setResponseTx(result)
      setStatus('success')
      props.onSubmit(result as any)
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
        theme='light'
        value={JSON.stringify(txjson, null, '  ')}
        onChange={onChange}
        options={{ minimap: { enabled: false }, scrollBeyondLastLine: false }}
      />
      <Grid.Container gap={1}>
        <Grid>
          <Button size='sm' onPress={validate} disabled={isValidated}>
            {!isValidated ? 'validate' : 'validated'}
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

      <pre className='border p-4'>
        Transaction Result:
        <code>{JSON.stringify(responseTx, null, 2)}</code>
      </pre>
    </div>
  )
}
