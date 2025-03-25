import { v4 as uuidv4 } from 'uuid'
import { DraftExpense, Expense } from "../types"

export type BudgetAction = 
    { type: 'ADD_BUDGET', payload: {budget: number} } |
    { type: 'TOGGLE-MODAL'} |
    { type: 'ADD_EXPENSE', payload: {expense: DraftExpense} } |
    { type: 'REMOVE_EXPENSE', payload: {id: Expense['id']} } |
    { type: 'EDIT_EXPENSE', payload: {id: Expense['id']} } |
    { type: 'UPDATE_EXPENSE', payload: {expense: Expense} } |
    { type: 'RESET-APP' }

export type BudgetState = {
    budget: number
    modal: boolean
    expenses: Expense[]
    editingId: Expense['id']
}

const initialBudget = () : number => {
    const localStorageBudget = localStorage.getItem('budget')
    return localStorageBudget ? Number(localStorageBudget) : 0
}

const localStorageExpense = () : Expense[] => {
    const localStorageExpenses = localStorage.getItem('expenses')
    return localStorageExpenses ? JSON.parse(localStorageExpenses) : []
}

export const initialState : BudgetState = {
    budget: initialBudget(),
    modal: false,
    expenses: localStorageExpense(),
    editingId: ''
}

const createExpense = (draftExpense: DraftExpense) : Expense => {
    return {
        id: uuidv4(),
        ...draftExpense
    }
}

export const budgetReducer = (
        state: BudgetState = initialState, 
        action: BudgetAction
    ) => {
    
    if (action.type === 'ADD_BUDGET') {
        return {
            ...state,
            budget: action.payload.budget
        }
    }

    if (action.type === 'TOGGLE-MODAL') {
        return {
            ...state,
            modal: !state.modal,
            editingId: ''
        }
    }

    if (action.type === 'ADD_EXPENSE') {
        const expense = createExpense(action.payload.expense)
        return {
            ...state,
            expenses: [...state.expenses, expense],
            modal: false
        }
    }

    if (action.type === 'REMOVE_EXPENSE') {
        return {
            ...state,
            expenses: state.expenses.filter(expense => expense.id !== action.payload.id)
        }
    }

    if (action.type === 'EDIT_EXPENSE') {
        return {
            ...state,
            editingId: action.payload.id,
            modal: true
        }
    }

    if (action.type === 'UPDATE_EXPENSE') {
        return {
            ...state,
            expenses: state.expenses.map(expense => 
                expense.id === action.payload.expense.id ? action.payload.expense : expense
            ),
            modal: false,
            editingId: ''

        }
    }

    if (action.type === 'RESET-APP') {
        return {
            ...state,
            budget: 0,
            expenses: []
        }
    }

    return state
}