import { useEffect, useState } from "react";
import { categories } from "../data/categories";
import DatePicker from "react-date-picker";
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import type { DraftExpense, Value } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {

    const [expense, setExpense] = useState<DraftExpense>({
        expenseName: '',
        amount: 0,
        category: '',
        date: new Date()
    })

    const [error, setError] = useState<string>('');
    const { dispatch, state } = useBudget();

    useEffect(() => {
        if(state.editingId){
            const expenseToEdit = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
            setExpense(expenseToEdit);
        }
    },[state.editingId])

    const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isAmountField = ['amount'].includes(name);
        setExpense({
            ...expense,
            [name]: isAmountField ? Number(value) : value
        })
    }

    const handleChangeDate = (value : Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //Validar
        if(Object.values(expense).some(value => value === '')) {
            setError('Todos los campos son obligatorios');
            return;
        }
        //Agregar o Actualizar
        if(state.editingId) {
            dispatch({ type: 'UPDATE_EXPENSE', payload: {expense: {id: state.editingId, ...expense}} })
        } else {
            dispatch({ type: 'ADD_EXPENSE', payload: { expense } })
        }
        //Resetear
        setExpense({
            expenseName: '',
            amount: 0,
            category: '',
            date: new Date()
        })
    }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
        <legend
            className="uppercase text-2xl font-black text-center border-b-4 border-blue-500 py-2"
        >
            {state.editingId ? 'Actualizar Gasto' : 'Nuevo Gasto'}
        </legend>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="flex flex-col gap-2">
            <label htmlFor="expenseName" className="text-xl">
                Nombre Gasto:
            </label>
            <input 
                type="text"
                id="expenseName"
                placeholder="Añade el nombre del gasto"
                className="bg-slate-200 p-2"
                name="expenseName"
                value={expense.expenseName}
                onChange={handleChange}
            />
        </div>
        <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="text-xl">
                Cantidad:
            </label>
            <input 
                type="number"
                id="amount"
                placeholder="Añade la cantidad del gasto ej. 300"
                className="bg-slate-200 p-2"
                name="amount"
                value={expense.amount}
                onChange={handleChange}
            />
        </div>
        <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-xl">
                Categoria:
            </label>
            <select
                id="category"
                className="bg-slate-200 p-2"
                name="category"
                value={expense.category}
                onChange={handleChange}
            >
                <option value="">-- Seleccione --</option>
                {categories.map(category => (
                    <option 
                        value={category.id}
                        key={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
        <div className="flex flex-col gap-2">
            <label htmlFor="date" className="text-xl">
                Fecha de Gasto:
            </label>
            <DatePicker
                className="bg-slate-200 border-0"
                value={expense.date}
                onChange={handleChangeDate}
            />
        </div>
        <input 
            type="submit" 
            className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
            value={state.editingId ? 'Actualizar Gasto' : 'Agregar Gasto'}
        />
    </form>
  )
}
