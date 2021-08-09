import { useEffect, useState } from 'react';
import Web3 from 'web3';
import getWeb3 from '../getWeb3';

type State = {
  isLoading: boolean;
  isWeb3: boolean;
  web3: Web3 | null;
  accounts: string[];
};

const Hooks = (): State => {
  const [state, setState] = useState<State>({
    isLoading: true,
    isWeb3: false,
    web3: null,
    accounts: [],
  });

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const web3: Web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        setState({
          ...state,
          isLoading: false,
          isWeb3: true,
          web3,
          accounts,
        });
      } catch {
        setState({
          ...state,
          isLoading: false,
        });
      }
    })();
  }, []);

  const { isLoading, isWeb3, web3, accounts } = state;
  return { isLoading, isWeb3, web3, accounts };
};

export default Hooks;
