import { useReducer, createContext, Dispatch, ReactNode } from "react"
import { BudgetAction, budgetReducer, BudgetState, initialState } from "../reducers/budget-reducer"


type BudgetContextProps = {
    state: BudgetState,
    dispatch: Dispatch<BudgetAction>
}

type BudgetProviderProps = {
    children: ReactNode
}

export const BudgetContext = createContext<BudgetContextProps>({} as BudgetContextProps)

export const BudgetProvider = ({children} : BudgetProviderProps) => {
    const [state, dispatch] = useReducer(budgetReducer, initialState)

    return (
        <BudgetContext.Provider 
            value={{
                state,
                dispatch
            }}
        >
            {children}
        </BudgetContext.Provider>
    )
}