## ⚠️ Warning

Any content produced by Solana, or developer resources that Solana provides, are for educational and inspiration purposes only. Solana does not encourage, induce or sanction the deployment of any such applications in violation of applicable laws or regulations.


Alcuni appunti di funzioni by Marco Brugali



Lista totale dei token
const { tokens, tokenMap } = useConnectionConfig();

-----------------------------------------

Lista dei token popolati nel mio wallet
const { userAccounts } = useUserAccounts();

restituisce una lista di
export interface TokenAccount {
  pubkey: PublicKey;
  account: AccountInfo<Buffer>;
  info: TokenAccountInfo;
}

-----------------------------------------

"props.mint" è la stringa dell'address del token da filtrare.
Questa funziona restituisce il numero dei token filtrati all'interno del nostro portafoglio.

const userUiBalance = () => {
    const currentAccount = userAccounts?.find(
      (a) => a.info.mint.toBase58() === props.mint
    );
    if (currentAccount && mint) {
      return convert(currentAccount, mint);
    }
    
    return 0;
};

export function convert(
  account?: TokenAccount | number,
  mint?: MintInfo,
  rate: number = 1.0
): number {
  if (!account) {
    return 0;
  }

  const amount =
    typeof account === "number" ? new BN(account) : account.info.amount;

  const precision = new BN(10).pow(new BN(mint?.decimals || 0));

  // avoid overflowing 53 bit numbers on calling toNumber()
  let div = amount.div(precision).toNumber();
  let rem = amount.mod(precision).toNumber() / precision.toNumber();
  let result = (div + rem) * rate;

  return result;
}

-----------------------------------------

nome del token:

const name = useTokenName(userAccount.info.reserve.liquidityMint);
