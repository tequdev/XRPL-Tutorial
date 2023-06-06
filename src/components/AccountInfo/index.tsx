import { CommandCodeEditor } from "../CommandEditor";

/**
 * 
 */
export const AccountInfo = () => {
  
  const checkCode = (tx: Record<string, unknown>) => {
  }
  
  return (
    <div>
      <CommandCodeEditor
        validCommandType="account_info"
        json={{
          account: ''
        }}
        onSuccess={()=>{}}
      />
    </div>
  );
};
