import React, {useContext, useState} from 'react'

const docsDataContext = React.createContext(null)

//
// the is supposed to be an array of objects whose key 
// is the doc name, and the value the data of that docs
//
const defaultDocsValues = []

const DocsDataProvider = ({children}) => {
    const [values, setValues] = useState(defaultDocsValues)
    const DocsDataContext = docsDataContext
    return (
        <DocsDataContext.Provider value={{values, setValues}}>
        {children}
        </DocsDataContext.Provider>
    )
}

const useDocsData = () => {
    const {values, setValues} = useContext(docsDataContext)
    function handleChange(newValue){
        //
        // newValue is supposed to be {doc: 'XXX', value: 'YYY'}
        // where XXX is the doc name and YYY is the value of things in that doc
        //
        setValues(oldValues => !!oldValues.find(thing => thing.doc === newValue.doc) ?
            oldValues.reduce((prev, curr) => [...prev, curr.doc === newValue.doc? newValue: curr], [])
            : [...oldValues, newValue])
    }
    return [values, handleChange] 
}

export {useDocsData, DocsDataProvider}
