import axios from "axios";
import React, { useState, useEffect } from "react";
import "./styles.css";
import styled from "styled-components";
import { BaseURL, apiKey } from "./secret";
let offsetT = 0;
let offsetS = 0;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  overflow-y: scroll;
  height: 70vh;
  margin-top: 1%;
`;

const VideoParent = styled.div`
  width: 15vw;
  height: 25vh;
  margin: 1%;
  background: grey;
`;
const Loading = styled(VideoParent)`
  background: white;
  height: auto;
`;
const Header = styled.div`
  background: gold;
  padding: 1%;
`;
const Input = styled.input`
  width: 80vw;
  padding: 1%;
`;
const Button = styled.button`
  width: auto;
  padding: 1%;
`;
export default function App() {
  const [data, setData] = useState(null);
  const [noresults, setNoresults] = useState(false);
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  function isBottom(element) {
    return (
      Math.ceil(element.scrollHeight - element.scrollTop) ===
      element.clientHeight
    );
  }
  function trackScrolling() {
    const wrappedElement = document.getElementById("myCon");
    setLoading(true);
    if (isBottom(wrappedElement)) {
      let url;
      setSearchTerm((searchTerm) => {
        if (searchTerm.length !== 0) {
          offsetS = offsetS + 1;
          url = `${BaseURL}search?${apiKey}&offset=${offsetS}&q=${searchTerm}`;
        } else {
          offsetT = offsetT + 1;
          url = `${BaseURL}trending?${apiKey}&offset=${offsetT}`;
        }
        return searchTerm;
      });

      axios
        .get(url)
        .then((response) => {
          setLoading(false);
          setData((data) => {
            return [...data, ...response.data.data];
            /* This line is to get unique GIFs
            [
              ...new Set([...data, ...response.data.data].map((x) => x.id))
            ].map(
              (x) =>
                [...data, ...response.data.data].filter((y) => y.id === x)[0]
            );*/
          });
        })
        .catch((error) => {});
    }
  }
  useEffect(() => {
    document.getElementById("myCon").addEventListener("scroll", trackScrolling);
    axios
      .get(`${BaseURL}trending?${apiKey}&offset=0`)
      .then((response) => {
        setData(response.data.data);
        if (response.data.data.length === 0) {
          setNoresults(true);
          setData([]);
        }
      })
      .catch((error) => {});
  }, []);

  function onSearch(e) {
    e.preventDefault();
    setSearch(true);
    setData([]);
    const url = searchTerm.length
      ? `${BaseURL}search?${apiKey}&offset=0&q=${searchTerm}`
      : `${BaseURL}trending?${apiKey}&offset=0`;
    return axios
      .get(url)
      .then((response) => {
        setSearch(false);
        setData(response.data.data);
        if (response.data.data.length === 0) {
          setNoresults(true);
          setData([]);
        } else {
          setNoresults(false);
        }
      })
      .catch((error) => {});
  }
  return (
    <div className="App">
      <Header>
        <h1>GIF Gallery</h1>
        <form onSubmit={(e) => onSearch(e)}>
          <Input
            placeholder="Search for GIF's"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" onClick={(e) => onSearch(e)} visible="false">
            Search
          </Button>
        </form>
      </Header>
      <Container id="myCon">
        {data && data.length ? (
          data
            .sort(
              (a, b) =>
                +a.images.downsized_small.size - +b.images.downsized_small.size
            )
            .map((row, i) => (
              <VideoParent key={i}>
                <video
                  className="videoInsert"
                  key={i}
                  loop={true}
                  autoPlay
                  muted
                >
                  <source
                    src={row.images.downsized_small.mp4}
                    type="video/mp4"
                  ></source>
                </video>
              </VideoParent>
            ))
        ) : search ? (
          <div>
            <video loop={true} autoPlay muted>
              <source
                src="https://media0.giphy.com/media/12zV7u6Bh0vHpu/giphy-downsized-small.mp4?cid=c98fd5dbz083q8ylchc7de5z1glp9w3s7phl0zpqb5n7d34n&rid=giphy-downsized-small.mp4"
                type="video/mp4"
              ></source>
            </video>
          </div>
        ) : noresults ? (
          <div>
            <video loop={true} height="50%" autoPlay muted>
              <source
                src="https://media1.giphy.com/media/l3q30VK7ItN9a3Zg4/giphy-downsized-small.mp4?cid=c98fd5dbj5ja9a8c6vty0mhnjji0e1jjqjzvbn9jgg5jwzf3&rid=giphy-downsized-small.mp4"
                type="video/mp4"
              ></source>
            </video>
          </div>
        ) : (
          <div>
            <video loop={true} height="50%" autoPlay muted>
              <source
                src="https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy-downsized-small.mp4?cid=c98fd5db2nqksj09ivqiyywd2y0xxb6ns8xotd3ib1fvtbf6&rid=giphy-downsized-small.mp4"
                type="video/mp4"
              ></source>
            </video>
          </div>
        )}
        {loading && data.length !== 0 ? <Loading>Loading....</Loading> : ""}
      </Container>
    </div>
  );
}
