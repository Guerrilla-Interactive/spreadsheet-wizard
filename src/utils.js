import {
    SANITY_META_TYPES,
    screenTypes,
    ACCEPTED_TYPES,
    CSV_TOOLS_DELIMETER,
} from "./constants.js";

//
// Taken from stackOverflow
// stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript/
//
export function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) {
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
        console.log("a. file created!");
    } else {
        // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
        console.log("b. file created!");
    }
}

export function schemeNames(schemas) {
    return schemas._original.types
        .filter((item) => item.type === "document")
        .map((item) => item.name);
}

function headingsSorted(metaTypes, fields, allFields) {
    const SANITY_META_TYPES_NAMES = SANITY_META_TYPES.map(
        (thing) => thing.name
    );
    const sortedMetaNames = SANITY_META_TYPES_NAMES.filter((thing) =>
        metaTypes.includes(thing)
    );
    const unsortedFieldNames = fields
        .filter((field) =>
            ACCEPTED_TYPES.map((x) => x.name).includes(field.type)
        )
        .map((field) => field.name);
    const sortedFieldNames = allFields
        .map((thing) => thing.name)
        .filter((thing) => unsortedFieldNames.includes(thing));
    return [...sortedMetaNames, ...sortedFieldNames];
}

export function csvFileFromObjects(
    data,
    fields,
    metaTypes,
    fileName,
    allFields
) {
    const headings = headingsSorted(metaTypes, fields, allFields);
    let myFileData = [headings.join(CSV_TOOLS_DELIMETER)];
    data.forEach((dataItem) =>
        myFileData.push(
            headings
                .map((heading) => getValue(dataItem[heading], heading) || "")
                .join(CSV_TOOLS_DELIMETER)
        )
    );
    myFileData = myFileData.join("\n");
    download(myFileData, `${fileName}-CSVTools.tsv`, "text/plain");
}

export function fieldsAndDataProcessed(data, fields, metaTypes, allFields) {
    const headings = headingsSorted(metaTypes, fields, allFields);
    let myFileData = [headings];
    data.forEach((dataItem, index) =>
        myFileData.push(
            headings.map(
                (heading) =>
                    getValue(
                        dataItem[heading],
                        heading,
                        allFields.find((x) => x.name === heading)?.type ||
                            "string"
                    ) || ""
            )
        )
    );
    return myFileData;
}

export function getValue(item, heading, myType) {
    const displayAsIs = ["string", "boolean", "number"];
    if (!item || displayAsIs.includes(typeof item)) {
        return item
            ? ACCEPTED_TYPES?.find((x) => x.name === myType)?.asJSON
                ? JSON.stringify(item)
                : item
            : "";
    } else {
        return (
            item[ACCEPTED_TYPES?.find((x) => x.name === heading)?.query] ||
            JSON.stringify(item)
        );
    }
}

export function makeClipboardCompatible(data) {
    return data.map((thing) => thing.join("\t")).join("\n");
}

//
// Taken from https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string
//
export function isJsonString(str) {
    try {
        var val = JSON.parse(str);
        return typeof val !== 'number' ? true : false;
    } catch (e) {
        return false;
    }
}

export function getEmptyValueFor(type){
    return null
}
