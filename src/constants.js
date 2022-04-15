export const ACCEPTED_TYPES = ["string", "number", "boolean", "text"];

export const SANITY_META_TYPES = [
    {
        name: "_id",
        reqiured: true,
    },
    {
        name: "_createdAt",
    },
    {
        name: "_rev",
    },
    {
        name: "_type",
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
