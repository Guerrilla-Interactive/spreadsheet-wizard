import React, { useEffect, useState } from "react";
import {useDocsData} from './Context.js'
import { client } from "./CSVTools.js";
import {fieldsAndDataProcessed} from './utils.js'

export default function PreviewData({doc, selectedFields, metaTypes}){
    const [allDocs, setAllDocsData] = useDocsData()
    const [isAvailable, setIsAvailable] = useState(false)
    const [myData, setMyData] = useState(null)

    function callBackOnSuccess(data){
        setIsAvailable(true)
        setMyData(fieldsAndDataProcesse(data, selectedFields, metaTypes))
        setAllDocsData({doc : doc,  value: data})
    }

    function callBackOnFailure(err){
        console.log('error occured')
        console.log(err)
    }


    // Check if we have the currently selected doc data!
    useEffect(() => {
        setIsAvailable(!!allDocs.find(thing => thing.doc === doc))
        setMyData(allDocs.find(thing => thing.doc === doc)?.value || null)
    }, [])

    // Fetch the currently selected doc data!
    useEffect(() => {
        if (!isAvailable){
            fetchData(doc, callBackOnSuccess, callBackOnFailure) 
        }
    }, [isAvailable])

    return (
       <div>
        {!isAvailable ?  <Loading/> : null  }
        {!!myData? 
                <DataTable data={myData}/> 
                : null }
       </div>
    )
}

const Loading = () => (<p>...loading </p>)

const DataTable = ({data}) => (
    <div>
    {JSON.stringify(data, null, 2)}
    </div>
)

function fetchData(doc, callBackOnSuccess, callBackOnFailure) {
    const query = `*[_type == '${doc}']`;
    return client.fetch(query).then(data => callBackOnSuccess(data)).catch(err => callBackOnFailure(err))
}
