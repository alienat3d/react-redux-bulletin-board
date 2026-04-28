import {useSelector, useDispatch} from "react-redux";
import {
  increment,
  decrement,
  reset,
  incrementByAmount,
  decrementByAmount,
  multiplyByAmount,
  divideByAmount,
} from './counterSlice';
import {useState} from "react";

const Counter = () => {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);

  const addNumber = Number(amount) || 0;

  // Function that resets the counter to 0 and the input as well.
  const resetAll = () => {
    setAmount(0);
    dispatch(reset());
  }

  return (
    <section>
      <p>{count}</p>
      <div>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>
      </div>

      <input
        type="text"
        name="counter"
        value={amount}
        onChange={(evt) => setAmount(Number(evt.target.value))}
      />

      <div className="buttons-group">
        <button onClick={() => dispatch(incrementByAmount(addNumber))}>Add Amount</button>
        <button onClick={() => dispatch(decrementByAmount(addNumber))}>Detract Amount</button>
        <button onClick={() => dispatch(multiplyByAmount(addNumber))}>Multiply Amount</button>
        <button onClick={() => {
          (addNumber !== 0) ? dispatch(divideByAmount(addNumber)) : alert("Please enter a non-zero number to divide.")
        }}>
          Divide Amount
        </button>
        <button onClick={resetAll}>Reset</button>
      </div>
    </section>
  )
}

export default Counter;