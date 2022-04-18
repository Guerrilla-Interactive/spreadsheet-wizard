import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
    screenTypes,
    CSV_TOOLS_DELIMETER,
    ACCEPTED_TYPES,
    SANITY_META_TYPES,
} from "./constants.js";
import { fieldsAndDataProcessed } from "./utils.js";
import Layout from "./Layout.js";
import { client } from "./CSVTools.js";
import { Heading, Stack, Select, Button } from "@sanity/ui";
import { UploadSimple } from "phosphor-react";
import { DataTable } from "./Export";

const Import = ({ handleScreenChange }) => {
    return (
        <Stack
            style={{
                width: "100%",
                justifySelf: "center",
                paddingBottom: "4rem",
            }}
            space={3}
        >
            <p style={{ marginBlockStart: "0" }}>
                Imports are supported by file that look like the ones we export,
                so you might want to see that first!{" "}
            </p>
            <ImportForm />
        </Stack>
    );
};

function uploadToSanity(arrayOfObjects, setProcessing, setError, setSuccess) {
    // Remove empty lines & objects without ids
    // arrayOfObjects = arrayOfObjects.filter((item) => !!item._id);
    setProcessing("...uploading...");
    let numberOfSuccesses = 0;
    setSuccess("");
    setError("");
    return Promise.all(
        arrayOfObjects.map((object) => {
            return client
                .patch(object._id)
                .set(object)
                .commit()
                .then((t) => (numberOfSuccesses += 1))
                .catch((e) => {
                    // If ID is specified, and got document not found
                    if (object._id) {
                        client
                            .createIfNotExists(object)
                            .then((t) => (numberOfSuccesses += 1))
                            .catch((e) => {
                                console.log(
                                    "if you are trying to create new docs by specifying ids manually, make sure you are providing type as well"
                                );
                                console.log(e);
                            });
                    } else {
                        console.log(
                            "id not provided for the documenet",
                            object
                        );
                    }
                });
        })
    )
        .then((msg) => {
            setSuccess(
                `${numberOfSuccesses} docs added/modified! ${
                    arrayOfObjects.length > numberOfSuccesses
                        ? " Failed" +
                          (arrayOfObjects.length - numberOfSuccesses) +
                          " modifications, check console"
                        : ""
                }`
            );
            setProcessing("");
            console.log(msg);
        })
        .catch((err) => {
            setError("error, check console for details");
            console.log(err);
            console.log(arrayOfObjects);
            setProcessing("");
        });
}

function processCSVLines(linesOfStrings, onSuccess, onFail) {
    linesOfStrings = linesOfStrings.map((thing) =>
        thing.replace("\r", "").replace("\n", "").replace("\r\n", "")
    );
    const heading = linesOfStrings[0].split(CSV_TOOLS_DELIMETER);
    function makeObject(index, myValue) {
        const thing = ACCEPTED_TYPES.find((x) => x.name === heading[index]);
        if (thing?.query) {
            const { value, ...other } = {
                ...thing.structure,
                [thing.structure.value.name]: myValue,
            };
            return { [thing.name]: other };
        } else {
            return { [heading[index]]: myValue };
        }
    }
    // Check if heading contains ID
    if (heading.includes("_id")) {
        onSuccess(
            linesOfStrings.slice(1).map((item) => {
                const thing = item.split(CSV_TOOLS_DELIMETER);
                return thing.reduce(
                    (prev, current, index) => ({
                        ...prev,
                        ...makeObject(index, current),
                    }),
                    {}
                );
            })
        );
    } else {
        onFail("_id not provided!");
    }
}

const ImportForm = () => {
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState("");
    const [success, setSuccess] = useState("");
    const [myData, setMyData] = useState(null);

    function readFromInputFile(onRead) {
        const file = document.querySelector("#csvFile").files[0];
        const reader = new FileReader();
        reader.onload = (e) => onRead(e);
        reader.readAsText(file, "utf-8");
    }

    function handleFile(e) {
        if (e.target.value) {
            readFromInputFile((e) =>
                processCSVLines(
                    e.target.result.split("\n"),
                    (data) => setMyData(processAndSetMyData(data)),
                    setError
                )
            );
        }
    }
    function upload(data) {
        uploadToSanity(data, setProcessing, setError, setSuccess);
    }
    function processAndSetMyData(data) {
        const metaTypes = SANITY_META_TYPES.filter(
            (thing) => thing.required
        ).map((x) => x.name);
        const allHeadings = data
            .reduce((prev, curr) => [...prev, ...Object.keys(curr)], [])
            .filter(x => !metaTypes.includes(x))
            .reduce((prev, curr) => prev.includes(curr) ? prev : [...prev, curr], [])
        const headingsWithTypes = allHeadings.map(x => ({name: x, type: 'string'}))
        return fieldsAndDataProcessed(
            data,
            headingsWithTypes,
            metaTypes,
            headingsWithTypes
        );
    }

    async function handlePaste() {
        const text = await navigator.clipboard
            .readText()
            .then((data) => data?.split("\n"));
        if (text) {
            processCSVLines(
                text,
                (data) => setMyData(processAndSetMyData(data)),
                setError
            );
        }
    }
    function handleUpload(e) {
        // handleUpload
        if (myData) {
            upload(myData);
        } else {
            setError("No Data");
        }
    }
    return (
        <>
            <form>
                {error ? <p> Error: {error} </p> : null}
                {processing ? <p> {processing} </p> : null}
                {success ? <p> {success} </p> : null}
                <div></div>
                <div style={{ width: "100%", background: "#eee" }}>
                    <input
                        style={{ width: "100%", padding: "20px" }}
                        required={true}
                        id="csvFile"
                        name="file"
                        type="file"
                        accept=".tsv"
                        onChange={handleFile}
                    />
                </div>
                <Button
                    style={{ marginTop: "1.5rem", width: "100%" }}
                    icon={UploadSimple}
                    onClick={handleUpload}
                    text="Import '.tsv' file"
                    tone="positive"
                    mode="ghost"
                    disabled={!myData}
                    padding={4}
                />
                <Button
                    style={{ marginTop: "1.5rem", width: "100%" }}
                    icon={UploadSimple}
                    text="Pate from clipboard"
                    tone="positive"
                    mode="ghost"
                    onClick={handlePaste}
                    padding={4}
                />
                <DataTableWrapper data={myData} />
            </form>
        </>
    );
};
const DataTableWrapper = ({ data }) => {
    return ReactDOM.createPortal(
        <div>{data ? <DataTable data={data} /> : null}</div>,
        document.getElementById("spreadsheet")
    );
};
export default Import;
