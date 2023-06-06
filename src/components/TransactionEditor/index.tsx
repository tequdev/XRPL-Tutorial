import { Editor, OnChange } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { Transaction, TxResponse, ValidationError, XrplError } from "xrpl";

import { useTransactionAutofill } from "@/hooks/useTransactionAutofill";
import { useTransactionSign } from "@/hooks/useTransactionSign";
import { useTransactionSubmit } from "@/hooks/useTransactionSubmit";
import { useTransactionValidation } from "@/hooks/useTransactionValidation";

type Props = {
  validTransactionType: Transaction["TransactionType"];
  json?: object;
  onSubmit: (txhash: TxResponse['result']) => void;
};

type CheckStatus = "initial" | "validated" | "autofilled" | "success";

export const TransactionCodeEditor = (props: Props) => {
  const [status, setStatus] = useState<CheckStatus>("initial");
  const [txjson, setTxjson] = useState<Record<string, unknown>>({});
  const validateTransaction = useTransactionValidation();
  const autofillTransaction = useTransactionAutofill();
  const signTransaction = useTransactionSign();
  const submitTransaction = useTransactionSubmit();
  const [errorMsg, setErrorMsg] = useState<string>();
  
  useEffect(() => {
    setTxjson({
      TransactionType: "",
      Account: "",
      ...props.json,
    });
  }, [props.json]);

  const onChange: OnChange = (value) => {
    if (!value) return;
    setTxjson(JSON.parse(value));
    setStatus("initial");
  };

  const validate = () => {
    setErrorMsg(undefined);
    setStatus("initial");
    if (!txjson.TransactionType) {
      setErrorMsg("missing field TransactionType");
      return;
    }
    if (txjson.TransactionType !== props.validTransactionType) {
      setErrorMsg("Invalid TransactionType");
      return;
    }
    try {
      validateTransaction(txjson);
      setStatus("validated");
    } catch (e) {
      console.error(e);
      setErrorMsg((e as ValidationError).message);
    }
  };

  const autofill = async () => {
    try {
      const tx = await autofillTransaction(txjson);
      setTxjson(tx as unknown as Record<string, unknown>);
      setStatus("autofilled");
    } catch (e) {
      console.error(e);
      setErrorMsg((e as ValidationError).message);
    }
  };

  const submit = async () => {
    const txBlob = signTransaction(txjson);
    try {
      const result = await submitTransaction(txBlob);
      props.onSubmit(result)
    } catch (e) {
      setErrorMsg((e as XrplError).message)
    }
  };

  return (
    <div className="m-4">
      <Editor
        height={200}
        defaultLanguage="json"
        theme="light"
        value={JSON.stringify(txjson, null, "  ")}
        onChange={onChange}
        options={{ minimap: { enabled: false }, scrollBeyondLastLine: false }}
      />
      <div>{errorMsg}</div>
      <button onClick={validate}>Validate</button>
      <button onClick={autofill}>Autofill</button>
      <button onClick={submit}>Submit</button>
    </div>
  );
};
