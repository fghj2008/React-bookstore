import "./styles.css";
import { data } from "./data.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import update from "immutability-helper";
import ClassName from "classnames";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// 拆分組件
function Book({ item, remove, displayMode }) {
  return (
    <div className={`book col-${displayMode ? 6 : 4}`}>
      <img className="w-100" src={item.img} alt={item.name} />
      <h3>{item.name}</h3>
      <h4>{item.is_discount ? "打折中" : ""}</h4>
      {item.is_discount && (
        <h4>
          優惠價{item.discount * 100}折 : {parseInt(item.price * item.discount)}
          元
        </h4>
      )}
      {!item.is_discount && <h4>原價: {item.price}</h4>}
      <button onClick={remove}>Remove</button>
    </div>
  );
}

export default function App() {
  const [rawdata, setdata] = useState(data);
  const [filterData, setFilterData] = useState([]);
  const [keyword, setkeyword] = useState("");
  const [displayMode, setDisplayMode] = useState(false);

  useEffect(() => {
    setFilterData(
      rawdata.filter((book) =>
        book.name.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }, [keyword, rawdata]);
  return (
    <div className="App">
      <Container>
        <h1 className="my-5">Bookstore</h1>
        <h2>bookstore shop list</h2>
        {keyword && <h3>Search result of: {keyword}</h3>}
        <input
          type="text"
          value={keyword}
          onChange={(e) => setkeyword(e.target.value)}
        />
        <div>
          <label>
            Display Mode:
            <input
              type="checkbox"
              value={displayMode}
              onChange={() => {
                setDisplayMode(!displayMode);
              }}
            />
          </label>
        </div>
        {rawdata.map((item, itemId) => (
          <span>
            <label className="mx-1">
              {itemId}
              <input
                type="checkbox"
                key={itemId}
                checked={item.is_discount}
                onChange={(e) => {
                  setdata(
                    update(rawdata, {
                      [itemId]: {
                        $toggle: ["is_discount"]
                      }
                    })
                  );
                }}
              />
            </label>
          </span>
        ))}
        <Row>
          {filterData.map((item) => (
            <Book
              item={item}
              key={item.name}
              displayMode={displayMode}
              remove={() => {
                let index = rawdata.findIndex((book) => book.name == item.name);
                setdata(
                  update(rawdata, {
                    $splice: [[index, 1]]
                  })
                );
              }}
            ></Book>
          ))}
        </Row>
      </Container>
    </div>
  );
}
