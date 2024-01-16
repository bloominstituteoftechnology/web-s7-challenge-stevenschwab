import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import axios from 'axios'

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
  toppings: [],
})

const initialErrors = () => ({
  fullName: '',
  size: ''
})

export default function Form() {
  const [values, setValues] = useState(initialValues())
  const [errors, setErrors] = useState(initialErrors())
  const [success, setSuccess] = useState()
  const [failure, setFailure] = useState()
  const [disabled, setIsDisabled] = useState(true)

  useEffect(() => {
    schema.isValid(values).then((isValid) => {
      setIsDisabled(!isValid)
    })
  }, [values])

  const validate = (name, value) => {
    yup
      .reach(schema, name)
      .validate(value)
      .then(() => {
        setErrors({ ...errors, [name]: "" })
      })
      .catch((err) => {
        setErrors({ ...errors, [name]: err.errors[0] })
      })
  }

  const onChange = (evt) => {
    let { id, type, name, checked, value } = evt.target
    if (type === "checkbox") {
      if (checked) {
        value = [ ...values.toppings, id]
      } else {
        value = values.toppings.filter(topping => topping !== id)
      }
      name = 'toppings'
    }
    validate(name, value)
    setValues({ ...values, [name]: value })
  }

  const onSubmit = (evt) => {
    evt.preventDefault()
    setIsDisabled(true)
    axios.post("http://localhost:9009/api/order", values)
      .then((res) => {
        setValues(initialValues())
        setSuccess(res.data.message)
        setFailure("")
      })
      .catch(err => {
        setFailure(err.response.data.message)
        setSuccess("")
      })
  }

  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {success && <div className='success'>{success}</div>}
      {failure && <div className='failure'>{failure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input value={values.fullName} onChange={onChange} name="fullName" placeholder="Type full name" id="fullName" type="text" />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
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
        {errors.size && <div className='error'>{errors.size}</div>}
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
