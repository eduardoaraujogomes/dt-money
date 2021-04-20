import { createContext, useEffect, useState, ReactNode } from 'react';
import { api } from './services/api';

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

// interface TransactionsInput {
//     title: string;
//     amount: number;
//     type: string;
//     category: string;
// }

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

// type TransactionInput = Pick<Transaction, 'title' | 'amount' | 'type' | 'category'>;

interface TransactionsProviderProps {
    children: ReactNode;
}

interface TransactionContextData {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

export const TransactionsContext = createContext<TransactionContextData>(
    {} as TransactionContextData
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);


    useEffect(() => {
        api.get('transactions')
            .then(response => setTransactions(response.data.transactions));
    }, []);

    async function createTransaction(transactionInput: TransactionInput) {
        const responde = await api.post('/transactions', {
            ...transactionInput,
            createdAt: new Date()
        });
        const { transaction } = responde.data;

        setTransactions([
            ...transactions,
            transaction,
        ]);

    }


    return (
        <TransactionsContext.Provider value={{ transactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>

    );
}
