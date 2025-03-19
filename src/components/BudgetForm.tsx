import { useMemo, useState } from "react"
import { useBudget } from "../hooks/useBudget"

export default function BudgetForm() {

    const [budget, setBudget] = useState(0)
    const { dispatch } = useBudget()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBudget(+e.target.value)
    }

    const isValid = useMemo(() => {
        return isNaN(budget) || budget <= 0
    }, [budget])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch({ type: 'ADD_BUDGET', payload: { budget } })
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-5">
                <label htmlFor="budget" className="text-4xl text-blue-600 text-center font-bold">
                    Definir Presupuesto
                </label>
                <input 
                    type="number"
                    className="w-full bg-white border border-gray-200 p-2"
                    placeholder="Define tu presupuesto"
                    name="budget"
                    value={budget}
                    onChange={handleChange}
                    onFocus={(e) => e.target.select()}
                />    
            </div>
            <input
                type="submit"
                value='Definir Presupuesto'
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer p-2 text-white uppercase font-black w-full disabled:opacity-50"
                disabled={isValid}
            />
        </form>
    )
}
