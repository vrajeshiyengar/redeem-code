import { useState, useEffect } from "react";
import couponSVG from './assets/img/coupon.svg';
import resetSVG from './assets/img/recycle.svg';
import codeMap from "./assets/json/codes.json";
import STATIC from "./assets/json/static_text.json";
import './App.scss';



const Coupon = ({ code }) => {
  return (
    <div className="coupon-container newly-added">
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
    codes.filter(x => codeMap.hasOwnProperty(x)).map(x => <Coupon key={x} code={x} />)
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
      alert(STATIC.NO_CODE)
    } else {
      if (!codeMap.hasOwnProperty(enteredCode)) {
        alert(STATIC.INVALID_CODE)
      }
      else if (unlockedCodes.includes(enteredCode)) {
        alert(STATIC.DUPLICATE_CODE)
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
          <span className="redeem-text title">{STATIC.PAGE_TITLE}</span>
          <span className="redeem-text subtitle">{STATIC.PAGE_SUBTITLE}</span>
          <span className="reset-button" onClick={()=>{
              if (window.confirm(STATIC.CONFIRM_RESET)) {
                setUnlockedCodes([]);
              }
            }}>
            <img src={resetSVG} alt="reset" className="reset"/>
            <span className="hide-sm">{STATIC.RESET_BUTTON}</span>
          </span>
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
