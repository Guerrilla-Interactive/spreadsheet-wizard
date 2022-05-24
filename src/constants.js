import config from "config:spreadsheet-wizard-x";

export const ACCEPTED_TYPES = [
    { name: "string" },
    { name: "number" },
    { name: "boolean", empty: "" },
    { name: "date" },
    { name: "datetime" },
    { name: "text", isJson: true, empty: "" },
    { name: "array", isJson: true, empty: [] },
    { name: "image", isJson: true, empty: {} },
    {
        name: "slug",
        query: "current",
        structure: { type: "_slug", value: { name: "current" } },
    },
    ...(config?.ACCEPTED_TYPES || []),
];

export const SANITY_META_TYPES = [
    {
        name: "_id",
        required: true,
    },
    {
        name: "_createdAt",
    },
    {
        name: "_rev",
    },
    {
        name: "_type",
        required: true,
    },
    {
        name: "_updatedAt",
    },
];

export const screenTypes = {
    BEGIN: "begin",
    IMPORT: "import",
    EXPORT: "export",
};

export const CSV_TOOLS_DELIMETER = "\t";
