import './App.scss';
import couponSVG from './assets/coupon.svg';
import resetSVG from './assets/recycle.svg';
import { useState, useEffect } from "react";
import codeMap from "./assets/codes.json"



const Coupon = ({ code }) => {
  return (
    <div className="coupon-container">
      <div className="code">{code}</div>
      <div className="gift">{codeMap[code]}</div>
    </div>
  )
}

const Coupons = ({ codes }) => {
  if (codes.length === 0) {
    return <></>
  }
  return <div className="coupons">{
    codes.filter(x => codeMap.hasOwnProperty(x)).map(x => <Coupon code={x} />)
  }</div>
}

const App = () => {

  const fetchFromLocalStorage = () => {
    try {
      if (window.localStorage.getItem("unlockedCodes") && JSON.parse(window.localStorage.getItem("unlockedCodes"))) {
        return JSON.parse(window.localStorage.getItem("unlockedCodes"));
      }
      return [];
    } catch (err) {
      if (typeof window.localStorage.getItem("unlockedCodes") === "string" && window.localStorage.getItem("unlockedCodes").includes(",")) {
        return window.localStorage.getItem("unlockedCodes").split(",");
      }
      return [];
    }
  }


  const [unlockedCodes, setUnlockedCodes] = useState(fetchFromLocalStorage());
  const [enteredCode, setEnteredCode] = useState("");

  useEffect(() => {
    setEnteredCode("");
    window.localStorage.setItem("unlockedCodes",JSON.stringify(unlockedCodes))
  }, [unlockedCodes])

  const transformCode = str => str.replace(/[\W_]/g, "").toUpperCase();

  const handleCodeChange = newCode => {
    setEnteredCode(transformCode(newCode));
  }

  const handleSubmit = () => {
    if (!enteredCode) {
      alert("please enter a code")
    } else {
      if (!codeMap.hasOwnProperty(enteredCode)) {
        alert("The code you entered is invalid :( please try again!")
      }
      else if (unlockedCodes.includes(enteredCode)) {
        alert("This code has already been redeemed!")
      }
      else {
        setUnlockedCodes([...new Set([enteredCode,...unlockedCodes])])
      }
    }
  }

  return (
    <div className="app">
      <header className="app-body">
        <div className="redeem-title">
          <span className="redeem-text">Hello :D</span>
          <span className="reset-button" onClick={()=>{
              setUnlockedCodes([]);
            }}>
            <img src={resetSVG} alt="reset" className="reset"/>
            <span className="hide-sm">Reset coupons</span>
          </span>
          <span className="redeem-text">Enter your code to reveal the gift number!</span>
          <img src={couponSVG} alt="coupon" className="coupon" />
          <div className="responsive-flex">
            <input
              value={enteredCode}
              className="enter-code"
              onChange={e => { handleCodeChange(e.target.value) }}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <button type="submit" className="submit-code" onClick={() => { handleSubmit(); }}>
              Submit
            </button>
          </div>
          <Coupons codes={unlockedCodes} />
        </div>

      </header>
    </div>
  );
}

export default App;
