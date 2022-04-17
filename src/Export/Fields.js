import React from "react";
import { SANITY_META_TYPES, ACCEPTED_TYPES } from "../constants.js";

import { Grid, Card, Checkbox, Text, Inline } from "@sanity/ui";

export const MetaTypes = ({ metaTypes, setMetaTypes }) => {
  function handleChange(e) {
    e.persist();
    const metaName = e.target.getAttribute("name");
    setMetaTypes((metaTypes) =>
      metaTypes.includes(metaName)
        ? metaTypes.filter(
            (item) =>
              item !== metaName ||
              SANITY_META_TYPES.filter((thing) => thing.name === metaName)[0]
                .reqiured
          )
        : [...metaTypes, metaName]
    );
  }

  return (
    <Inline space="3">
      {SANITY_META_TYPES.map((item) => (
        <span key={item.name}>
          <Checkbox
            padding={5}
            name={item.name}
            id={item.name}
            type="checkbox"
            checked={metaTypes.includes(item.name)}
            onChange={handleChange}
            style = {{opacity: item.reqiured? "0.4": "1"}}
          />
          <label htmlFor={item.name}>{item.name}</label>
        </span>
      ))}
    </Inline>
  );
};

export const FieldTypes = ({
  doc,
  fields,
  selectedFields,
  setSelectedFields,
}) => {
  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #ddd",
        borderTop: "0px",
        background: "#f9f9f9",
        marginBottom: "1rem",
        textAlign: "left",
      }}
    >
      <Grid
        marginBottom={2}
        gap={2}
        background="#ddd"
        style={{ gridTemplateColumns: "1fr 30%" }}
      >
        <Card style={{ background: "transparent" }} padding={3}>
          <Text weight="semibold">Name</Text>
        </Card>
        <Card style={{ background: "transparent" }} padding={3}>
          <Text weight="semibold">Type</Text>
        </Card>
      </Grid>
      {fields.map((item) => (
        <FieldName
          key={item.name}
          data={item}
          setSelectedFields={setSelectedFields}
          selectedFields={selectedFields}
        />
      ))}
    </div>
  );
};

export const FieldName = ({
  data: { name, type },
  selectedFields,
  setSelectedFields,
}) => {
  function handleChange() {
    setSelectedFields((fields) =>
      fields.map((thing) => thing.name).includes(name)
        ? fields.filter((thing) => thing.name !== name)
        : [...fields, { name, type }]
    );
  }
  return (
    <Grid
      style={{ borderTop: "1px solid #ddd", gridTemplateColumns: "1fr 30%" }}
      gap={3}
      paddingBottom={2}
      paddingTop={2}
    >
      <Card style={{ background: "transparent" }} padding={3}>
        <Checkbox
          name={name}
          id={name}
          checked={ACCEPTED_TYPES.includes(type) ? selectedFields.map((thing) => thing.name).includes(name) : false}
          style={{ opacity: ACCEPTED_TYPES.includes(type) ? "1" : "0.4"}}
          type="checkbox"
          onChange={handleChange}
        />
        <label style={{ paddingLeft: "20px" }} htmlFor={name}>
          {name}
        </label>
      </Card>
      <Card style={{ background: "transparent" }} padding={3}>
        <Text htmlFor={name}>{type}</Text>
      </Card>
    </Grid>
  );
};
