import { Editor, OnChange } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { RippledError } from "xrpl";
import { BaseResponse } from "xrpl/dist/npm/models/methods/baseMethod";
import { BaseRequest } from "xrpl/dist/npm/models/methods/baseMethod";

import { useCommandSender } from "@/hooks/useCommandSender";

type Props = {
  validCommandType: BaseRequest['command'];
  json?: object;
  onSuccess: (result: BaseResponse['result']) => void;
};

type CheckStatus = "initial" | "error" | "success";

export const CommandCodeEditor = (props: Props) => {
  const [status, setStatus] = useState<CheckStatus>("initial");
  const [command, setCommand] = useState<Record<string, unknown>>({});
  const [errorMsg, setErrorMsg] = useState<string>();
  const sendCommand = useCommandSender()
  
  useEffect(() => {
    setCommand({
      command: "",
      ...props.json,
    });
  }, [props.json]);

  const onChange: OnChange = (value) => {
    if (!value) return;
    setCommand(JSON.parse(value));
    setStatus("initial");
  };
  
  const send = async () => {
    if (!command.command || typeof command.command !== 'string' || props.validCommandType !== command.command) {
      setErrorMsg('Invalid command field')
      return
    }
    try {
      await sendCommand(command as BaseRequest)
    } catch (e) {
      setErrorMsg((e as RippledError).message)
    }
  }

  return (
    <div>
      <Editor
        height={200}
        defaultLanguage="json"
        theme="light"
        value={JSON.stringify(command, null, "  ")}
        onChange={onChange}
        options={{ minimap: { enabled: false }, scrollBeyondLastLine: false }}
      />
      <div>{errorMsg}</div>
      <button onClick={send}>Send</button>
    </div>
  );
};
