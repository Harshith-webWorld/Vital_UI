import React from 'react'
import CsvDownload from 'react-json-to-csv';

export default function Exportjsontocsv(props) {
    return (
        <CsvDownload data={props.data} filename='dashboard.csv' style={{ marginRight: '15px' }} className='mt-m font-chng btn btn-secondary'>  Export Data  </CsvDownload>
    )
}
