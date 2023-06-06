import { Editor, OnChange } from '@monaco-editor/react'
import { Button, Grid } from '@nextui-org/react'
import { useCallback, useEffect, useState } from 'react'
import { RippledError } from 'xrpl'
import { BaseResponse } from 'xrpl/dist/npm/models/methods/baseMethod'
import { BaseRequest } from 'xrpl/dist/npm/models/methods/baseMethod'

import { useDarkMode } from '@/hooks/useColorMode'
import { useCommandSender } from '@/hooks/useCommandSender'

type Props = {
  validCommandType: BaseRequest['command']
  json?: object
  onSuccess: (result: BaseResponse['result']) => void
}

export const CommandCodeEditor = (props: Props) => {
  const isDark = useDarkMode()
  const [command, setCommand] = useState<Record<string, unknown>>({})
  const [errorMsg, setErrorMsg] = useState<string>()
  const sendCommand = useCommandSender()
  const [responseCommand, setResponseCommand] = useState<Record<string, any>>()

  const resetJson = useCallback(() => {
    setCommand({
      command: '',
      ...props.json,
    })
    setResponseCommand(undefined)
  }, [props.json])

  useEffect(() => {
    resetJson()
  }, [resetJson])

  const onChange: OnChange = (value) => {
    if (!value) return
    setCommand(JSON.parse(value))
  }

  const send = async () => {
    setErrorMsg(undefined)
    setResponseCommand(undefined)
    if (!command.command || typeof command.command !== 'string' || props.validCommandType !== command.command) {
      setErrorMsg('Invalid command field')
      return
    }
    try {
      const response = await sendCommand(command as BaseRequest)
      setResponseCommand(response as any)
    } catch (e) {
      setErrorMsg((e as RippledError).message)
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
        theme={isDark ? 'vs-dark' : 'white'}
        value={JSON.stringify(command, null, '  ')}
        onChange={onChange}
        options={{ minimap: { enabled: false }, scrollBeyondLastLine: false }}
      />
      <Grid.Container gap={1}>
        <Grid>
          <Button size='sm' onPress={send}>
            Send
          </Button>
        </Grid>
        <Grid>
          <Button size='sm' onPress={reset}>
            Reset
          </Button>
        </Grid>
      </Grid.Container>
      <div className='font-bold text-red-500'>{errorMsg}</div>

      <pre className='border p-4'>
        Result:
        <code className='dark:text-gray-100'>{JSON.stringify(responseCommand, null, 2)}</code>
      </pre>
    </div>
  )
}
