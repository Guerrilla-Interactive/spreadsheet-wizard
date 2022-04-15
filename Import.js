import React, {useEffect, useState} from 'react'
import {screenTypes, CSV_TOOLS_DELIMETER} from './constants.js'
import Layout from './Layout.js';
import { client } from "./CSVTools.js";

const Import = ({handleScreenChange}) => {
    return (
        <Layout>
        <h1>Import</h1>
        <p> Imports are supported by file that look like the ones we export, so you might want to see that first!  </p>
        <ImportForm />
        <button onClick={() => handleScreenChange(screenTypes.BEGIN)}>Home</button>
        </Layout>
    )
}

function uploadToSanity(arrayOfObjects, setProcessing, setError, setSuccess){
    // Remove empty lines & objects without ids
    arrayOfObjects = arrayOfObjects.filter(item => !!item._id)
    setProcessing('...uploading...')
    setSuccess('')
    setError('')
    return Promise.all(arrayOfObjects.map(object => {
        return client.createOrReplace(object)
    })).then(
        (msg) => {
            setSuccess(`success! ${arrayOfObjects.length} docs added/modified!`)
            setProcessing('')
            console.log(msg)
        }
      ).catch(err => {
          setError('error, check console for details')
          console.log(err)
          console.log(arrayOfObjects)
          setProcessing('')
      })
};

function processCSVLines(linesOfStrings, onSuccess, onFail){
    linesOfStrings = linesOfStrings.map(thing => thing
        .replace('\r', '')
        .replace('\n', '')
        .replace('\r\n', ''))
    const heading = linesOfStrings[0].split(CSV_TOOLS_DELIMETER)
    // Check if heading contains ID
    if (heading.includes('_id')){
        onSuccess(linesOfStrings.slice(1,).map(item => {
        const thing = item.split(CSV_TOOLS_DELIMETER)
        return thing.reduce((prev, current, index) => ({...prev, [heading[index]]: current}), {}) }))
    }
    else{
        onFail('_id not provided!')
    }
}


const ImportForm = () => {
    const [fileContent, setFileContent] = useState('')
    const [error, setError] = useState('') 
    const [processing, setProcessing] = useState('') 
    const [success, setSuccess] = useState('') 
    function handleFile(e){
        setFile(e.target.value)
    }
    function successCallBack(data){
        uploadToSanity(data, setProcessing, setError, setSuccess)
    }
    function handleImport(e){
        // Don't Reload
        e.preventDefault()

        const file = document.querySelector('#csvFile').files[0]

        const reader = new FileReader();
        reader.onload = function(e){
            processCSVLines(e.target.result.split('\n'), 
                successCallBack, 
                setError)
        }
        reader.readAsText(file, 'utf-8')
    }
    return (

        <div>
            <form onSubmit={handleImport}>
            {error ? <p> Error: {error} </p> : null}
            {processing ? <p>  {processing} </p> : null}
            {success ? <p>  {success} </p> : null}
            <div>
            <label htmlFor="file">Import a '.tsv' file </label>
            </div>
            <input required={true} id="csvFile" name="file" type="file" accept=".tsv" />
            <button type="submit" >Start Import</button>
            </form>
            <p>{fileContent}</p>
        </div>
    )
}

export default Import
