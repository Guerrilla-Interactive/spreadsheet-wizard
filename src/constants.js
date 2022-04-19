export const ACCEPTED_TYPES = [
    { name: "string" },
    { name: "number" },
    { name: "boolean" },
    { name: "date" },
    { name: "datetime" },
    { name: "text" },
    { name: "array"},
    { name: "image"},
    { name: "slug", query: "current", structure: {type: '_slug', value: {name: 'current'}}},
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
