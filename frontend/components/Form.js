import React, { useEffect, useState } from 'react'
import * as yup from 'yup'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const allowedNumbers = [1, "1", 2, "2", 3, "3", 4, "4", 5, "5"]
const schema = yup.object().shape({
  fullName: yup
    .string()
    .required()
    .trim()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: yup
    .string()
    .required()
    .trim()
    .oneOf(["S", "M", "L"], validationErrors.sizeIncorrect),
  toppings: yup
    .array()
    .of(yup.number().oneOf(allowedNumbers))
})
// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

const initialValues = () => ({
  fullName: '',
  size: '',
  toppings: [1],
})

export default function Form() {
  const [values, setValues] = useState(initialValues())
  const [successMsg, setSuccessMsg] = useState('')
  const [failureMsg, setFailureMsg] = useState('')
  const [disabled, setIsDisabled] = useState(true)

  return (
    <form>
      <h2>Order Your Pizza</h2>
      {successMsg && <div className='success'>{successMsg}</div>}
      {failureMsg && <div className='failure'>{failureMsg}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" type="text" />
        </div>
        {true && <div className='error'>Bad value</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size">
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
          </select>
        </div>
        {true && <div className='error'>Bad value</div>}
      </div>

      <div className="input-group">
        { toppings.map(topping => {
          const { topping_id, text} = topping
          return (
            <label key={topping_id}>
              <input
                name={text}
                type="checkbox"
              />
              {text}<br />
            </label>
          )
        })}
      </div>
      <input type="submit" disabled={disabled}/>
    </form>
  )
}
