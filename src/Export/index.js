import React, { useEffect, useState } from "react";

import {
    SANITY_META_TYPES,
    screenTypes,
    CSV_TOOLS_DELIMETER,
} from "../constants.js";
import { download, schemeNames, csvFileFromObjects, makeClipboardCompatible, fieldsAndDataProcessed } from "../utils.js";
import schemas from "part:@sanity/base/schema";
import { client } from "../CSVTools.js";
import Layout from "../Layout.js";
import { useDocsData } from "../Context.js";

import { FieldName, FieldTypes, MetaTypes } from "./Fields";
import PreviewData from "./PreviewData.js";

import { Heading, Stack, Select, Button } from "@sanity/ui";
import { ArrowLeft, DownloadSimple } from "phosphor-react";
import {DataTable} from './PreviewData.js'

const Export = ({ handleScreenChange }) => {
    return <CSVExport />;
};

const CSVExport = () => {
    // function handleClick() {
    //     const query = `*[_type == '${doc}']`;
    //     client.fetch(query).then((data) => {
    //         csvFileFromObjects(data, selectedFields, metaTypes, doc);
    //     });
    // }

    function handleClick() {
        if (!!myData) {
            csvFileFromObjects(myData, selectedFields, metaTypes, doc, fields);
        }
    }

    function handleCopy(){
        navigator.clipboard.writeText(
            makeClipboardCompatible(fieldsAndDataProcessed(myData, selectedFields, metaTypes, fields)))
    }


    const [metaTypes, setMetaTypes] = useState(
        SANITY_META_TYPES.filter((thing) => thing.required).map(
            (item) => item.name
        )
    );
    const [doc, setDoc] = useState("");
    const [fields, setFields] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [myData, setMyData] = useState(null);
    const [allDocs, setAllDocsData] = useDocsData();

    function handleSelect(e) {
        setDoc(e.target.value);
    }

    useEffect(() => {
        setSelectedFields(fields);
    }, [fields.length]);

    useEffect(() => {
        setMyData(allDocs.find((thing) => thing.doc === doc)?.value);
    }, [allDocs, doc]);

    useEffect(() => {
        if (doc !== "") {
            setFields(
                schemas._original.types
                    .filter((item) => item.name === doc)[0]
                    .fields.map((item) => ({
                        name: item.name,
                        type: item.type,
                    }))
            );
        }
    }, [doc]);

    return (
        <>
            <Stack
                style={{
                    width: "100%",
                    justifySelf: "center",
                    paddingBottom: "4rem",
                }}
                space={3}
            >
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
                            style={{}}
                            icon={DownloadSimple}
                            onClick={handleClick}
                            text="Download as TSV"
                            tone="positive"
                            mode="ghost"
                            padding={4}
                            disabled={!myData}
                        />
                        <Button
                            style={{}}
                            icon={DownloadSimple}
                            onClick={handleCopy}
                            text="Copy to Clipboard"
                            tone="positive"
                            mode="ghost"
                            padding={4}
                            disabled={!myData}
                        />
                        <div style={{ height: "2rem" }}> </div>{" "}
                    </>
                ) : null}
                {doc ? (
                    <PreviewData
                        doc={doc}
                        selectedFields={selectedFields}
                        metaTypes={metaTypes}
                        allFields={fields}
                    />
                ) : null}
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
                padding={4}
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

export {DataTable}
export default Export;
