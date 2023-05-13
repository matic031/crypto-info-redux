import React, { useState, useEffect } from "react";
import millify from "millify";
import { Link } from "react-router-dom";
import { Card, Row, Col, Input } from "antd";

import { useGetCryptosQuery } from "../services/cryptoApi";
import Loader from "./Loader";

function Cryptocurrencies({ simplified }) {
  const count = simplified ? 10 : 100;
  const { data: cryptosList, isFetching } = useGetCryptosQuery(count);
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setCryptos(cryptosList?.data?.coins);

    const filteredData = cryptosList?.data?.coins.filter((coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setCryptos(filteredData);
  }, [cryptosList, searchTerm]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fetch updated data every 10 seconds
      setCryptos(cryptosList?.data?.coins);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [cryptosList]);

  if (isFetching) return <Loader />;

  return (
    <>
      {!simplified && (
        <div className="search-crypto">
          <Input
            placeholder="Search Cryptocurrency"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <Row gutter={[32, 32]} className="crypto-card-container">
        {cryptos?.map((currency) => {
          const changeValue = parseFloat(currency.change);
          const dailyChange = !isNaN(changeValue)
            ? changeValue.toFixed(2)
            : "N/A";
          const changeSign = Math.sign(changeValue);

          const shouldMillifyPrice = currency.uuid !== "xz24e0BjL"; // special case for Shiba Inu

          return (
            <Col
              xs={24}
              sm={12}
              lg={6}
              className="crypto-card"
              key={currency.uuid}
            >
              <Link key={currency.uuid} to={`/crypto/${currency.uuid}`}>
                <Card
                  title={`${currency.rank}. ${currency.name}`}
                  extra={
                    <img
                      className="crypto-image"
                      src={currency.iconUrl}
                      alt="icon"
                    />
                  }
                  hoverable
                >
                  <p className="animated-number">
                    Price:{" "}
                    {shouldMillifyPrice
                      ? millify(currency.price, { precision: 3 })
                      : currency.price}
                  </p>
                  <p className="animated-number">
                    Market Cap: {millify(currency.marketCap, { precision: 3 })}
                  </p>
                  <p className="animated-number">
                    Daily Change:{" "}
                    <span
                      className={
                        changeSign < 0 ? "negative-change" : "positive-change"
                      }
                    >
                      <b>{dailyChange}%</b>
                    </span>
                  </p>
                </Card>
              </Link>
            </Col>
          );
        })}
      </Row>
    </>
  );
}

export default Cryptocurrencies;
