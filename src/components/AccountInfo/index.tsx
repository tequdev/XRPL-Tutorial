import { CommandCodeEditor } from "../CommandEditor";

import { useWallet } from "@/hooks/useWallet";

/**
 * 
 */
export const AccountInfo = () => {
  const { account } = useWallet()
  
  const checkCode = (tx: Record<string, unknown>) => {
  }
  
  return (
    <div>
      <CommandCodeEditor
        validCommandType='account_info'
        json={{
          command: 'account_info',
          account: account?.address,
          validated: true
        }}
        onSuccess={() => {}}
      />
    </div>
  )
};
