import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useDocsData } from "../Context.js";
import { client } from "../CSVTools.js";
import { fieldsAndDataProcessed } from "../utils.js";
import { Container, Card, Grid, Flex, Stack, Inline, Button } from "@sanity/ui";

export default function PreviewData({ doc, selectedFields, metaTypes, allFields }) {
  const [allDocs, setAllDocsData] = useDocsData();
  const [isAvailable, setIsAvailable] = useState(false);

  function callBackOnSuccess(data) {
    setIsAvailable(true);
    setAllDocsData({ doc: doc, value: data });
  }

  function callBackOnFailure(err) {
    console.log("error occured");
    console.log(err);
  }

  function getMyData() {
    const value = allDocs.find((thing) => thing.doc === doc)?.value;
    return !!value
      ? fieldsAndDataProcessed(value, selectedFields, metaTypes, allFields)
      : null;
  }

  // Check if we have the currently selected doc data!
  useEffect(() => {
    setIsAvailable(!!allDocs.find((thing) => thing.doc === doc));
  }, [doc]);

  // Fetch the currently selected doc data!
  useEffect(() => {
    if (!isAvailable) {
      fetchData(doc, callBackOnSuccess, callBackOnFailure);
    }
  }, [isAvailable]);

  return ReactDOM.createPortal(
    <div>
      {!isAvailable ? <Loading /> : null}
      {!!isAvailable ? <DataTable data={getMyData() || []} /> : null}
    </div>,
    document.getElementById("spreadsheet")
  );
}

const Loading = () => <p>...loading </p>;

const DataTable = ({ data }) => (
  <Grid
    id="spreadsheet-table"
    style={{
      cursor: "cell",
      display: "grid",
      width: "max-content",
    }}
  >
    {data?.length > 0 && (
      <Grid
        id="spreadsheet-head"
        autoFlow="column dense"
        style={{ display: "grid", gap: "1px" }}
      >
        <Grid
          style={{
            justifyContent: "start",
            dioverflowX: "scroll",
            display: "grid",
            gap: "1px",
          }}
          autoFlow="column dense"
        >
          {data[0].map((thing, index) => (
            <div
              style={{
                maxHeight: "25px",
                display: "grid",
                padding: "15px",
                overflowX: "hidden",
                overflowY: "hidden",
                background: "#ddd",
              }}
              key={thing + '' + index}
            >
              <div
                style={{ display: "grid", width: "120px", maxWidth: "120px" }}
              >
                {thing}
              </div>
            </div>
          ))}
        </Grid>
      </Grid>
    )}
    {data.length > 1 && (
      <Grid autoFlow="row dense" style={{ display: "grid", gap: "1px" }}>
        {data.slice(1).map((row, index) => (
          <Grid
            key={index}
            style={{ justifyContent: "start", gap: "1px" }}
            autoFlow="column dense"
          >
            {row.map((item, index) => (
              <div
                style={{
                  maxHeight: "25px",
                  display: "grid",
                  padding: "15px",
                  overflowX: "hidden",
                  overflowY: "hidden",
                  background: "#eee",
                }}
                key={'' + item + index}
              >
                <div
                  style={{ display: "grid", width: "120px", maxWidth: "120px" }}
                >
                  {item}
                </div>
              </div>
            ))}
          </Grid>
        ))}
      </Grid>
    )}
  </Grid>
);

function fetchData(doc, callBackOnSuccess, callBackOnFailure) {
  const query = `*[_type == '${doc}']`;
  return client
    .fetch(query)
    .then((data) => callBackOnSuccess(data))
    .catch((err) => callBackOnFailure(err));
}
