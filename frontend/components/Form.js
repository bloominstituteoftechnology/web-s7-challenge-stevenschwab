import React, { useEffect, useState } from 'react'
import * as yup from 'yup'

const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

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
  toppings: ['1'],
})

export default function Form() {
  const [values, setValues] = useState(initialValues())
  const [successMsg, setSuccessMsg] = useState('')
  const [failureMsg, setFailureMsg] = useState('')
  const [disabled, setIsDisabled] = useState(true)

  const onChange = (evt) => {
    console.log(evt.target)
    let { id, type, name, checked, value } = evt.target
    if (type === "checkbox") {
      if (checked) {
        value = [ ...values.toppings, id]
      } else {
        value = values.toppings.filter(topping => topping !== id)
      }
      name = 'toppings'
    }
    setValues({ ...values, [name]: value })
  }

  const onSubmit = (evt) => {
    evt.preventDefault()
  }

  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {successMsg && <div className='success'>{successMsg}</div>}
      {failureMsg && <div className='failure'>{failureMsg}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input value={values.fullName} onChange={onChange} name="fullName" placeholder="Type full name" id="fullName" type="text" />
        </div>
        {true && <div className='error'>Bad value</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select value={values.size} onChange={onChange} id="size" name="size">
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
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
                id={topping_id}
                name={text}
                type="checkbox"
                checked={values.toppings.indexOf(topping_id) !== -1}
                onChange={onChange}
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
