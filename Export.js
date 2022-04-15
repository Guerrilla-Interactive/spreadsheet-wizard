import React, { useEffect, useState } from "react";
import {
  SANITY_META_TYPES,
  screenTypes,
  ACCEPTED_TYPES,
  CSV_TOOLS_DELIMETER,
} from "./constants.js";
import { download, schemeNames, csvFileFromObjects } from "./utils.js";
import schemas from "../../schemas/schema.js";
import { client } from "./CSVTools.js";
import Layout from "./Layout.js";
import PreviewData from './PreviewData.js'

import {
  Heading,
  Stack,
  Grid,
  Card,
  Checkbox,
  Text,
  Flex,
  Inline,
  Select,
  Button,
} from "@sanity/ui";
import { ArrowLeft, DownloadSimple } from "phosphor-react";

const Export = ({ handleScreenChange }) => {
  return (
    <Layout align="start">
      <Button
        icon={ArrowLeft}
        onClick={() => handleScreenChange(screenTypes.BEGIN)}
        fontSize={2}
        padding={4}
        style={{ width: "max-content", fontWeight: "100", alignSelf: "start" }}
        mode="ghost"
      />
      <CSVExport />
    </Layout>
  );
};

const CSVExport = () => {
  function handleClick() {
    const query = `*[_type == '${doc}']`;
    client.fetch(query).then((data) => {
      csvFileFromObjects(data, selectedFields, metaTypes, doc);
    });
  }
  const [metaTypes, setMetaTypes] = useState(
    SANITY_META_TYPES.filter((thing) => thing.reqiured).map((item) => item.name)
  );
  const [doc, setDoc] = useState("");
  const [fields, setFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  function handleSelect(e) {
    setDoc(e.target.value);
  }
  useEffect(() => {
    setSelectedFields(fields);
  }, [fields.length]);
  useEffect(() => {
    if (doc !== "") {
      setFields(
        schemas._original.types
          .filter((item) => item.name === doc)[0]
          .fields.map((item) => ({ name: item.name, type: item.type }))
      );
    }
  }, [doc]);

  return (
    <>
      <Stack
        style={{ width: "400px", justifySelf: "center", paddingBottom: "4rem" }}
        space={3}
      >
        <Heading
          as="h3"
          style={{ fontWeight: "200", marginBottom: "1rem" }}
          size={3}
        >
          Export documents based on type
        </Heading>
        <ChooseDocument
          doc={doc}
          setDoc={setDoc}
          handleSelect={handleSelect}
          fields={fields}
          setFields={setFields}
          metaTypes={metaTypes}
          setMetaTypes={setMetaTypes}
          selectedFields={selectedFields}
          setSelectedFields={setSelectedFields}
        />
        {doc ? (
          <>
            <Button
              style={{ marginTop: "1.5rem" }}
              icon={DownloadSimple}
              onClick={handleClick}
              text="Download as TSV"
              fontSize={1}
              mode="ghost"
              padding={4}
            />
            <div style={{ height: "2rem" }}> </div>{" "}
          </>
        ) : null}
        { doc ? <PreviewData 
            doc={doc} 
            selectedFields={selectedFields} 
            metaTypes={metaTypes}/> : null }
      </Stack>
    </>
  );
};

const ChooseDocument = ({
  doc,
  setDoc,
  handleSelect,
  fields,
  setFields,
  metaTypes,
  setMetaTypes,
  selectedFields,
  setSelectedFields,
}) => {
  const allSchemas = schemeNames(schemas);
  return (
    <form action="">
      <Select
        value={doc}
        onChange={handleSelect}
        id="documentType"
        name="documentType"
      >
        <option value="">Select document type</option>
        {allSchemas.map((thing) => (
          <option key={thing} value={thing}>
            {thing}
          </option>
        ))}
      </Select>
      {doc ? (
        <FieldTypes
          selectedFields={selectedFields}
          setSelectedFields={setSelectedFields}
          doc={doc}
          fields={fields}
        />
      ) : null}
      {doc ? (
        <MetaTypes metaTypes={metaTypes} setMetaTypes={setMetaTypes} />
      ) : null}
    </form>
  );
};

const MetaTypes = ({ metaTypes, setMetaTypes }) => {
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
            name={item.name}
            id={item.name}
            type="checkbox"
            checked={metaTypes.includes(item.name)}
            onChange={handleChange}
          />
          <label htmlFor={item.name}>{item.name}</label>
        </span>
      ))}
    </Inline>
  );
};

const FieldTypes = ({ doc, fields, selectedFields, setSelectedFields }) => {
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
      <Grid marginBottom={2} gap={2} background="#ddd" columns={[2]}>
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

const FieldName = ({
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
      style={{ borderTop: "1px solid #ddd" }}
      gap={3}
      paddingBottom={2}
      paddingTop={2}
      columns={[2]}
    >
      <Card style={{ background: "transparent" }} padding={3}>
        <Checkbox
          name={name}
          id={name}
          checked={selectedFields.map((thing) => thing.name).includes(name)}
          type="checkbox"
          onChange={handleChange}
        />
        <label htmlFor={name}>{name}</label>
      </Card>
      <Card style={{ background: "transparent" }} padding={3}>
        <Text>{type}</Text>
      </Card>
    </Grid>
  );
};

export default Export;
